const express = require('express');
const ethers = require('ethers');

const createEncryptedWallet = require('../utils/create-wallet.js');
const loadWallet = require('../utils/load-wallet.js');

const app = express();

// ToDo: set globally in memory
const password = process.env.PASSWORD || "coinsence";

/**
 * @api {post} /wallet/
 * @apiName PostWallet
 * @apiGroup Wallet
 * @apiVersion 1.0.0
 *
 * @apiParam {String[]} accountsIds Accounts unique ID.
 *
 * @apiUse PostWalletSuccess
 *
 * @apiUse MissingAccountsIdsError
 */
app.post(`/`, async (req, res) => {
  const accountsIds = req.body.accountsIds;
  let result = [];

  if (!Array.isArray(accountsIds)) {
    res.status(400).json({error: 'accountIds is missing'});
  } else {
    let results = [];
    for (let i=0; i<accountsIds.length; i++) {
      let accountId = accountsIds[i];
      try {
        let wallet = await createEncryptedWallet(accountId, password);
        if (res.locals.coinsenceSigner) {
          await res.locals.coinsenceSigner.sendTransaction({
            to: wallet.address,
            value: ethers.utils.parseEther('0.1')
          });
        }
        results.push({ accountId: accountId, address: wallet.address });
      } catch(e) {
        if(e['errno'] == -17) {
            let wallet = await loadWallet(accountId, password);              
            results.push({ accountId: accountId, address: wallet.address });
        }
        else {
          console.log(e);
          results.push({});
        }
      };
    };
    res.status(201).json(results);
  }
});

/**
 * @api {get} /wallet/
 * @apiName GetWallet
 * @apiGroup Wallet
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} accountId Accounts unique ID.
 *
 * @apiUse GetWalletSuccess
 *
 * @apiUse MissingAccountIdError
 * @apiUse LoadWalletError
 */

app.get(`/`, (req, res) => {
  const accountId = req.body.accountId || req.query.accountId;
  if (!accountId) {
    res.status(400).json({error: 'accountId is missing'});
  } else {
    loadWallet(accountId, password)
    .then(async (wallet) => {
      const address = wallet.address;
      const balance = await res.locals.ethProvider.getBalance(address);
      const balanceWei = balance.toString();
      const balanceEther = ethers.utils.formatEther(balance);
      const balanceHex = balance.toHexString();

      const transactionCount = await res.locals.ethProvider.getTransactionCount(address);

      res.status(201).json({ address, balanceWei, balanceEther, balanceHex, transactionCount });
    })
    .catch(e => {
      console.log(e);
      res.status(404).json({error: 'Could not load wallet'});
    });
  }
});

module.exports = app;
