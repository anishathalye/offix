var rabbit = require('rabbit.js');

var config = require('../config');

var context = rabbit.createContext();
context.on('ready', function() {
  var sub = context.socket('SUB'); // subscription
  sub.setEncoding('utf-8');
  sub.connect(config.EXCHANGE_NAME, '', function() {
    sub.on('data', function(data) {
      console.log(data);
    });
  });
});
