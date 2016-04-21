// simple utility to post to rmq
// for testing purposes

var config = require('../config');

var lineReader = require('readline').createInterface({
  input: process.stdin
});

var context = require('rabbit.js').createContext();
context.on('ready', function() {
  var pub = context.socket('PUB');
  pub.connect(config.EXCHANGE_NAME, function() {
    lineReader.on('line', function(line) {
      pub.write(line, 'utf8');
    });
  });
});
