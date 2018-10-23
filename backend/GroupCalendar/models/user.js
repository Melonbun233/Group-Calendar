var db = require('../db.js');


exports.info_get = function(email, result){
	db.query('SELECT * FROM users WHERE user_email = ' + email,
		function (err, res){
			console.log('\ndb query working\n');
			if (err) {
				console.log("*****error: ", err);
				result(err, null);
			} else {
				result(null, res);
			}
		});
};