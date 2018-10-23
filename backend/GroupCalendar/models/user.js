var db = require('../databases/UserDB.js');


exports.get_info = function(email, info){
	var query = "SELECT * FROM Users WHERE user_email = '" + email + "'";
	db.query(query,
		function (err, res){
			if (err) throw err;
			info(null, res);
		});
};
exports.create_user = function(email, user_id){
	var query = "INSERT INTO Users ('" + column + "') VALUES ('"+ values + "')";
	db.query(query,
		function (err, res){
			if (err) throw err;
			result()
		});
};