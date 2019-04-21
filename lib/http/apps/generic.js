const express = require('express');

const app = express();

const NO_PARAM = () => null;
const ID_PARAM = (params) => params.id;
const ADDRESS_PARAM = (params) => params.address;
const ALL_PARAMS = (params) => params;

// TODO: maybe move to config file? or create dynamically?
const endpoints = {
  Coin: {
    balanceOf: ADDRESS_PARAM
  },
  Space: {
    getMembersCount: NO_PARAM
  },
  Member: {
    addMember: ALL_PARAMS
  }
};

Object.keys(endpoints).forEach(contractName => {
  const methods = endpoints[contractName];
  Object.keys(methods).forEach(methodName => {
    // ToDo get is OK for reading from the contract
    // but we should use POST for writing to the contract
    app.get(`/${contractName.toLowerCase()}/${methodName.toLowerCase()}`, (req, res) => {
      const coinsence = res.locals.coinsence;
      let params = methods[methodName](req.query);
      let result;
      if (coinsence[contractName][methodName]) {
        result = coinsence[contractName][methodName](params);
      } else {
        result = coinsence[contractName].functions[methodName](params);
      }
      result.then(ret => {
        res.json(ret);
      }).catch(e => {
        console.log(e);
        res.sendStatus(500);
      })
    });
  })
});

module.exports = app;
