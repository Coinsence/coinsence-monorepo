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
 * @apiUse InternalServerError
 */
app.post(`/`, (req, res) => {
  const accountsIds = req.body.accountsIds;
  let result = [];

  if (!accountsIds) {
    res.status(400).json({error: 'accountIds is missing'});
  } else {
    for(let accountId in accountsIds) {
      createEncryptedWallet(accountId, password).then(wallet => {
        if (res.locals.coinsenceSigner) {
          res.locals.coinsenceSigner.sendTransaction({
            to: wallet.address,
            value: ethers.utils.parseEther('0.1')
          });
        }
        result.push({
          accountId: wallet.address
          //mnemonic: wallet.mnemonic
        });
      }).catch(e => {
        console.log(e);
        if(e.errno == -17) {
          loadWallet(accountId, password).then((wallet) => {
            result.push({
              accountId: wallet.address
              //mnemonic: wallet.mnemonic
            });
          })
        }
        else {
          res.sendStatus(500);
        }
      });
    }

    res.status(201).json(result);
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
