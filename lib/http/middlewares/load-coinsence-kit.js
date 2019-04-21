const loadWallet = require('../utils/load-wallet')
const CoinsenceKit = require('../../kit.js');

module.exports = function (options = {}) {
  let { password, ethProvider } = options;

  return function (req, res, next) {
    loadWallet(res.locals.accountId, password).then(wallet => {
      const signer = wallet.connect(ethProvider);
      new CoinsenceKit(ethProvider, signer).init().then(kit => {
        res.locals.kit = kit;
        next();
      }).catch(e => {
        console.log(e);
        res.sendStatus(500);
      });
    });
  }
}
