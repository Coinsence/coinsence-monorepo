const fs = require('fs');
const ethers = require('ethers');

module.exports = function (accountId, password) {
  return new Promise((resolve, reject) => {
    const walletPath = `./keys/${accountId}.json`;
    fs.readFile(walletPath, (err, walletJson) => {
      if (err) reject(err);
      else resolve(ethers.Wallet.fromEncryptedJson(walletJson, password));
    });
  });
}
