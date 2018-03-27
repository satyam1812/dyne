var user = require('../controllers/user');

exports.default = function(app) {

	// Routes for user login
	app.route('/user/login').post(user.login);

	// Routes for user login
	app.route('/user/signup').post(user.signup);


	return app;
}