const fs = require('fs');
const path = require('path');
const argv = require('yargs').array('members').argv;

const fileInject = require('../../shared/helpers/file_inject.js')
const getNetworkId = require('../../shared/helpers/networkid.js')

const addressesPath = path.join(__dirname, '../../..', '/lib/addresses');

const CoinsenceKit = artifacts.require('CoinsenceKit')

module.exports = async function(callback) {
  const networkId = await getNetworkId(web3)
  console.log(`Deploying to networkId: ${networkId}`)

  let kitAddresseFile = path.join(addressesPath, 'CoinsenceKit.json');
  let kitAddresses = JSON.parse(fs.readFileSync(kitAddresseFile));
  let coinsenceKitAddress = process.env.COINSENCE_KIT || kitAddresses[networkId]
  if (!coinsenceKitAddress) {
    callback(new Error("CoinsenceKit address not found in environment variable COINSENCE_KIT"))
  }
  console.log(`Using CoinsenceKit at: ${coinsenceKitAddress}`);

  let coinsenceKit = CoinsenceKit.at(coinsenceKitAddress)

  coinsenceKit.newInstance(argv.name, argv.ipfs, argv.root).then((ret) => {

    const installedEvents = ret.logs.filter(log => log.event === 'InstalledApp').map(log => log.args)
    const deployEvents = ret.logs.filter(log => log.event === 'DeployInstance').map(log => log.args)

    if (deployEvents.length > 1) {
      callback(new Error("More than one DAO was deployed. Something is wrong"))
    }
    const daoAddress = deployEvents[0].dao;

    fileInject(path.join(addressesPath, 'dao.json'), networkId, daoAddress)

    console.log(`\n\nCreated new DAO at: ${daoAddress}`)

    callback();
  }).catch((err) => {
    console.log('failed to create a new instance')
    callback(err)
  })
}
