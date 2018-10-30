var db = require('../databases/CalendarDB.js');


// exports.get_info = function(email, info){
// 	var query = "SELECT * FROM Users WHERE user_email = '" + email + "'";
// 	db.query(query,
// 		function (err, res){
// 			if (err) throw err;
// 			info(null, res);
// 		});
// };
exports.createCalen = function(userId, res){
	var calenId;
	var query = "INSERT INTO Calendars (user_id) VALUES ('" + userId + "')";
	db.query(query,
		function (err, sqlRes){
			if (err) 
				res(err, null);
			else{
				calenId = sqlRes.insertId;
				res(null, calenId);
			}
		});
};