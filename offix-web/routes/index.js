var express = require('express');
var router = express.Router();

var utils = require('../utils/utils');
var UserController = require('../controllers/user-controller');
var MainController = require('../controllers/main-controller');

// main

router.get('/', MainController.index);

// accounts stuff

router.get('/account', utils.isAuthed, UserController.account);

router.post('/account/addaddress', utils.isAuthed, UserController.addAddress);

router.post('/account/deleteaddress', utils.isAuthed, UserController.deleteAddress);

router.get('/create', UserController.create);

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.all('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

// admin

// TODO admin page

module.exports = router;
