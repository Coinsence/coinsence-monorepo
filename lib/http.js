const express = require('express');
const Coinsence = require('./coinsence');
const ethers = require('ethers');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;

const NO_PARAM = () => null;
const ID_PARAM = (params) => params.id;
const ADDRESS_PARAM = (params) => params.address;
const ALL_PARAMS = (params) => params;

// TODO: maybe move to config file? or create dynamically?
const endpoints = {
  Coin: {
    balanceOf: ADDRESS_PARAM
  },
  Space: {
    getMembersCount: NO_PARAM
  },
  Member: {
    addMember: ALL_PARAMS
  }
};

async function main() {
  let ethProvider;
  let signer = null;
  if (process.env.ETH_PROVIDER_URL) {
    ethProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
  } else {
    ethProvider = new ethers.getDefaultProvider('rinkeby'); // TODO: use correct network
  }
  if (process.env.COINSENCE_WALLET_PATH) {
    const wallet = loadWallet(process.env.COINSENCE_WALLET_PATH, process.env.COINSENCE_WALLET_PASSWORD);
    signer = wallet.connect(ethProvider);
  }

  const coinsence = await new Coinsence(ethProvider, signer).init();

  Object.keys(endpoints).forEach(contractName => {
    const methods = endpoints[contractName];
    Object.keys(methods).forEach(methodName => {
      // ToDo get is OK for reading from the contract
      // but we should use POST for writing to the contract
      app.get(`/${contractName.toLowerCase()}/${methodName.toLowerCase()}`, (req, res) => {
        let params = methods[methodName](req.query);
        let result;
        if (coinsence[contractName][methodName]) {
          result = coinsence[contractName][methodName](params);
        } else {
          result = coinsence[contractName].functions[methodName](params);
        }
        result.then(ret => {
          res.json(ret);
        }).catch(e => {
          console.log(e);
          res.sendStatus(500);
        })
      });
    })
  });

  app.post(`/wallets`, (req, res) => {
    let accountId = req.query.accountId;

    if(accountId == undefined) {
      res.status(400).end();
    }
    else {
      createWallet(accountId).then(ret => {
        res.status(201).end();
      }).catch(e => {
        console.log(e);
        res.sendStatus(500);
      });
    }
  })
  
  app.listen(port, () => console.log(`Coinsence listening on port ${port}!`))
}

async function createWallet(accountId) {
  let wallet = await ethers.Wallet.createRandom();
  fs.writeFileSync(`./keys/${accountId}.json`, JSON.stringify(wallet));
}

async function loadWallet(path, password) {
  let wallet;
  const walletJson = fs.readFileSync(path);
  try {
    wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password);
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
  return wallet;
}

main();