var express = require('express');
var router = express.Router();

var utils = require('../utils/utils');
var UserController = require('../controllers/user-controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/account', utils.isAuthed, UserController.account);

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

router.post('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
