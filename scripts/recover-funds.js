const fs = require('fs');
const ethers = require('ethers');
const path = require('path');
const loadWallet = require('../lib/http/utils/load-wallet.js');

const keysDirectory = process.env.COINSENCE_WALLETS_DIR || path.join(__dirname, '../', 'keys');
const coinsenceWallet = process.env.COINSENCE_WALLET_ADDRESS;
const password = process.env.PASSWORD || "coinsence";

let ethProvider = new ethers.getDefaultProvider('rinkeby');

fs.readdir(keysDirectory, function (err, accounts) {
  if (err) {
    return console.log('Error fetching wallets: ' + err);
  }
  else {
    accounts.forEach(function (account) {
      let accountId = path.basename(account, '.json');
      
      loadWallet(accountId, password).then(async(wallet) => {
        let signer = wallet.connect(ethProvider);

        let walletBalance = await ethProvider.getBalance(wallet.address);
        let tx = {
          to: coinsenceWallet,
          value: walletBalance
        };
        let estimatedGasPrice = await ethProvider.estimateGas(tx);
        tx.value = walletBalance - estimatedGasPrice;

        signer.sendTransaction(tx).then(transaction => {
          transaction.wait().then(result => {
            console.log(result.transactionHash);
          });
        });
      }).catch(e => {
        console.log(e);
        new Error("Can't access wallet file");
      });
    });
  }
});
    