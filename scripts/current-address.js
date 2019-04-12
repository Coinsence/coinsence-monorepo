const knownDAOAddresses = require('../lib/addresses/dao.json');
const knownKitAddresses = require('../lib/addresses/CoinsenceKit.json');

const initCoinsence = require('./helpers/init_coinsence.js');

initCoinsence().then(async function(coinsence) {
  const networkId = (await coinsence.provider.getNetwork()).chainId;
  console.log('# All known DAO addresses');
  Object.keys(knownDAOAddresses).forEach((networkId) => {
    console.log(`  Network ID: ${networkId} => ${knownDAOAddresses[networkId]}`);
  });
  console.log('# All known Kit addresses');
  Object.keys(knownKitAddresses).forEach((networkId) => {
    console.log(`  Network ID: ${networkId} => ${knownKitAddresses[networkId]}`);
  });
  console.log('-----------------');

  console.log(`# Current network ID: ${networkId}`);

  let currentDAOAddress = knownDAOAddresses[networkId];
  let currentKitAddress = knownKitAddresses[networkId];

  console.log(`# Current CoinsenceKit address: ${currentKitAddress}`);
  console.log(`# Current DAO address: ${currentDAOAddress}`);
});
