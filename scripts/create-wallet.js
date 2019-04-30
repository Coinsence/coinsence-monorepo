#!/usr/bin/env node

const fs = require('fs');
const ethers = require('ethers');
const promptly = require('promptly');

(async function() {
  console.log(`You're about to create an Ethereum wallet. Please provide a path and password for encryption.\n`);

  const path = await promptly.prompt('Path: (default: ./wallet.json)', { default: './wallet.json' });
  const password = await promptly.prompt('Password: ');

  let wallet = ethers.Wallet.createRandom();
  wallet.encrypt(password).then((walletJSON) => {
    fs.writeFileSync(path, walletJSON, { flag: 'ax' });
    console.log(`\nWrote encrypted wallet config to ${path}`);
  });
  console.log('Address: ', wallet.address);
  console.log('Private key: ', wallet.privateKey);
})();
