var db = require('../databases/UserDB.js');
//var profile_db = require('../databases/ProfileDB')

exports.get_info = function(email, res){
	var query = "SELECT * FROM Users WHERE user_email = '" + email + "'";
	db.query(query,
		function (err, sql_res){
			if(err) 
				res(err, null);
			else if (sql_res.length == 0)
				res(null, null);
			else 
				res(null, sql_res[0]);
		})
};

exports.update_info = function(info_json, res){
	for (var x in info_json){
		if (x !== 'user_id' && x !== 'uuid'){
			var query = "UPDATE Users SET " + x + " = '" + info_json[x] + "' WHERE user_id = '" + info_json.user_id + "'";
			db.query(query,
				function (err, sql_res){
					if(err) {
						console.log(err);
						//res(null);
					}
				});
		}
	}
	res(info_json);
};

exports.create_user = function(user, res){
	var columns = Object.keys(user);
	var values = Object.values(user);

	var query = "INSERT INTO Users (" + columns + ") VALUES (" + values + ");";
	db.query(query, function (err, sql_res){
		if (err){
			console.log(err);
			return null;
		}
	})
	return user;
}

exports.create_profile = function(profile, res){
	var columns = Object.keys(profile);
	var values = Object.values(profile);

	var query = "INSERT INTO Profiles (" + columns + ") VALUES (" + values + ");";
	db.query(query, function (err, sql_res){
		if(err) {
			console.log(err);
			return null;
		}
	});

	return profile;
}
