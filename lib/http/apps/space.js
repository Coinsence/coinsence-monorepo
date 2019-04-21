const express = require('express');

const app = express();

// TODO: make more generic
app.get('/getmemberscount', (req, res) => {
  res.locals.coinsence.Space.functions.getMembersCount()
    .then(count => {
      res.status(200).json(count.toNumber());
    });
});

app.get('/owner', (req, res) => {
  res.locals.coinsence.Space.functions.owner()
    .then(ownerAddress => {
      res.status(200).json(ownerAddress);
    });
});

module.exports = app;
