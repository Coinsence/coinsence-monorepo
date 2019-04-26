const fs = require('fs');
const ethers = require('ethers');
const path = require('path');

const keysDirectory = process.env.COINSENCE_WALLETS_DIR || path.join(__dirname, '../../../', 'keys');

module.exports = function (accountId, password) {
  return new Promise((resolve, reject) => {
    const walletPath = path.join(keysDirectory, `${accountId}.json`);
    fs.readFile(walletPath, (err, walletJson) => {
      if (err) reject(err);
      else resolve(ethers.Wallet.fromEncryptedJson(walletJson, password));
    });
  });
}
