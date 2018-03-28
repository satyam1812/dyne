var user = require('../controllers/user');
var multer = require('multer');
var path = require ('path');
var md5 = require ('md5');
exports.default = function(app) {

	// Routes for user login
	app.route('/user/login').post(user.login);

	// Routes for user signup
	app.route('/user/signup').post(user.signup);

	//Routes for create profile

	
	var storage = multer.diskStorage({
	destination:function(req,file,callback) {
		callback(null,'./uploads/user');
	},
	filename:function(req,file,callback) {
		var fileUniqueName = md5(Date.now());
		 callback(null,  fileUniqueName + path.extname(file.originalname));
	}
});
var upload = multer({storage:storage});
app.route('/user/create').post(upload.any(), user.create);





	return app;
}