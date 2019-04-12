const promptly = require('promptly');
const ethers = require('ethers');

const initCoinsence = require('./helpers/init_coinsence.js');

initCoinsence().then(async function(coinsence) {
  let recipient = await promptly.prompt('Recipient address: ');
  let amount = await promptly.prompt('Amount: ', {default: '1'});
  amount = ethers.utils.parseEther(amount);

  let fromAccount = await coinsence.signer.getAddress();
  let fromBalance = await coinsence.signer.getBalance();
  let recipientBalance = await coinsence.provider.getBalance(recipient);

  console.log('--------------');
  console.log(`sender account balance ${fromAccount}: ${fromBalance}`);
  console.log(`recipient account balance ${recipient}: ${recipientBalance}`);

  console.log(`\nsending ${amount} WEI from ${fromAccount} to ${recipient}`);

  let transaction = await coinsence.signer.sendTransaction({to: recipient, value: amount});

  console.log('transaction:', transaction.hash);

  recipientBalance = await coinsence.provider.getBalance(recipient);
  console.log(`\nnew recipient account balance ${recipient}: ${recipientBalance}`);
});
