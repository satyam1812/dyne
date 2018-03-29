var commfunc = require('../modules/commonFunction');
var responses = require('../modules/responses');
var UserModal = require('../modals/user');
var md5 = require("md5");
 var ageCalculator = require('age-calculator');
  let {AgeFromDateString, AgeFromDate} = require('age-calculator');

/* Controller for user login */ 
exports.login = function(req, res) {
	var { email, password, device_type, device_token, latitude, longitude } = req.body;

	var manValues = [email, password, device_type, device_token, latitude, longitude];
	var checkBlank = commfunc.checkBlank(manValues);
	if (checkBlank == 1) {
		responses.parameterMissing(res);
	} else {
		UserModal.checkLoginEmail(email, function(result){
			if (result == 1) {
				responses.sendError(res);
			} else if ( result == 2 ) {
				console.log("emailNotFound");
			} else {
				var encry_hash = md5(password);
				if (result[0].password != 'satyam') {
					console.log("Invalid password");
				} else {

					var access_token = md5(new Date());
					var data = {access_token: access_token, device_type: device_type, device_token: device_token, latitude: latitude, longitude: longitude};
					var condition = {user_id: result[0].user_id};

					UserModal.updateUserData(data, condition, function(updatedResult){
						if (updatedResult == 0) {
							responses.sendError(res);
						} else {
							result[0].access_token = access_token;
							result[0].device_type = device_type;
							result[0].device_token = device_token;
							result[0].latitude = latitude;
							result[0].longitude = longitude;
							result[0].password = "";
							responses.success(res, result[0]);
						}
					});
				}
			}
		});
	}
}

exports.signup = function(req,res) {
	var {name,email,password,device_type,device_token,longitude,latitude} = req.body;
	var password = md5(password);
	var manValues = [name, email, password, device_type, device_token, longitude, latitude];
	var checkBlank = commfunc.checkBlank(manValues);
	if(checkBlank == 1){
		responses.parameterMissing(res);
	} else {
		UserModal.checkLoginEmail(email,function(emailresult){
			if(emailresult == 1){
				responses.sendError(res);
			} else if( emailresult.length > 0 ){
				responses.emailAlreadyExist(res);
			}else{
				var user_id = md5(new Date());
				var access_token = md5(new Date());

				manValues.push(user_id);
				manValues.push(access_token);
				
					UserModal.insertuserdata(manValues, function(insertresult){
						if(insertresult == 0){
							responses.sendError(res);
						} else {
							UserModal.showalldata(access_token,function(showresult){
								if(showresult == 0){
									responses.sendError(res);
								} else {
									var checkemail = commfunc.sendMail(email);
									responses.success(res,showresult);

								} 
							});

						}
					});
			}
		});
	}
	
}
exports.create = function(req,res) {
	var {birth_date,status,access_token} = req.body;
	var manValues = [birth_date,status,access_token];
	var checkBlank = commfunc.checkBlank(manValues);
	console.log(birth_date);
	birth_date = new Date(birth_date);
	var month = birth_date.getUTCMonth() + 1; //months from 1-12
	var day = birth_date.getUTCDate();
	var year = birth_date.getUTCFullYear();
	var age = new AgeFromDate(new Date(year,month,day)).age; 
	if(checkBlank == 1) {
		responses.parameterMissing(res);
	} else {
		var cover_image="";
		var profile_image="";
		for(i=0;i<req.files.length;i++) {
			if(req.files[i].fieldname == "profile_image"){
				profile_image=req.files[i].filename; 
			} else if(req.files[i].fieldname == "cover_image") {
				cover_image=req.files[i].filename;
			}
		}

		var data = {birth_date:birth_date,status:status,age:age,cover_image:cover_image,profile_image:profile_image};
		var condition = {access_token:access_token};
		UserModal.updateUserData(data,condition,function(updatedResult){
			if(updatedResult  == 0){
				responses.sendError(res)
			} else{
				UserModal.showalldata(access_token,function(showresult){
					if(showresult == 0) {
						responses.sendError(res);
					} else {
						showresult[0].password = "";
						responses.success(res,showresult);
					}
				});
			}
		});
	}
}