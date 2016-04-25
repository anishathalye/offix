var rabbit = require('rabbit.js');

var config = require('./config');
var utils = require('./utils/utils');
var User = require('./models/user');

var wifi = module.exports = {};

var consume = function(db, data) {
  if (utils.isMacAddress(data)) {
    User.seen(data);
  }
};

wifi.start = function(db) {
  var context = rabbit.createContext();
  context.on('ready', function() {
    var sub = context.socket('SUB'); // subscription
    sub.setEncoding('utf-8');
    sub.connect(config.EXCHANGE_NAME, '', function() {
      sub.on('data', function(data) {
        console.log('got data from rabbitmq: ' + data);
        if (utils.isMacAddress(data)) {
          consume(db, data);
        }
      });
    });
  });
};
