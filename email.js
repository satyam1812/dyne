var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var config = require("./config.json");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//var transporter = nodemailer.createTransport('smtps://something%40gmail.com:password@smtp.gmail.com');
var mailer = nodemailer.createTransport(smtpTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
    }
}));
mailer.sendMail({
    from: "kallmedil@gmail.com",
    to: "vishalims095@gmail.com",
    cc : "vishallsharma07@gmail.com",
    bcc : "vermarishabh2011@gmail.com",
    subject: " Sharmaji ",
    template: "text",
    html: "Great Man..!! best of luck for the future"
}, (error, response) => {
    if (error) {
        console.log(error);
        console.log( "Email not send successfully");
    } else {
        console.log( "Email send successfully" );
    }
    mailer.close();
});