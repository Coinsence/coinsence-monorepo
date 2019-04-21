const fs = require('fs');
const ethers = require('ethers');

module.exports = async function (accountId, password) {
  const walletPath = `./keys/${accountId}.json`;
  const walletJson = fs.readFileSync(walletPath);
  return ethers.Wallet.fromEncryptedJson(walletJson, password);
}
