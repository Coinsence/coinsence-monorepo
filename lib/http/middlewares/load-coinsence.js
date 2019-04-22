const Coinsence = require('../../coinsence');
const loadWallet = require('../utils/load-wallet')
module.exports = function (options = {}) {
  let { password, ethProvider } = options;

  return function (req, res, next) {
    loadWallet(res.locals.accountId, password).then(wallet => {
      const signer = wallet.connect(ethProvider);
      new Coinsence(ethProvider, signer, {addresses: { Kernel: res.locals.daoAddress}}).init().then(coinsence => {
        res.locals.coinsence = coinsence;
        next();
      }).catch(e => {
        console.log(e);
        res.sendStatus(500);
      });
    });
  }
}
