var responses = require('../modules/responses');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'facebook_social'
});
 
connection.connect(function(err){
	if (err) {
		responses.sendError(err);
	} else {
		console.log("database is working");	
	}
});

module.exports = connection;