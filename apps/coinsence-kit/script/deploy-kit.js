const path = require('path');
const argv = require('yargs').argv

const fileInject = require('./helpers/file_inject.js')
const getNetworkId = require('./helpers/networkid.js')

const CoinsenceKit = artifacts.require('CoinsenceKit')

const arapp = require('../arapp.json')
const environment = argv['network'] || argv['environment'] || argv['development'] || 'default'
const ensAddr = arapp.environments[environment].registry || process.env.ENS

module.exports = async function(callback) {
  const networkId = await getNetworkId(web3)
  console.log(`Deploying to networkId: ${networkId}`)

  if (!ensAddr) {
    callback(new Error("ENS address not found in environment variable ENS"))
  }
  console.log(`Using ENS at: ${ensAddr}`);

  CoinsenceKit.new(ensAddr).then((coinsenceKit) => {
    console.log(`Deployed CoinsenceKit at: ${coinsenceKit.address}`);

    fileInject(path.join(__dirname, '..', '../../lib/addresses/CoinsenceKit.json'), networkId, coinsenceKit.address);

    callback();
  }).catch((e) => {
    console.log(e);
    callback(e);
  })
}
