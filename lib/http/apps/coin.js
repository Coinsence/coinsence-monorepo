const express = require('express');
const ethers = require('ethers');

const createEncryptedWallet = require('../utils/create-wallet.js');

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
 * @api {post} /coin/wallet/mint
 * @apiName PostCoinWalletMint
 * @apiGroup Coin
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} recipient Recipient address.
 * @apiParam {Number} amount Coin amount.
 * 
 * @apiUse PostCoinWalletMintSuccess
 * 
 * @apiUse MissingAccountIdError
 * @apiUse MissingDaoError
 * @apiUse InternalServerError
 */
app.post(`coin/wallet/mint`, (req, res) => {
    let recipient = req.body.recipient;
    let amount = req.body.amount;
    createEncryptedWallet(res.locals.accountId, password).then(wallet => {
        if (res.locals.coinsenceSigner) {
          res.locals.coinsenceSigner.sendTransaction({
            to: wallet.address,
            value: ethers.utils.parseEther('0.1')
          }).then((fundTx) => {
            res.locals.coinsence.Coin.functions.mintCoin(recipient, amount, { gasLimit: 5000000 }).then(mintTx => {
                const txHash = mintTx.hash;
                res.status(201).json({
                    address: wallet.address,
                    mnemonic: wallet.mnemonic,
                    mintTxHash: txHash
                });
            }).catch(e => {
                console.log(e);
                res.sendStatus(500);
            });
          });
        }
        res.status(201).json({
          address: wallet.address,
          mnemonic: wallet.mnemonic
        });
    }).catch(e => {
        console.log(e);
        if(e.errno == -17) {
            res.status(409).json({
            error: "account already has a wallet"
            });
        }
        else {
            res.sendStatus(500);
        }
    });
});

module.exports = app;
