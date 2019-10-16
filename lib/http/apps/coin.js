const express = require('express');
const ethers = require('ethers');

const app = express();

/**
 * @api {post} /coin/mint/
 * @apiName PostCoinMint
 * @apiGroup Coin
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} recipient Recipient address.
 * @apiParam {Number} amount Coin amount.
 * 
 * @apiUse PostCoinMintSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 * @apiUse InternalServerError
 */
app.post(`/mint`, (req, res) => {
    let recipient = req.body.recipient;
    let amount = req.body.amount;

    res.locals.coinsence.Coin.functions.mintCoin(recipient, amount, { gasLimit: 5000000 }).then(transaction => {
        const txHash = transaction.hash;
        res.status(201).json(txHash);
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
});

/**
 * @api {post} /coin/transfer/
 * @apiName PostCoinTransfer
 * @apiGroup Coin
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} to Recipient address.
 * @apiParam {Number} amount Coin amount.
 * 
 * @apiUse PostCoinTransferSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 * @apiUse InternalServerError
 */
app.post(`/transfer`, (req, res) => {
    let to = req.body.to;
    let amount = req.body.amount;

    res.locals.coinsence.Coin.functions.transfer(to, amount, { gasLimit: 5000000 }).then(transaction => {
        console.log(transaction);
        res.status(201).json(transaction);
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
});

/**
 * @api {get} /coin/balance/
 * @apiName GetCoinBalance
 * @apiGroup Coin
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} owner Owner address.
 * 
 * @apiUse GetCoinBalanceSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 * @apiUse InternalServerError
 */
app.get(`/balance`, (req, res) => {
    let owner = req.body.owner;

    res.locals.coinsence.Coin.functions.balanceOf(owner).then((result) => {
        let balanceHex = result._hex;
        let balance = result.toString();
        res.status(201).json({ balanceHex, balance });
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
});

/**
 * @api {get} /coin/totalsupply/
 * @apiName GetCoinTotalsupply
 * @apiGroup Coin
 * @apiVersion 1.0.0
 *  
 * @apiUse GetCoinTotalsupplySuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 * @apiUse InternalServerError
 */
app.get(`/totalsupply`, (req, res) => {
    res.locals.coinsence.Coin.functions.totalSupply().then((result) => {
        let supplyHex = result._hex;
        let supply = result.toString();
        res.status(201).json({ supplyHex, supply });
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
});

/**
 * @api {post} /coin/setTransferEventListener
 * @apiName PostTransferEventListener
 * @apiGroup Coin
 * @apiVersion 1.0.0
 * 
 * @apiUse PostSetTransferEventListenerSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 * @apiUse InternalServerError
 */
app.post(`/setTransferEventListener`, (req, res) => {
    res.locals.coinsence.Coin.setTransferEventListener();
    res.sendStatus(201);
});

module.exports = app;
