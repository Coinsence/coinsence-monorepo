const fs = require('fs');
const ethers = require('ethers');
const path = require('path');

const keysDirectory = process.env.COINSENCE_WALLETS_DIR || path.join(__dirname, '../../../', 'keys');

module.exports = function (accountId, password) {
  return new Promise((resolve, reject) => {
    const walletPath = path.join(keysDirectory, `${accountId}.key`);
    fs.readFile(walletPath, "utf8", (err, walletKey) => {
      if (err) reject(err);
      else resolve(new ethers.Wallet(walletKey));
    });
  });
}
