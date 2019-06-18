const fs = require('fs');
const ethers = require('ethers');
const path = require('path');
const loadWallet = require('../lib/http/utils/load-wallet.js');
const sweep = require('./helpers/sweep.js');

const keysDirectory = process.env.COINSENCE_WALLETS_DIR || path.join(__dirname, '../', 'keys');
const coinsenceWallet = process.env.COINSENCE_WALLET_ADDRESS;
const password = process.env.PASSWORD || "coinsence";

let ethProvider;
if (process.env.ETH_PROVIDER_URL) {
  ethProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
} else {
  ethProvider = new ethers.getDefaultProvider('rinkeby');
}

// Make sure we are sweeping to an EOA, not a contract. The gas required
// to send to a contract cannot be certain, so we may leave dust behind
// or not set a high enough gas limit, in which case the transaction will
// fail.
ethProvider.getCode(coinsenceWallet).then((code) => {
  if (code !== '0x') { throw new Error('Cannot sweep to a contract'); }

  fs.readdir(keysDirectory, async function (err, accounts) {
    if (err) {
      return console.log('Error fetching wallets: ' + err);
    }
    else {
      for(let i=0; i<accounts.length; i++) {
        let accountId = path.basename(accounts[i], '.json');
        await transferFund(accountId, password, ethProvider, coinsenceWallet);
      }
    }
  });

});

async function transferFund(accountId, password, provider, newAddress) {
  try {
    let wallet = await loadWallet(accountId, password);
    let signer = wallet.connect(provider);
    await sweep(signer, ethProvider, newAddress);
  }
  catch(err) {
    console.log(err);
    new Error(`Can't load wallet for the accountId: ${accountId}`);
  }
}
