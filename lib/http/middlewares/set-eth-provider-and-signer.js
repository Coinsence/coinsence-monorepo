module.exports = function(ethProvider, coinsenceSigner) {
  return function(req, res, next) {
    res.locals.ethProvider = ethProvider;
    res.locals.coinsenceSigner = coinsenceSigner;
    next();
  }
}
