var config = require('../config');

var utils = module.exports = {};

utils.constantTimeStringEquals = function(a, b) {
  if (typeof(a) === 'undefined' || typeof(b) === 'undefined') {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  var equal = true;
  for (var length = a.length, i = 0; i < length; i++) {
    equal &= (a.charAt(i) === b.charAt(i));
  }
  return equal;
};

utils.isAuthed = function(req, res, next) {
  if (req.session.user) {
    return next();
  }
  // TODO better error message
  res.status(401).send('You must be logged in to do that');
};

utils.isAdmin = function(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  // TODO better error message
  res.status(401).send('You must be an admin to do that');
};

utils.apiAuthed = function(req, res, next) {
  if (req.query && utils.constantTimeStringEquals(req.query.key, config.API_KEY)) {
    return next();
  }
  res.status(401).json({error: 'invalid api key'});
};

utils.isMacAddress = function(addr) {
  return /^([a-f0-9]{2}:){5}[a-f0-9]{2}$/.test(addr);
};
