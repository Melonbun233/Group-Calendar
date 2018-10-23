var db = require('../db.js');


exports.info_get = function(email, info){
	var query = "SELECT * FROM Users WHERE user_email = '" + email + "'";
	db.query(query,
		function (err, res){
			if (err) throw err;
			info(null, res);
		});
};