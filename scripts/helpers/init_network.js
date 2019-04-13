const argv = require('yargs').argv;
const ethers = require('ethers');

module.exports = async function() {
  return new Promise((resolve, reject) => {
    const rpcApiUrl = argv['rpc-url'] || process.env.RPC_URL || 'http://localhost:8545';
    const apm = argv['apm'] || process.env.APM || 'aragonpm.eth';
    const provider = new ethers.providers.JsonRpcProvider(rpcApiUrl);
    provider.getNetwork().then(network => {
      let networkId = network.chainId;
      let signer = provider.getSigner();
      // checking if siner supports signing transactions
      signer.getAddress()
        .then(_ => {
          resolve({ provider, signer, networkId });
        })
        .catch(e => {
          console.log(`Signer account not available; readonly connection (${e.message}`);
          resolve({ provider, signer: null, networkId });
        });
    });
  });
}

