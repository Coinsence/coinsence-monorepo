const express = require('express');

const app = express();

app.post(`/`, (req, res) => {
  let spaceName = req.body.spaceName;
  let descHash = req.body.descHash;
  let coinName = req.body.coinName;
  let coinSymbol = req.body.coinSymbol;
  let coinDecimals = req.body.coinDecimals;

  console.log(`New DAO: ${spaceName} ${descHash} ${coinName} ${coinSymbol} ${coinDecimals}  with root: ${res.locals.wallet.address}`);
  res.locals.kit.newInstance({ spaceName, descHash, coinName, coinSymbol, coinDecimals, root: res.locals.wallet.address }, { gasLimit: 5000000 }).then((dao) => {
    res.status(201).json(dao);
  }).catch(e => {
    console.log(e);
    res.sendStatus(500);
  });

});

module.exports = app;
