const argv = require('yargs').argv;
const ethers = require('ethers');
const Coinsence = require('../../lib/coinsence');

module.exports = async function() {
  return new Promise((resolve, reject) => {
    const rpcApiUrl = argv['rpc-url'] || process.env.RPC_URL || 'http://localhost:8545';
    const apm = argv['apm'] || process.env.APM || 'aragonpm.eth';
    const provider = new ethers.providers.JsonRpcProvider(rpcApiUrl);
    let signer = provider.getSigner();
    // checking if siner supports signing transactions
    signer.getAddress().then(_ => {
      new Coinsence(provider, signer, { apm }).init().then(coinsence => {
        resolve(coinsence);
      }).catch(e => {
        reject(e);
      });
    }).catch(e => {
      console.log(`Signer account not available; readonly connection (${e.message}`);
      new Coinsence(provider, null, { apm }).init().then(coinsence => {
        resolve(coinsence);
      }).catch(e => {
        reject(e);
      });
    })
  });
}
