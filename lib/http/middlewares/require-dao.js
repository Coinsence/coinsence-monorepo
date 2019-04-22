module.exports = function (req, res, next) {
  const daoAddress = req.body.dao || req.query.dao;
  if (!daoAddress) {
    res.status(400).json({error: 'dao is missing'});
  } else {
    res.locals.daoAddress = daoAddress;
    next();
  }
}

