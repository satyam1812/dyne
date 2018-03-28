var connection = require('../modules/connection');

exports.checkLoginEmail = function (email, callback) {
	var sql = "SELECT * FROM `user1` WHERE `email`=?";
	connection.query(sql, [email], function(err, result){ 
		if (err) {
			callback(1);
		} else {
			result.length > 0 ? callback(result) : callback(2);
			// if ( result.length > 0 ) { callback(result); } else { callback(2); }
		}
	});
}
exports.updateUserData = function(data, condition, callback) {
	var sql = "UPDATE `user1` SET ? WHERE ?";
	connection.query(sql, [data, condition], function(err, result){
		console.log(err);
		err ? callback(0) : callback(1);
	});
}
exports.insertuserdata = function(manValues, callback) {
	var sql = "INSERT INTO `user1`( `name`,`email`,`password`,`device_type`,`device_token`,`longitude`,`latitude`,`user_id`,`access_token`) VALUES(?)";
	connection.query(sql , [manValues] , function(err){
		if(err){
			console.log(err);
			callback(0);
		} else {
			callback(1);
		}
	});
}
exports.showalldata = function(access_token,callback){
	var sql = "SELECT * FROM `user1` WHERE `access_token`=?";
	connection.query(sql,[access_token],function(err,result){
		if(err){
			callback(0);
		} else{
			callback(result);
		}
	});
}
