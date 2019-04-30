const express = require('express');

const app = express();

app.post(`/`, (req, res) => {
  let name = req.body.name;
  let descHash = req.body.descHash;

  console.log(`New DAO: ${name} ${descHash} with root: ${res.locals.wallet.address}`);
  res.locals.kit.newInstance({ name, descHash, root: res.locals.wallet.address }, { gasLimit: 5000000 }).then((dao) => {
    res.status(201).json(dao);
  }).catch(e => {
    console.log(e);
    res.sendStatus(500);
  });

});

module.exports = app;
