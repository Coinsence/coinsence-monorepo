const promptly = require('promptly');
const ethers = require('ethers');

const initNetwork = require('./helpers/init_network.js');

initNetwork().then(async function(net) {
  if (!net.signer) {
    throw new Error('Signer required to send funds');
  }
  let recipient = await promptly.prompt('Recipient address: ');
  let amount = await promptly.prompt('Amount: ', {default: '1'});
  amount = ethers.utils.parseEther(amount);

  let fromAccount = await net.signer.getAddress();
  let fromBalance = await net.signer.getBalance();
  let recipientBalance = await net.provider.getBalance(recipient);

  console.log('--------------');
  console.log(`sender account balance ${fromAccount}: ${fromBalance}`);
  console.log(`recipient account balance ${recipient}: ${recipientBalance}`);

  console.log(`\nsending ${amount} WEI from ${fromAccount} to ${recipient}`);

  let transaction = await net.signer.sendTransaction({to: recipient, value: amount});

  console.log('transaction:', transaction.hash);

  recipientBalance = await net.provider.getBalance(recipient);
  console.log(`\nnew recipient account balance ${recipient}: ${recipientBalance}`);
});
