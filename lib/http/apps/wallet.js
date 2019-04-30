const express = require('express');
const ethers = require('ethers');

const createEncryptedWallet = require('../utils/create-wallet.js');
const loadWallet = require('../utils/load-wallet.js');

const app = express();

// ToDo: set globally in memory
const password = process.env.PASSWORD || "coinsence";

app.post(`/`, (req, res) => {
  createEncryptedWallet(res.locals.accountId, password).then(wallet => {
    if (res.locals.coinsenceSigner) {
      res.locals.coinsenceSigner.sendTransaction({
        to: wallet.address,
        value: ethers.utils.parseEther('0.3')
      });
    }
    res.status(201).json({
      address: wallet.address,
      mnemonic: wallet.mnemonic
    });
  }).catch(e => {
    console.log(e);
    if(e.errno == -17) {
      res.status(409).json({
        error: "account already has a wallet"
      });
    }
    else {
      res.sendStatus(500);
    }
  });
});

app.get(`/`, (req, res) => {
  loadWallet(res.locals.accountId, password)
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
});

module.exports = app;
