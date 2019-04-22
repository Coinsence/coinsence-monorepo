module.exports = function(ethProvider) {
  return function(req, res, next) {
    res.locals.ethProvider = ethProvider;
    next();
  }
}
