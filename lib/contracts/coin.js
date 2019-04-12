const Base = require('./base');

class Coin extends Base {
  mint(recipient, amount) {
    return this.function.mintCoin(recipient, amount);
  }
}

module.exports = Coin;

