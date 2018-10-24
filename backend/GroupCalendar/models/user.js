var db = require('../databases/UserDB.js');
var calen = require('./calender.js');


exports.get_info = function(email, info){
	var query = "SELECT * FROM Users WHERE user_email = '" + email + "'";
	db.query(query,
		function (err, res){
			if (err) throw err;
			info(null, res);
		});
};
exports.get_info_byId = function(user_id, info){
	var query = "SELECT * FROM Users WHERE user_id = '" + user_id + "'";
	db.query(query,
		function (err, res){
			if (err) throw err;
			info(null, res);
		});
};

// create a new record in Users table and initialize a new calendar record
// return the new user_id
exports.create_user = function(email, res){
	var user_id;
	var query = "INSERT INTO Users (user_email) VALUES ('" + email + "')";
	db.query(query,
		function (err, res){
			if (err) throw err;
			user_id = res.insertId;
			res(null, user_id);
		});
	var calen_id = calen.create_calen(user_id);
	var setCmd = "calendar_id = '" + calen_id + "'";
	this.update_user(setCmd, user_id);
};

// update user record with setCmd
// format of setCmd:
// "column1 = val1, column2 = val2, ..."
exports.update_user = function(setCmd, user_id, res){
	var query = "UPDATE Users SET '" + setCmd + "'' WHERE user_id = '" + user_id +"'";
	db.query(query,
		function (err, res){
			if (err) throw err;
			res(null, res);
		});
};