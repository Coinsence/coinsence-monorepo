const express = require('express');
const ethers = require('ethers');

const app = express();

app.post(`/issue`, (req, res) => {
    let name = req.body.name;
    let symbol = req.body.symbol;
    let decimals = req.body.decimals;

    console.log(`New coin: ${name} ${symbol} ${decimals}`);

    res.locals.coinsence.Coin.functions.issueCoin(name, symbol, decimals, { gasLimit: 5000000 }).then(transaction => {
        const txHash = transaction.hash;
        res.status(201).json(txHash);
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    })
});

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

module.exports = app;
