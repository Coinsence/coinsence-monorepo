module.exports = function (req, res, next) {
    const memberAppAddress = req.body.memberApp || req.query.memberApp;
    if (!memberAppAddress) {
      res.status(400).json({error: 'member app is missing'});
    } else {
      res.locals.memberAppAddress = memberAppAddress;
      next();
    }
  }
  
  