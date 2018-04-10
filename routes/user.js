var user = require('../controllers/user');
var multer = require('multer');
var path = require('path');
var md5 = require('md5');
exports.default = function(app) {

    // Routes for user login
    //app.route('/user/login').post(user.login);

    // Routes for user signup
    app.route('/user/signup').post(user.signup);

    //Routes for create profile


    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './uploads/user');
        },
        filename: function(req, file, callback) {
            var fileUniqueName = md5(Date.now());
            callback(null, fileUniqueName + path.extname(file.originalname));
        }
    });
    var upload = multer({
        storage: storage
    });
    app.route('/user/create').post(upload.any(), user.create);


    app.route('/user/resetpassword').post(user.resetpassword);

    app.route('/user/updatepassword').post(user.updatepassword);

    app.route('/user/search_nearby_place/:lat/:long').get(user.search_nearby_place);

    app.route('/user/place_details/:place_id/:access_token').get(user.place_details);


    return app;
}