const loadWallet = require('../utils/load-wallet');

module.exports = function (options = {}) {
  let { password } = options;

  return function (req, res, next) {
    // actually already handle by the require-account middleware TODO: refactor
    if (!res.locals.accountId) {
      res.status(400).json({error: 'accountId is missing'});
    } else {
      loadWallet(res.locals.accountId, password).then(wallet => {
        res.locals.wallet = wallet;
        next();
      });
    }
  }
}

