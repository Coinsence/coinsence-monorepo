const express = require('express');

const app = express();


/**
 * @api {post} /migrate/space
 * @apiName PostMigrateSpace
 * @apiGroup Migrate
 * @apiVersion 1.0.0
 *
 * @apiParam {Object[]} accounts List of account
 * @apiParam {String}   accounts.address account address
 * @apiParam {String}   accounts.accountId account unique id
 * @apiParam {Number}   accounts.balance account balance
 * @apiParam {Boolean}  accounts.isMember account status(member/space account)
 *
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 */
app.post('/space', async (req, res) => {
    const accounts = req.body.accounts;

    if (!Array.isArray(accounts)) {
        res.status(400).json({error: 'accounts is missing'});
    } else {
        const walletTransactionCount = await res.locals.coinsence.provider.getTransactionCount(res.locals.coinsence.signer.address);
        let nonce = walletTransactionCount;
        accounts.forEach((account) => {
            if(account.balance > 0) {
                res.locals.coinsence.Coin.functions.mintCoin(account.address, ethers.utils.parseEther(account.balance.toString()), { gasLimit: 5000000, nonce: nonce++ }).catch(e => {
                    console.log(e);
                });
            }
            if(account.isMember == true) {
                res.locals.coinsence.Space.functions.addMembers([account.address], { gasLimit: 5000000, nonce: nonce++ }).catch(e => {
                    console.log(e);
                });
            }
        });

        res.sendStatus(201);
    }
});

module.exports = app;