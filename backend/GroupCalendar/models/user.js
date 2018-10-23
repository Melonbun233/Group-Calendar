var db = require('../db.js');


exports.info_get = function(email, info){
	db.query("SELECT * FROM Users WHERE user_email = ? ", email,
		function (err, res){
			console.log('\ndb query working\n');
			if (err) throw err;
			info(null, res);
		});
};