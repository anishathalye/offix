var MainController = module.exports = {};

MainController.unauthed = function(req, res) {
  // unauthenticated view
  res.render('unauthed');
};

MainController.authed = function(req, res) {
  // main view
  // TODO populate with data
  res.render('index');
};

MainController.index = function(req, res) {
  if (req.session.user) {
    MainController.authed(req, res);
  } else {
    MainController.unauthed(req, res);
  }
};
