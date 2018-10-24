var db = require('../databases/UserDB.js');
var calen = require('./calendar.js');


exports.get_info = function(email, res){
	var query = "SELECT * FROM Users WHERE user_email = '" + email + "'";
	db.query(query,
		function (err, sql_res){
			console.log(email);
			console.log(sql_res[0]);
			if(err) 
				res(err, null);
			else if (sql_res.length == 0)
				res(null, null);
			else 
				res(null, sql_res[0]);
		});
};

exports.update_info = function(info_json, res){
	var queries = '';
	for (var x in info_json){
		queries += ("UPDATE Users SET ? = ? WHERE user_id = ?",
					[x, info_json.x, info_json.user_id]);
		console.log(x);
		console.log(info_json("'",x,"'"));
		console.log(info_json.user_id);
	}
	db.query(queries,
		function(err, sql_res){
			if (err)
				res(err, null);
			else if (update_info)
				res(null, null);
			else 
				res(null, sql_res[0]);
		});
};

exports.get_info_byId = function(user_id, res){
	var query = "SELECT * FROM Users WHERE user_id = '" + user_id + "'";
	db.query(query,
		function (err, sql_res){
			if (err) 
				res(err, null);
			else if (sql_res.length == 0)
				res(null, null);
			else 
				res(null, sql_res);
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
exports.create_user = function(email, res){
	var user_id;
	var query = "INSERT INTO Users (user_email) VALUES ('" + email + "')";
	db.query(query,
		function (err, sql_res){
			if (err) 
				res(err, null);

			user_id = sql_res.insertId;
		});
	var calen_id;
	calen.create_calen(user_id, function(err, calen_res){
		calen_id = calen_res.calen_id;
	});
	var setCmd = "calendar_id = '" + calen_id + "'";
	this.update_user(setCmd, user_id);
	res(null, user_id);
};

// update user record with setCmd
// format of setCmd:
// "column1 = val1, column2 = val2, ..."
exports.update_user = function(setCmd, user_id, res){
	var query = "UPDATE Users SET '" + setCmd + "'' WHERE user_id = '" + user_id +"'";
	db.query(query,
		function (err,sql_res){
			if (err) 
				res(err, null);
			else
				res(null, sql_res);
		});
};