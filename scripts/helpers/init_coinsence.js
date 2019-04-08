const argv = require('yargs').argv;
const ethers = require('ethers');
const getNetworkId = require('./networkid.js');
const Coinsence = require('../../lib/coinsence');

const arapp = require('../../arapp.json');
const environment = argv['network'] || argv['environment'] || 'development';
const apm = arapp.environments[environment].apm;

module.exports = async function(web3) {
  return new Promise((resolve, reject) => {
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
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
