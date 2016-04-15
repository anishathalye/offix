var moment = require('moment');

var config = require('../config');
var utils = require('../utils/utils');
var User = require('../models/user');

var UserController = module.exports = {};

UserController.account = function(req, res) {
  var user = req.session.user;
  var lastSeen = user.lastSeen ? moment().to(lastSeen) : 'Never';
  res.render('account', {
    username: user.username,
    realName: user.realName,
    isAdmin: user.isAdmin,
    lastSeen: lastSeen,
  });
};

UserController.register = function(req, res) {
  console.log(req.body);
  console.log('key=' + req.body.key);
  if (!utils.constantTimeStringEquals(req.body.key, config.SIGNUP_KEY)) {
    // TODO nicer error message / page
    return res.status(401).send('Invalid signup key');
  }
  User.register(req.body.username, req.body.password, req.body.realName, function(err, user) {
    if (err) {
      // TODO more helpful error messages like "user is already registered"
      // but be sure not to leak debug info
      return res.status(500).send('Something went wrong, try again?');
    }
    // start user session
    req.session.user = user;
    // and go to the homepage
    res.redirect('/');
  });
};

UserController.login = function(req, res) {
  User.authenticate(req.body.username, req.body.password, function(err, user) {
    if (err || !user) {
      // TODO separate out errors from invalid login credentials
      // and send appropriate status code and a descriptive error message
      return res.status(401).send('Bad login');
    }
    // start user session
    req.session.user = user;
    // and go to the homepage
    res.redirect('/');
  });
};
