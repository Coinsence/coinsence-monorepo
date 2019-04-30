const CoinsenceKit = require('../../kit.js');

module.exports = function (options = {}) {
  let { ethProvider, coinsenceSigner } = options;

  return function (req, res, next) {
    new CoinsenceKit(ethProvider, coinsenceSigner).init().then(kit => {
      res.locals.kit = kit;
      next();
    }).catch(e => {
      console.log(e);
      res.sendStatus(500);
    });
  }
}
