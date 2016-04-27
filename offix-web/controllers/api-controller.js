var _ = require('lodash');

var User = require('../models/user.js');

var ApiController = module.exports = {};

ApiController.users = function(req, res) {
  User.find({}, function(err, users) {
    var sorted = _.sortBy(users, function(user) {
      if (user.lastSeen) {
        return -user.lastSeen.getTime(); // negative to sort in descending order
      } else {
        return 0; // never
      }
    });
    var data = _.map(sorted, function(user) {
      return {
        username: user.username,
        realName: user.realName,
        lastSeen: user.lastSeen || null,
        // can use `new Date(lastSeen)` to turn this back into a date
        shouldBroadcast: user.shouldBroadcast,
      };
    });
    res.json(data);
  });
};
