var responses = require('../modules/responses');
var UserModal = require('../modals/user');

var accountSid = 'AC3946abe1e89b227300553f7a7b5bc958'; // Your Account SID from www.twilio.com/console
	var authToken = '52e98114a6d844d6ddd91c5747e00ca8';   // Your Auth Token from www.twilio.com/console

	var twilio = require('twilio');
	var client = new twilio(accountSid, authToken);
	var text = "";
	var access_token = "1712e270f6da966d5c4ec4ac53440966";
	var possible = "123456789";

	for (var i = 0; i < 4; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	console.log(text);
	data = {OTP: text};
	condition = {access_token:access_token};
	UserModal.updateUserData(data, condition, function(updatedResult){
		if (updatedResult == 0) {
			responses.sendError(res);
		} else {

			client.messages.create({
			    body: "your one time password(OTP) is  "  +text+  "  valid for 3 minutes do not disclose it" ,
			    to: sendTo,  // Text this number
			    from: '(912) 244-7559' // From a valid Twilio number
			})
			.then((message) => console.log(message.sid)); 
			responses.success(res,Result);
		}
	});

