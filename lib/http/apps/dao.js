const express = require('express');

const loadDao = require('../utils/load-dao.js');
const saveDao = require('../utils/save-dao.js');

const app = express();

/**
 * @api {post} /dao/
 * @apiName PostDao
 * @apiGroup Dao
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} spaceId space id
 * @apiParam {String} spaceName Space name
 * @apiParam {String} descHash IPFS hash 
 * @apiParam {String} coinName Coin name
 * @apiParam {String} coinSymbol Coin symbol
 * @apiParam {String} coinDecimals Coin decimals
 * 
 * @apiUse PostDaoSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse InternalServerError
 */
app.post(`/`, (req, res) => {
  let spaceId = req.body.spaceId;
  let spaceName = req.body.spaceName;
  let descHash = req.body.descHash;
  let coinName = req.body.coinName;
  let coinSymbol = req.body.coinSymbol;
  let coinDecimals = req.body.coinDecimals;

  console.log(`New DAO: ${spaceName} ${descHash} ${coinName} ${coinSymbol} ${coinDecimals}  with root: ${res.locals.wallet.address}`);

  res.locals.kit.newInstance({ spaceName, descHash, coinName, coinSymbol, coinDecimals, root: res.locals.wallet.address }, { gasLimit: 5000000 }).then(transaction => {
    res.sendStatus(201);

    return transaction.wait(1).then(result => {
      const txHash = result.transactionHash;
      const deployEvent = result.events.find(l => l.event === 'DeployInstance');
      //return apps proxy address
      const apps = result.events
        .filter(l => l.event === 'InstalledApp')
        .map(event => {
          return { id: event.args.appId, proxy: event.args.appProxy }
        })
      if (!deployEvent) { throw new Error('No DeployInstance event found') }

      saveDao(spaceId, JSON.stringify({ txHash: txHash, daoAddress: deployEvent.args.dao, apps: apps }));
    }).catch(e => {
      res.sendStatus(500);
      throw new Error(e);
    })  
    
  });
});

/**
 * @api {get} /dao/
 * @apiName GetDao
 * @apiGroup Dao
 * @apiVersion 1.0.0
 *
 * @apiParam {String} spaceId Space unique ID.
 *
 * @apiUse GetDaoSuccess
 *
 * @apiUse MissingAccountIdError
 * @apiUse MissingSpaceIdError
 * @apiUse LoadDaoError
 */

app.get(`/`, (req, res) => {
  const spaceId = req.body.spaceId || req.query.spaceId;
  if (!spaceId) {
    res.status(400).json({error: 'spaceId is missing'});
  } else {
    loadDao(spaceId)
    .then(async (dao) => {
      res.status(201).json(dao);
    })
    .catch(e => {
      console.log(e);
      res.status(404).json({error: 'Could not load dao'});
    });
  }
});

module.exports = app;
