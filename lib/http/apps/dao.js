const express = require('express');

const app = express();

/**
 * @api {post} /dao/
 * @apiName PostDao
 * @apiGroup Dao
 * @apiVersion 1.0.0
 * 
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

  res.locals.kit.newInstance({ spaceId, spaceName, descHash, coinName, coinSymbol, coinDecimals, root: res.locals.wallet.address }, { gasLimit: 5000000 });
  res.sendStatus(201);
});

module.exports = app;
