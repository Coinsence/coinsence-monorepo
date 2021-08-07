/**
 * This script will be running each time the API shutdown/restart
 * It will set up an event listener for the deployed DAOs coins
 * ETH_PROVIDER_URL = rinkeby node URL
 * HUMHUB_WEBSERVICE = humhub webservice URL
 */

const https = require('https')
const fs = require('fs');
const ethers = require('ethers');
const path = require('path');
const ABI = require('./abis/Coin.json');

const daosDirectory = process.env.COINSENCE_DAO_DIR || path.join(__dirname, '../', 'daos');

let ethProvider;
if (process.env.ETH_PROVIDER_URL) {
  ethProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
} else {
  ethProvider = new ethers.getDefaultProvider('rinkeby');
}

fs.readdir(daosDirectory, async function (err, daos) {
  if (err) {
    return console.log('Error fetching wallets: ' + err);
  }
  else {
    for(let i=0; i<daos.length; i++) {
      let daoPath = path.join(daosDirectory, `${daos[i]}`);
      fs.readFile(daoPath, (err, dao) => {
        let daoObject = JSON.parse(dao);
        console.log(daoObject);

        setTransferEventListener(daoObject.apps[1].proxy, ethProvider);
      });
    }
  }
});

function setTransferEventListener(coinAddress, provider) {
  let contract = new ethers.Contract(coinAddress, ABI, provider);

  let filter = contract.filters.Transfer(null, null);
  contract.on(filter, (from, to, value, event) => {
    // ignore mint function event
    if(from != "0x0000000000000000000000000000000000000000") {
      console.log("sync tx ", event.transactionHash);

      const data = JSON.stringify({
        fromAddress: from,
        toAddress: to, 
        coinAddress: contract.address, 
        amount: value.toString(), 
        txHash: event.transactionHash
      });
      
      const options = {
        hostname: `${process.env.HUMHUB_WEBSERVICE}`,
        port: 443,
        path: '/ethereum/transaction/synchronize',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };
      
      const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
      });
      
      req.on('error', error => {
        console.error(error);
      });
      
      req.write(data);
      req.end();
    }
  });
}