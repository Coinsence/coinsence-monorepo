const fs = require('fs');
const ethers = require('ethers');
const path = require('path');

module.exports = function (accountId, password) {
  return new Promise((resolve, reject) => {
    const walletPath = path.join(__dirname, '../../../', 'keys', `${accountId}.json`);
    fs.readFile(walletPath, (err, walletJson) => {
      if (err) reject(err);
      else resolve(ethers.Wallet.fromEncryptedJson(walletJson, password));
    });
  });
}
