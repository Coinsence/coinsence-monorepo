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
        console.log("token address: ", this.contract.address);
        console.log("tx hash: ", event.transactionHash);
        console.log("from: ", from);
        console.log("to: ", to);
        console.log("amount: ", value.toNumber());

        //call humhub webservice
        console.log(process.env.HUMHUB_HOST);
        const data = JSON.stringify({
          fromAddress: from,
          toAddress: to, 
          coinAddress: this.contract.address, 
          amount: value.toNumber(), 
          txHash: event.transactionHash
        });
        
        const options = {
          hostname: `${process.env.HUMHUB_HOST}`,
          port: 80,
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

