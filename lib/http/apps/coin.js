const express = require('express');

const app = express();

app.post(`/issue`, (req, res) => {
    let name = req.body.name;
    let symbol = req.body.symbol;
    let decimals = req.body.decimals;

    console.log(`New coin: ${name} ${symbol} ${decimals}`);

    res.locals.coinsence.Coin.functions.issueCoin(name, symbol, decimals).then(ret => {
        console.log(ret);
        res.status(201);
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    })
});

app.post(`/mint`, (req, res) => {
    let recipient = res.body.recipient;
    let amount = req.body.amount;

    res.locals.coinsence.Coin.functions.mintCoin(recipient, amount).then(ret => {
        console.log(ret);
        res.status(201);
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
});

module.exports = app;
