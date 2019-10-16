const Base = require('./base');

class Coin extends Base {
  mint(recipient, amount) {
    return this.function.mintCoin(recipient, amount);
  }

  setTransferEventListener() {
    let filter = this.contract.filters.Transfer(null, null);
    this.contract.on(filter, (from, to, value) => {
      // ignore mint function event
      if(from != "0x0000000000000000000000000000000000000000") {
        console.log("token address: ", this.contract.address);
        console.log("from: ", from);
        console.log("to: ", to);
        console.log("amount: ", value.toNumber());

        //call humhub webservice
      }
    });
  }
}

module.exports = Coin;

