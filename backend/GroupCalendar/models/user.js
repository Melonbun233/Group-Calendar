var db = require('../databases/UserDB.js');


exports.info_get = function(email, info){
	var query = "SELECT * FROM Users WHERE user_email = '" + email + "'";
	db.query(query,
		function (err, res){
			if (err) 
				throw err;
			else if (res.length == 0){
				info(null, 404);
			}
			else 
				info(null, res);
		});
};