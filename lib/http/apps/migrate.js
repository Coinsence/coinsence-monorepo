const express = require('express');

const app = express();


/**
 * @api {post} /migrate/space
 * @apiName PostMigrateSpace
 * @apiGroup Migrate
 * @apiVersion 1.0.0
 * 
 * @apiParam {Object[]} accounts List of accounts objects
 *  
 * @apiUse PostMigrateSpaceSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 */
app.post('/space', (req, res) => {
    const accounts = req.body.accounts;
  
    if (!Array.isArray(accounts)) {
        res.status(400).json({error: 'accounts is missing'});
    } else {
        accounts.forEach((account) => {
            res.locals.coinsence.Space.functions.addMembers(account.address, { gasLimit: 5000000 })
            .then(addTx => {
                res.locals.coinsence.Coin.functions.mintCoin(account.address, account.balance, { gasLimit: 5000000 }).catch(e => {
                    console.log(e);
                });
            }).catch(e => {
                console.log(e);
            });      
        });

        res.sendStatus(201);
    }
});
  
module.exports = app;