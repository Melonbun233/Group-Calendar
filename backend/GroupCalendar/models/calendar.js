var db = require('../databases/CalendarDB.js');


// exports.get_info = function(email, info){
// 	var query = "SELECT * FROM Users WHERE user_email = '" + email + "'";
// 	db.query(query,
// 		function (err, res){
// 			if (err) throw err;
// 			info(null, res);
// 		});
// };
exports.create_calen = function(user_id){
	var calen_id;
	var query = "INSERT INTO Calendars (user_id) VALUES ('" + user_id + "')";
	db.query(query,
		function (err, res){
			if (err) throw err;
			calen_id = res.insertId;
		});
	return calen_id;
};