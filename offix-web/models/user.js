var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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
      this.create({username: username, password: hashed, realName: realName}, function(err, user) {
        if (err) {
          return callback(err);
        }
        callback(null, user);
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

User = mongoose.model('User', userSchema);

module.exports = User;
