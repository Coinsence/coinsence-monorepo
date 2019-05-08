const fs = require('fs');
const ethers = require('ethers');
const path = require('path');
const loadWallet = require('./load-wallet.js');

const keysDirectory = process.env.COINSENCE_WALLETS_DIR || path.join(__dirname, '../../../', 'keys');
const password = process.env.PASSWORD || "coinsence";

let ethProvider;
let coinsenceSigner;

ethProvider = new ethers.getDefaultProvider('rinkeby'); // TODO: use correct network
if (process.env.COINSENCE_KEY) {
    const coinsenceWallet = new ethers.Wallet(process.env.COINSENCE_KEY);
    coinsenceSigner = coinsenceWallet.connect(ethProvider)
}


fs.readdir(keysDirectory, function (err, accounts) {
    if (err) {
        return console.log('Error fetching wallets: ' + err);
    }
    else {
        accounts.forEach(function (account) {
            let accountId = path.basename(account, '.json');
            
            if(accountId != ".gitkeep") {
                loadWallet(accountId, password).then(async(wallet) => {
                    let walletBalance = await ethProvider.getBalance(wallet.address);
                    
                    wallet.sendTransaction({
                        to: coinsenceSigner.address,
                        value: walletBalance
                    });
                });
            }
        });
    }
});
    