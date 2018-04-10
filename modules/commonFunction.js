var twilio = require('twilio');
exports.generateRandomString = function() {
    var text = "";
    var possible = "123456789";

    for (var i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

exports.checkBlank = function(arr) {
    var arrlength = arr.length;
    for (var i = 0; i < arrlength; i++) {
        if (arr[i] === undefined) {
            arr[i] = "";
        } else {
            arr[i] = arr[i];
        }
        arr[i] = arr[i].trim();
        if (arr[i] === '' || arr[i] === "" || arr[i] == undefined) {
            return 1;
            break;
        }
    }
    return 0;
}
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var config = require("../config.json");

exports.sendMail = function(sendTo) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    var mailer = nodemailer.createTransport(smtpTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS
        }
    }));
    mailer.sendMail({
        from: "CEO@mishraindustries.in",
        to: sendTo,
        subject: "hello ",
        template: "text",
        html: "you signup on the meete app with this email id get 200INR off for your first order"
    }, (error, response) => {
        if (error) {
            console.log("Email not send");
        } else {
            return 1;
        }

        mailer.close();

    });
}

exports.sendotp = function(sendTo, OTP, body) {
   
    var accountSid = ''; // Your Account SID from www.twilio.com/console
    var authToken = ''; // Your Auth Token from www.twilio.com/console

    
    var client = new twilio(accountSid, authToken);

    client.messages.create({
            body: body,
            to: sendTo, // Text this number
            from: '' // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
}