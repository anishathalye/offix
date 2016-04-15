// copy this file to config.js with the correct settings in production
//
// this file, as it is now, is probably good for use in development

var config = module.exports = {};

// application name
// probably doesn't need to be changed
config.APP_NAME = 'offix';

// key to sign up for a new account
config.SIGNUP_KEY = 'offix';

// global api key
config.API_KEY = '14efe32635798c9ca3eb7ce596b9c0e329a71b7081c801c634efebf69935c668';

// database url
config.DB_URL = 'localhost/' + config.APP_NAME;
