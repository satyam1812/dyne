var commfunc = require('../modules/commonFunction');
var responses = require('../modules/responses');
var UserModal = require('../modals/user');
var md5 = require("md5");
var ageCalculator = require('age-calculator');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('AuthKey');
var request = require('request');

let {
    AgeFromDateString,
    AgeFromDate
} = require('age-calculator');

/* Controller for user login */
 exports.login = function(req, res) {
 	var { email, password, device_type, device_token, latitude, longitude } = req.body;

 	var manValues = [email, password, device_type, device_token, latitude, longitude];
 	var checkBlank = commfunc.checkBlank(manValues);
 	if (checkBlank == 1) {
 		responses.parameterMissing(res);
 	} else {
 		UserModal.checkLoginEmail(email, function(result){
 			responses.sendError(res);
 			} else if( result == 2 ) {
 				console.log("emailNotFound"); 
 			} else {
 				var encry_hash = md5(password);
 				if (result[0].password != '53f0ab092c55f279b7a8b8f297e8ac89') {
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

exports.signup = function(req, res) {
    var {
        name,
        email,
        password,
        device_type,
        contact_no,
        device_token,
        longitude,
        latitude
    } = req.body;
    var password = md5(password);
    var manValues = [name, email, contact_no, password, device_type, device_token, longitude, latitude];
    var checkBlank = commfunc.checkBlank(manValues);
    if (checkBlank == 1) {
        responses.parameterMissing(res);
    } else {
        UserModal.checkLoginEmail(email, function(emailresult) {
            if (emailresult == 1) {
                responses.sendError(res);
            } else if (emailresult.length > 0) {
                responses.emailAlreadyExist(res);
            } else {
                var user_id = md5(new Date());
                var access_token = md5(new Date());

                manValues.push(user_id);
                manValues.push(access_token);

                UserModal.insertuserdata(manValues, function(insertresult) {
                    if (insertresult == 0) {
                        responses.sendError(res);
                    } else {
                        UserModal.showalldata(access_token, function(showresult) {
                            if (showresult == 0) {
                                responses.sendError(res);
                            } else {
                                var checkemail = commfunc.sendMail(email);
                                showresult[0].password = "";
                                responses.success(res, showresult);

                            }
                        });

                    }
                });
            }
        });
    }

}
exports.create = function(req, res) {
    var {
        birth_date,
        status,
        access_token
    } = req.body;
    var manValues = [birth_date, status, access_token];
    var checkBlank = commfunc.checkBlank(manValues);
    birth_date = new Date(birth_date);
    var month = birth_date.getUTCMonth() + 1; //months from 1-12
    var day = birth_date.getUTCDate();
    var year = birth_date.getUTCFullYear();
    var age = new AgeFromDate(new Date(year, month, day)).age;
    if (checkBlank == 1) {
        responses.parameterMissing(res);
    } else {
        var cover_image = "";
        var profile_image = "";
        for (i = 0; i < req.files.length; i++) {
            if (req.files[i].fieldname == "profile_image") {
                profile_image = req.files[i].filename;
            } else if (req.files[i].fieldname == "cover_image") {
                cover_image = req.files[i].filename;
            }
        }

        var data = {
            birth_date: birth_date,
            status: status,
            age: age,
            cover_image: cover_image,
            profile_image: profile_image
        };
        var condition = {
            access_token: access_token
        };
        UserModal.updateUserData(data, condition, function(updatedResult) {
            if (updatedResult == 0) {
                responses.sendError(res)
            } else {
                UserModal.showalldata(access_token, function(showresult) {
                    if (showresult == 0) {
                        responses.sendError(res);
                    } else {
                        showresult[0].password = "";
                        responses.success(res, showresult);
                    }
                });
            }
        });
    }
}

exports.resetpassword = function(req, res) {
    var {
        contact_no,
        access_token
    } = req.body;
    manValues = [contact_no, access_token];
    checkBlank = commfunc.checkBlank(manValues);
    if (checkBlank == 1) {
        responses.parameterMissing(res);
    } else {
        var OTP = commfunc.generateRandomString();
        UserModal.showalldata(access_token, function(showresult) {
            if (showresult == 0) {
                responses.sendError(res);
            } else {
                if (showresult[0].contact_no == contact_no) {
                    data = {
                        OTP: OTP
                    };
                    condition = {
                        access_token: access_token
                    };
                    UserModal.updateUserData(data, condition, function(updatedResult) {
                        if (updatedResult == 0) {
                            responses.sendError(res);
                        } else {
                            body = "your OTP is " + OTP + "valid for 3 minutes";
                            commfunc.sendotp(contact_no, OTP, body);
                            responses.success(res, updatedResult)
                        }

                    });

                }

            }

        });

    }
}
exports.updatepassword = function(req, res) {
    var {
        OTP,
        password,
        access_token
    } = req.body;
    manValues = [OTP, password, access_token];
    var checkBlank = commfunc.checkBlank(manValues);
    if (checkBlank == 1) {
        responses.parameterMissing(res);
    } else {
        UserModal.showalldata(access_token, function(showresult) {
            if (showresult == 0) {
                responses.sendError(res);
            } else {
                if (showresult[0].OTP == OTP) {
                    data = {
                        password: md5(password),
                        OTP: 0
                    };
                    condition = {
                        access_token: access_token
                    };
                    UserModal.updateUserData(data, condition, function(updatedResult) {
                        if (updatedResult == 0) {
                            responses.sendError(res);
                        } else {
                            UserModal.showalldata(access_token, function(showresult) {
                                if (showresult == 0) {
                                    responses.sendError(res);
                                } else {
                                    contact_no = showresult[0].contact_no;
                                    date = new Date();
                                    body = "your password has been changed on " + date;
                                    commfunc.sendotp(contact_no, OTP, body);
                                    responses.success(res, updatedResult);
                                }
                            });
                        }
                    });
                }
            }
        });
    }
}

exports.search_nearby_place = function(req, res) {

    var {
        long,
        lat,
        radius,
        type
    } = req.params;
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${long},${lat}&radius=500&key=your api key`;



    request({
        url: url, //URL to hit
        method: 'get',
        // headers: headers,
        // timeout: 10000,
        // body: JSON.stringify(body)
    }, function(error, result, body) {
        if (error) {
            responses.sendError(res);
        } else if (result.statusCode == 500) {
        } else {
            body = JSON.parse(body);
            for (var i = 0; i < body.results.length; i++) {
                // var place_id = body[i].results.id;
                // var place_name = body[i].name;
                // var langitude  = body[i].longitude;
                // var latitude = body[i].latitude;

                responses.success(res,body.results[i].id);

            }
        }
    });

}
exports.place_details = function(req, res) {
    var {
        place_id,
        access_token
    } = req.params;
    let url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=your API key`;
    request({
        url: url, //URL to hit
        method: 'get',
        // headers: headers,
        // timeout: 10000,
        // body: JSON.stringify(body)
    }, function(error, result, body) {
        if (error) {
            responses.sendError(res);
        } else if (result.statusCode == 500) {
        } else {
            body = JSON.parse(body);
            //responses.success(res,body);
            //var place_name = body.result[0].name;

            var name = body.result.name;
            var international_contact = body.result.international_phone_number;
            var address = body.result.formatted_address;
            var local_contact = body.result.formatted_phone_number;
            var latitude = body.result.geometry.location.lat;
            var longitude = body.result.geometry.location.lng;




            UserModal.showalldata(access_token, function(showresult) {
                if (showresult == 0) {
                    responses.sendError(res);
                } else {
                    var user_id = showresult[0].user_id;
                    var manValues = [place_id, name, international_contact, local_contact, address, user_id, latitude, longitude];


                    UserModal.insertplacedata(manValues, function(insertresult) {
                        if (insertresult == 0) {
                            responses.sendError(res);
                        } else {
                            UserModal.showplacedata(place_id, function(showresult) {
                                if (showresult == 0) {
                                    responses.sendError(res);
                                } else {
                                    responses.success(res, showresult);

                                }
                            });

                        }
                    });
                }
            });
        }
    });
}