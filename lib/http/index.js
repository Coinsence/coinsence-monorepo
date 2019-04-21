const express = require('express');
const Coinsence = require('../coinsence');
const CoinsenceKit = require('../kit');
const ethers = require('ethers');
const bodyParser = require('body-parser');
const fs = require('fs');

const port = process.env.PORT || 3000;
//TODO save into memory
const password = process.env.PASSWORD || "coinsence";

const loadCoinsenceMiddleware = require('./middlewares/load-coinsence');
const loadKitMiddleware = require('./middlewares/load-coinsence-kit');
const middlewares = require('./middlewares');

const app = express();
const router = express.Router();

const walletApp = require('./apps/wallet');
const daoApp = require('./apps/dao');
const genericApp = require('./apps/generic');

let ethProvider;
if (process.env.ETH_PROVIDER_URL) {
  ethProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
} else {
  ethProvider = new ethers.getDefaultProvider('rinkeby'); // TODO: use correct network
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(middlewares.requireAccountId);
app.use(middlewares.setEthProvider(ethProvider));
app.use(
  '/wallet',
  walletApp
);
app.use(
  '/dao',
  middlewares.loadCoinsenceKit({ password, ethProvider }),
  daoApp
);
app.use(
  '/',
  [
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
app.listen(port, () => console.log(`Coinsence listening on port ${port}!`))
