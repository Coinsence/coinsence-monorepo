module.exports = function (req, res, next) {
  if (req.path === '/ping') {
    res.locals.ethProvider.getBlockNumber()
      .then(blockNumber => {
        res.status(200).json({blockNumber});
      })
      .catch(e => {
        console.log(e);
        res.status(500).json({error: 'getBlockNumber failed'});
      })
    return;
  }
  next();
}

