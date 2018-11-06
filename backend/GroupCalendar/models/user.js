var db = require('../databases/UserDB.js');
var calen = require('./calendar.js');


async function getInfo (email) {
	var query = "SELECT * FROM Users WHERE userEmail = '" + email + "'";
	
	await db.query(query)
	.then ( (result) => {
		if ( result.length == 0)
			throw "User name does not refer to any entry.";
		return result[0];
	})
	.catch( (err) => {
		throw err;
	})
};

async function updateInfo (info) {
	for (var x in info){
		if (x !== 'userId' && x !== 'uuid'){
			var query = "UPDATE Users SET " + x + " = '" + info[x] + "' WHERE userId = '" + info.userId + "'";
			
			await db.query(query)
			.then( (result) => {
				if (!result.affectedRows)
					throw "No such userId";
			})
			.catch( (err) => {
				throw err;
			})
		}
	}
};

async function createUser (user) {
	var columns = Object.keys(user);
	var values = Object.values(user);
	values = addQuotation(values);

	var query = "INSERT INTO Users (" + columns + ") VALUES (" + values + ");";

	await db.query(query)
	.catch ( err => {
		throw err;
	})

}

async function createProfile (profile) {
	var columns = Object.keys(profile);
	var values = Object.values(profile);
	values = addQuotation(values);

	var query = "INSERT INTO Profiles (" + columns + ") VALUES (" + values + ");";

	await db.query(query)
	.catch ( err => {
		throw err;
	})
}

function addQuotation (values){
	var length = values.length;
	var withQuotation = "";

	for (var i = 0; i < length-1; i++){
		withQuotation += "'" + values[i] + "',";
	}

	withQuotation += "'" + values[length-1] + "'";
	return withQuotation;
}

async function getProfileById (userId, res) {
	var query = "SELECT * FROM Profiles WHERE userId = '" + userId + "'";
	await db.query(query)
	.then ( result => {
		if (!result.length)
			throw "No such userId";
		return result[0];
	})
	.catch ( err => {
		throw err;
	})
}

module.exports = {
	createProfile,
	createUser,
	updateInfo,
	getProfileById
}

//------the above function has been modified to async functions----
//-----------------------------------------------------------------

/* 
async function getProfileById (userId, res) {
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
*/
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
/*
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
*/