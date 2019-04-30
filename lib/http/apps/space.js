const express = require('express');

const app = express();

app.get('/', (req, res) => {
  const addresses = {
    coin: res.locals.coinsence.Coin.contract.address,
    acl: res.locals.coinsence.Acl.contract.address,
  }
  res.status(200).json(addresses);
});

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

app.post('/addMembers', (req, res) => {
  let members = req.body.members;

  console.log(`list of members: ${members}`);

  res.locals.coinsence.Space.functions.addMembers(members, { gasLimit: 5000000 })
    .then(transaction => {
        const txHash = transaction.hash;
        res.status(201).json(txHash);
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
});

app.post('/leave', (req, res) => {

  res.locals.coinsence.Space.functions.leaveSpace({ gasLimit: 5000000 }).then(transaction => {
    const txHash = transaction.hash;
    res.status(201).json(txHash);
  }).catch(e => {
    console.log(e);
    res.sendStatus(500);
  });
});

module.exports = app;
