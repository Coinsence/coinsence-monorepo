const express = require('express');

const createEncryptedWallet = require('../utils/create-wallet.js');
const loadWallet = require('../utils/load-wallet.js');

const app = express();

// ToDo: set globally in memory
const password = process.env.PASSWORD || "coinsence";

app.post(`/`, (req, res) => {
  createEncryptedWallet(res.locals.accountId, password).then(wallet => {
    res.locals.ethProvider.sendTransaction({
      to: wallet.address,
      value: 1
    }).then(_ => {
      res.status(201).json({ address: wallet.address });
    }).catch(console.log);
  }).catch(e => {
    console.log(e);
    res.sendStatus(500);
  });
});

app.get(`/`, (req, res) => {
  loadWallet(res.locals.accountId, password).then((ret) => {
    res.status(201).json(ret);
  });
});

module.exports = app;
