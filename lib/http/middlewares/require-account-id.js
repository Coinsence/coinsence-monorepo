module.exports = function (req, res, next) {
  const accountId = req.body.accountId || req.query.accountId;
  if (!accountId) {
    res.status(400).json({error: 'accountId is missing'});
  } else {
    res.locals.accountId = accountId;
    next();
  }
}
