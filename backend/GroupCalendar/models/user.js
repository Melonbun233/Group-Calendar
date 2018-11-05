var db = require('../databases/UserDB.js');
var calen = require('./calendar.js');


exports.getInfo = function(email, res){
	var query = "SELECT * FROM Users WHERE userEmail = '" + email + "'";
	db.query(query,
		function (err, sqlRes){
			if(err) {
				res(err, null);
			}
			else if (sqlRes.length == 0){
				res(null, null);
			}
			else {
				res(null, sqlRes[0]);
			}
		});
};

exports.updateInfo = function(infoJson, res){
	//var queries = '';
	for (var x in infoJson){
		var query = "UPDATE Users SET " + x + " = '" + infoJson.x + "' WHERE user_id = '" + infoJson.userId + "'";
		db.query(query,
			function (err, sqlRes){
				console.log(sqlRes[0]);
				if(err) {
					res(err, null);
				}
		});
	}
	res(null, infoJson);
};

exports.getProfileById = function(userId, res){
	var query = "SELECT * FROM Profiles WHERE userId = '" + userId + "'";
	db.query(query,
		function (err, sqlRes){
			if (err) {
				res(err, null);
			}
			else if (sqlRes.length == 0){
				res(null, null);
			}
			else {
				res(null, sqlRes);
			}
		});
};
// exports.get_info_bySub = function(user_sub, res){
// 	var query = "SELECT * FROM Users WHERE user_sub = '" + user_sub + "'";
// 	db.query(query,
// 		function (err, sql_res){
// 			if (err) throw err;
// 			if (sql_res.length == 0)
// 				res(null);
// 			else 
// 				res(sql_res);
// 		});
// };

// create a new record in Users table and initialize a new calendar record
// return the new user_id
exports.createUser = function(email, res){
	var userId;
	// create a new user record
	var query = "INSERT INTO Users (user_email) VALUES ('" + email + "')";
	db.query(query,
		function (err, sqlRes){

			if (err) {
				res(err, null);
			}

			userId = sqlRes.insertId;
		});

	// create a calen for a user
	var calenId;
	calen.create_calen(userId, function(err, calenRes){
		calenId = calenRes.calenId;
	});
	var setCmd = "calendarId = '" + calenId + "'";
	this.updateUser(setCmd, userId);

	//create a new user profile
	var query2 = "INSERT INTO Profiles (userEmail, userId) VALUES ('" + email + "','" + userId + "')";
	db.query(query,
		function (err, sqlRes){
			if (err){ 
				res(err, null);
			}
		});

	res(null, userId);
};

// update user record with setCmd
// format of setCmd:
// "column1 = val1, column2 = val2, ..."
exports.updateProfile = function(setCmd, userId, res){
	var query = "UPDATE Profiles SET " + setCmd + " WHERE userId=" + userId;
	db.query(query,
		function (err,sqlRes){
			if (err) {
				res(err, null);
			}
			else{
				res(null, sqlRes);
			}
		});
};

exports.updateUser = function(setCmd, userId, res){
	var query = "UPDATE Users SET " + setCmd + " WHERE userId=" + userId;
	db.query(query,
		function (err,sqlRes){
			if (err) {
				res(err, null);
			}
			else{
				res(null, sqlRes);
			}
		});
};
