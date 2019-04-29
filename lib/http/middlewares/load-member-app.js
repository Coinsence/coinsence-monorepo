const Member = require('../../member');
const loadWallet = require('../utils/load-wallet');

module.exports = function (options = {}) {
  let { password, ethProvider } = options;

  return function (req, res, next) {
    loadWallet(res.locals.accountId, password).then(wallet => {
      const signer = wallet.connect(ethProvider);
      new Member(ethProvider, signer, {address: res.locals.memberAppAddress}).init().then(memberApp => {
        res.locals.memberApp = memberApp;
        next();
      }).catch(e => {
        console.log(e);
        res.sendStatus(500);
      });
    });
  }
}
