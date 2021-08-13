const Coinsence = require('../../coinsence');
const loadWallet = require('../utils/load-wallet')

const apmDomain = process.env.apmDomain || 'open.aragonpm.eth';
module.exports = function (options = {}) {
  let { password, ethProvider } = options;

  return function (req, res, next) {
    loadWallet(res.locals.accountId, password).then(wallet => {
      const signer = wallet.connect(ethProvider);
      console.log("wallet signer")
      console.log(signer)
      new Coinsence(ethProvider, signer, {addresses: { Kernel: res.locals.daoAddress}, apm: apmDomain}).init().then(coinsence => {
        res.locals.coinsence = coinsence;
        next();
      }).catch(e => {
        console.log(e);
        res.sendStatus(500);
      });
    });
  }
}
