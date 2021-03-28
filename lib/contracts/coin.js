const https = require('https')
const Base = require('./base');

class Coin extends Base {
  mint(recipient, amount) {
    return this.function.mintCoin(recipient, amount);
  }

  setTransferEventListener() {
    let filter = this.contract.filters.Transfer(null, null);
    this.contract.on(filter, (from, to, value, event) => {
      // ignore mint function event
      if(from != "0x0000000000000000000000000000000000000000") {
        console.log("sync tx ", event.transactionHash);

        const data = JSON.stringify({
          fromAddress: from,
          toAddress: to, 
          coinAddress: this.contract.address, 
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
}

module.exports = Coin;

