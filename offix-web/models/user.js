var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var async = require('async');

var errors = require('../utils/errors');

userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  realName: {type: String, required: true},
  isAdmin: {type: Boolean, default: false},
  macAddresses: [String],
  lastSeen: Date,
  // we're not currently collecting historical data, and we're not associating
  // last seen times with specific MAC addresses
});

userSchema.statics.register = function(username, password, realName, callback) {
  if (!username || !password) {
    return callback(errors.MissingFieldsError);
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return callback(err);
    }
    bcrypt.hash(password, salt, function(err, hashed) {
      if (err) {
        return callback(err);
      }
      User.create({username: username, password: hashed, realName: realName}, function(err, user) {
        if (err) {
          return callback(err);
        }
        return callback(null, user);
      });
    });
  });
};

userSchema.statics.authenticate = function(username, password, callback) {
  this.findOne({username: username}, function(err, user) {
    if (err) {
      return callback(err);
    }
    if (!user) {
      return callback(errors.InvalidLoginCredentialsError);
    }
    bcrypt.compare(password, user.password, function(err, matches) {
      if (err) {
        return callback(err);
      }
      if (!matches) {
        return callback(errors.InvalidLoginCredentialsError);
      }
      return callback(null, user);
    });
  });
};

userSchema.statics.seen = function(address, callback) {
  // there really shouldn't be more than one, but if there is, just update all
  // of them
  var now = new Date();
  this.find({macAddresses: address}, function(err, users) {
    async.map(users, function(user, callback) {
      user.lastSeen = now;
      user.save(callback);
    }, callback);
  });
};

User = mongoose.model('User', userSchema);

module.exports = User;
