var _ = require('lodash');
var moment = require('moment');

var User = require('../models/user.js');

var MainController = module.exports = {};

MainController.unauthed = function(req, res) {
  // unauthenticated view
  res.render('unauthed');
};

MainController.authed = function(req, res) {
  // main view
  User.find({}, function(err, users) {
    var sorted = _.sortBy(users, function(user) {
      if (user.lastSeen) {
        return -user.lastSeen.getTime(); // negative to sort in descending order
      } else {
        return -(new Date().getTime());
      }
    });
    var data = _.map(sorted, function(user) {
      return {
        username: user.username,
        realName: user.realName,
        lastSeen: user.lastSeen ? moment().to(user.lastSeen) : 'never',
      };
    });
    res.render('index', {users: data});
  });
};

MainController.index = function(req, res) {
  if (req.session.user) {
    MainController.authed(req, res);
  } else {
    MainController.unauthed(req, res);
  }
};
