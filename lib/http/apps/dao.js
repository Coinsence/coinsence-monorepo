const express = require('express');

const app = express();

/**
 * @api {post} /dao/
 * @apiName PostDao
 * @apiGroup Dao
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} accountId Accounts unique ID.
 * @apiParam {String} name Space name
 * @apiParam {String} descHash IPFS hash 
 * 
 * @apiUse PostWalletSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse ExistantWalletError
 * @apiUse InternalServerError
 */
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
