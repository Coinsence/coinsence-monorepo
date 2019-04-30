const express = require('express');
const Coinsence = require('../coinsence');
const CoinsenceKit = require('../kit');
const ethers = require('ethers');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

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
const spaceApp = require('./apps/space');
const coinApp = require('./apps/coin');;
const genericApp = require('./apps/generic');

let ethProvider;
let coinsenceSigner;
if (process.env.ETH_PROVIDER_URL) {
  ethProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
  coinsenceSigner = ethProvider.getSigner();
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

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(middlewares.setEthProviderAndSigner(ethProvider, coinsenceSigner));
app.use(middlewares.monitoring);
app.use(middlewares.requireAccountId);
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
  '/space',
  [
    middlewares.requireDao,
    middlewares.loadCoinsence({ password, ethProvider })
  ],
  spaceApp
);
app.use(
  '/coin',
  [
    middlewares.requireDao,
    middlewares.loadCoinsence({ password, ethProvider })
  ],
  coinApp
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
