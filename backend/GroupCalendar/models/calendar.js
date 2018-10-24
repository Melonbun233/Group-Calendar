var db = require('../databases/CalendarDB.js');


// exports.get_info = function(email, info){
// 	var query = "SELECT * FROM Users WHERE user_email = '" + email + "'";
// 	db.query(query,
// 		function (err, res){
// 			if (err) throw err;
// 			info(null, res);
// 		});
// };
exports.create_calen = function(user_id, res){
	var calen_id;
	var query = "INSERT INTO Calendars (user_id) VALUES ('" + user_id + "')";
	db.query(query,
		function (err, sql_res){
			if (err) 
				res(err, null);
			else{
				calen_id = sql_res.insertId;
				res(null, calen_id);
			}
		});
};