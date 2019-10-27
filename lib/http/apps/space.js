const express = require('express');

const app = express();

/**
 * @api {get} /space/
 * @apiName GetSpace
 * @apiGroup Space
 * @apiVersion 1.0.0
 *  
 * @apiUse GetSpaceSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 * @apiUse InternalServerError
 */
app.get('/', (req, res) => {
  const addresses = {
    coin: res.locals.coinsence.Coin.contract.address,
    acl: res.locals.coinsence.Acl.contract.address,
  }
  res.status(200).json(addresses);
});

/**
 * @api {get} /space/getmemberscount
 * @apiName GetSpaceMembersCount
 * @apiGroup Space
 * @apiVersion 1.0.0
 *  
 * @apiUse GetSpaceMembersCountSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 * @apiUse InternalServerError
 */
// TODO: make more generic
app.get('/getmemberscount', (req, res) => {
  res.locals.coinsence.Space.functions.getMembersCount()
    .then(count => {
      res.status(200).json(count.toNumber());
    });
});

/**
 * @api {get} /space/owner
 * @apiName GetSpaceOwner
 * @apiGroup Space
 * @apiVersion 1.0.0
 *  
 * @apiUse GetSpaceOwnerSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 * @apiUse InternalServerError
 */
app.get('/owner', (req, res) => {
  res.locals.coinsence.Space.functions.owner()
    .then(ownerAddress => {
      res.status(200).json(ownerAddress);
    });
});

/**
 * @api {post} /space/addMembers
 * @apiName PostSpaceMembers
 * @apiGroup Space
 * @apiVersion 1.0.0
 * 
 * @apiParam {String[]} members List of members addresses
 *  
 * @apiUse PostSpaceMembersSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 * @apiUse InternalServerError
 */
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

/**
 * @api {post} /space/leave
 * @apiName PostSpaceLeave
 * @apiGroup Space
 * @apiVersion 1.0.0
 *   
 * @apiUse PostSpaceLeaveSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 * @apiUse InternalServerError
 */
app.post('/leave', (req, res) => {

  res.locals.coinsence.Space.functions.leaveSpace({ gasLimit: 5000000 }).then(transaction => {
    const txHash = transaction.hash;
    res.status(201).json(txHash);
  }).catch(e => {
    console.log(e);
    res.sendStatus(500);
  });
});

/**
 * @api {post} /space/removeMember
 * @apiName PostSpaceRemoveMember
 * @apiGroup Space
 * @apiVersion 1.0.0
 * 
 * @apiUse PostSpaceRemoveMemberSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 * @apiUse InternalServerError
 */
app.post('/removeMember', (req, res) => {
  let memberAddress = req.body.member;

  res.locals.coinsence.Space.functions.removeMember(memberAddress, { gasLimit: 5000000 }).then(transaction => {
    const txHash = transaction.hash;
    res.status(201).json(txHash);
  }).catch(e => {
    console.log(e);
    res.sendStatus(500);
  });
});

module.exports = app;
