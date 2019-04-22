const fs = require('fs');
const ethers = require('ethers');

module.exports = function createEncryptedWallet(accountId, password) {
  const wallet = ethers.Wallet.createRandom();

  return wallet.encrypt(password).then(res => {
    return new Promise((resolve, reject) => {
      fs.writeFile(`./keys/${accountId}.json`, res, { flag: 'ax' }, (err) => {
        if (err) reject(err);
        else resolve(wallet);
      });
    })
  });
}
