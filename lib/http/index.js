const express = require('express');
const ethers = require('ethers');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Sentry = require('@sentry/node');
const https = require('https')
const fs = require('fs');
const path = require('path');
const ABI = require('../abis/Coin.json');

Sentry.init({ dsn: process.env.SENTRY_DSN });

const port = process.env.PORT || 3000;
//TODO save into memory
const password = process.env.PASSWORD || "coinsence";
const daosDirectory = process.env.COINSENCE_DAO_DIR || path.join(__dirname, '../', 'daos');

const middlewares = require('./middlewares');

const app = express();

const walletApp = require('./apps/wallet');
const daoApp = require('./apps/dao');
const spaceApp = require('./apps/space');
const coinApp = require('./apps/coin');
const migrateApp = require('./apps/migrate');
const genericApp = require('./apps/generic');

function setTransferEventListener(coinAddress, provider) {
  let contract = new ethers.Contract(coinAddress, ABI, provider);

  let filter = contract.filters.Transfer(null, null);
  contract.on(filter, (from, to, value, event) => {
    // ignore mint function event
    if(from != "0x0000000000000000000000000000000000000000") {
      console.log("sync tx ", event.transactionHash);

      const data = JSON.stringify({
        fromAddress: from,
        toAddress: to, 
        coinAddress: contract.address, 
        amount: value.toNumber(), 
        txHash: event.transactionHash
      });
      
      const options = {
        hostname: `${process.env.HUMHUB_WEBSERVICE}`,
        port: 443,
        path: '/ethereum/transaction/synchronize',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };
      
      const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
      });
      
      req.on('error', error => {
        console.error(error);
      });
      
      req.write(data);
      req.end();
    }
  });
}  

let ethProvider;
let coinsenceSigner;
if (process.env.ETH_PROVIDER_URL) {
  ethProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
  coinsenceSigner = ethProvider.getSigner(parseInt(process.env.SIGNER_INDEX));
} else {
  ethProvider = new ethers.getDefaultProvider('rinkeby'); // TODO: use correct network
  const password = process.env.PASSWORD || 'coinsence'; // TODO: load in memory only
  if (process.env.COINSENCE_KEY) {
    const coinsenceWallet = new ethers.Wallet(process.env.COINSENCE_KEY);
    coinsenceSigner = coinsenceWallet.connect(ethProvider)
  }
  // sadly fromEncryptedJson is async and returns a promise, which does not work for us here
  // const coinsenceWalletPath = process.env.COINSENCE_WALLET_PATH || path.join(__dirname, '../../', 'coinsence-wallet.json');
  //if (fs.existsSync(coinsenceWalletPath)) {
    //const walletJson = fs.readFileSync(coinsenceWalletPath);
    //const coinsenceWallet = ethers.Wallet.fromEncryptedJson(walletJson, password);
    //coinsenceSigner = coinsenceWallet.connect(ethProvider);
  //}
}
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(middlewares.setEthProviderAndSigner(ethProvider, coinsenceSigner));
app.use(middlewares.monitoring);
app.use(
  '/wallet',
  walletApp
);
app.use(
  '/dao',
  middlewares.requireAccountId,
  middlewares.requireWallet({ password }),
  middlewares.loadCoinsenceKit({ ethProvider, coinsenceSigner }),
  daoApp
);
app.use(
  '/migrate',
  [
    middlewares.requireAccountId,
    middlewares.requireDao,
    middlewares.loadCoinsence({ password, ethProvider })
  ],
  migrateApp
);
app.use(
  '/space',
  [
    middlewares.requireAccountId,
    middlewares.requireDao,
    middlewares.loadCoinsence({ password, ethProvider })
  ],
  spaceApp
);
app.use(
  '/coin',
  [
    middlewares.requireAccountId,
    middlewares.requireDao,
    middlewares.loadCoinsence({ password, ethProvider })
  ],
  coinApp
);
app.use(
  '/',
  [
    middlewares.requireAccountId,
    middlewares.requireDao,
    middlewares.loadCoinsence({ password, ethProvider })
  ],
  genericApp
);

ethProvider.getNetwork().then(network => {
  console.log('Connected to network: ', network);
})
ethProvider.getBlockNumber().then(block => {
  console.log('Latest block: ', block);
})
app.listen(port, () => {
  console.log(`Coinsence listening on port ${port}!`);

  console.log("start setting listeners for old DAOs");

  fs.readdir(daosDirectory, async function (err, daos) {
    if (err) {
      return console.log('Error fetching wallets: ' + err);
    }
    else {
      for(let i=0; i<daos.length; i++) {
        let daoPath = path.join(daosDirectory, `${daos[i]}`);
        fs.readFile(daoPath, (err, dao) => {
          let daoObject = JSON.parse(dao);
          console.log(daoObject);
  
          setTransferEventListener(daoObject.apps[1].proxy, ethProvider);
        });
      }
    }
  });

  console.log("done.");
})
