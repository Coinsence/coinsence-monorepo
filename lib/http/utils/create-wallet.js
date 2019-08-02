const fs = require('fs');
const ethers = require('ethers');
const path = require('path');

const keysDirectory = process.env.COINSENCE_WALLETS_DIR || path.join(__dirname, '../../../', 'keys');

module.exports = function createEncryptedWallet(accountId, password) {
  const wallet = ethers.Wallet.createRandom();
  return new Promise((resolve, reject) => {
    const walletPath = path.join(keysDirectory, `${accountId}.key`);
    fs.writeFile(walletPath, wallet.privateKey, { flag: 'ax' }, (err) => {
      if (err) reject(err);
      else resolve(wallet);
    });
  });
}
