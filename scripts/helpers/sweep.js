module.exports = async function(signer, provider, newAddress) {
  // Get the current balance
  let balance = await signer.getBalance();

  // Normally we would let the Wallet populate this for us, but we
  // need to compute EXACTLY how much value to send
  let gasPrice = await provider.getGasPrice();

  // The exact cost (in gas) to send to an Externally Owned Account (EOA)
  let gasLimit = 21000;

  // The balance less exactly the txfee in wei
  let value = balance.sub(gasPrice.mul(gasLimit))

  try {
    let tx = await signer.sendTransaction({
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      to: newAddress,
      value: value
    });

    console.log('From wallet: ' + signer.address);
    console.log('Sent in Transaction: ' + tx.hash);
  }
  catch(err) {
    console.log(err);
    new Error(`Can't send transaction from: ${signer.address}`);
  }
}