const express = require('express');
const app = express();

app.post(`/addMember`, (req, res) => {
    let address = req.body.address;
    let ipfsHash = req.body.ipfsHash;

    res.locals.memberApp.contract.functions.addMember(address, ipfsHash, { gasLimit: 5000000 }).then(transaction => {
        const txHash = transaction.hash;
        res.status(201).json(txHash);
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    })
});

app.post(`/updateMemberAccount`, (req, res) => {
    let id = req.body.id;
    let oldAccount = req.body.oldAccount;
    let newAccount = req.body.newAccount;

    res.locals.memberApp.contract.functions.updateMemberAccount(id, oldAccount, newAccount, { gasLimit: 5000000 }).then(transaction => {
        const txHash = transaction.hash;
        res.status(201).json(txHash);
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    })
});

app.post(`/updateMemberIpfsHash`, (req, res) => {
    let id = req.body.id;
    let ipfsHash = req.body.ipfsHash;

    res.locals.memberApp.contract.functions.updateMemberIpfsHash(id, ipfsHash, { gasLimit: 5000000 }).then(transaction => {
        const txHash = transaction.hash;
        res.status(201).json(txHash);
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    })
});

module.exports = app;