var _ = require('lodash');
var moment = require('moment');

var User = require('../models/user.js');

var AdminController = module.exports = {};

AdminController.index = function(req, res) {
  User.find({}, function(err, users) {
    var sorted = _.sortBy(users, function(user) {
      return user.username;
    });
    var data = _.map(sorted, function(user) {
      return {
        username: user.username,
        realName: user.realName,
        lastSeen: user.lastSeen ? moment().to(user.lastSeen) : 'never',
        isAdmin: user.isAdmin,
        addresses: user.macAddresses,
      };
    });
    res.render('admin', {users: data});
  });
};
