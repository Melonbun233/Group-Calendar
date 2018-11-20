var db = require('../databases/UserDB.js');
var calen = require('./calendar.js');


async function getInfo (email) {
	var query = "SELECT * FROM Users WHERE userEmail = '" + email + "'";
	
	await db.query(query)
	.then ((result) => {
		if (result.length == 0)
			throw "User name does not refer to any entry.";
		return result[0];
	})
	.catch( (err) => {
		throw err;
	})
};

async function updateUser (user) {
	for (var x in user){
		if (x !== 'userId'){
			var query = "UPDATE Users SET " + x + " = '" + user[x] + "' WHERE userId = '" + user.userId + "'";
			
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

async function createUser (user, profile) {
	var userColumns = Object.keys(user);
	var userValues = Object.values(user);
	userValues = addQuotation(userValues);
	var userQuery = "INSERT INTO Users (" + userColumns + ") VALUES (" + userValues + ");";

	var profileColumns = Object.keys(profile);
	var profileValues = Object.values(profile);
	profileValues = addQuotation(profileValues);
	var profileQuery = "INSERT INTO Profiles (" + profileColumns + ") VALUES (" + profileValues + ");";

	await db.query(userQuery)
	.then ( async (result) => {
		await db.query(profileQuery)
	})
	.catch ( (err) => {
		throw err;
	})
 }

async function deleteUser (userId) {
	var userQuery = "DELETE FROM Users WHERE userId = " + userId + ";";
	var profileQuery = "DELETE FROM Profiles WHERE userId = " + userId + ";";
	
	await db.query(userQuery)
	.then( async (result) => {
		if (!result.affectedRows)
		{
			throw "The user has been deleted."
		}
		return await db.query(profileQuery)
	})
	.then( (result) => {
		if (!result.affectedRows)
		{
			throw "The user's profile has been deleted."
		}
	})
	.catch( (err) => {
		throw err;
	})	
}

async function getProfile (userId) {
	var query = "SELECT * FROM Profiles WHERE userId = " + userId + ";";

	var result = await db.query(query)
						.catch( (err) => {
							throw err;
						})
	
	if (result.length == 0){
		throw "The userId does not exist.";
	}
	return result[0];
	
}

// async function updateProfile

function addQuotation (values){
	var length = values.length;
	var withQuotation = "";

	for (var i = 0; i < length-1; i++){
		withQuotation += "'" + values[i] + "',";
	}

	withQuotation += "'" + values[length-1] + "'";
	return withQuotation;
}

async function getProfileById (userId) {
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

// async function createUserByEmail (email) {
// 	var userColumns = 'userEmail';
// 	var userValues = email;
// 	// userValues = addQuotation(userValues);
// 	var userQuery = "INSERT INTO Users (" + userColumns + ") VALUES (" + userValues + ");";

// 	var profileQuery = "INSERT INTO Profiles (" + userColumns + ") VALUES (" + userValues + ");";

// 	await db.query(userQuery)
// 	.then ( async (result) => {
// 		await db.query(profileQuery)
// 	})
// 	.catch ( (err) => {
// 		throw err;
// 	})
//  }

async function updateProfile(userId, setCmd){
	var query = "UPDATE Users SET " + setCmd + " WHERE userId=" + userId;
	await db.query(query)
	.then ((result) => {
		return result[0];
	})
	.catch ((error) => {
		throw error;
	})
		
};

async function login(userEmail, userPwd){
	var query = "SELECT * FROM Users WHERE userEmail = '" + email + "'"; 
	await db.query(query)
	.then ( (result) => {
		if (result.length == 0)
			throw "Invalid email";
		var userInfo = result[0];
		if(userInfo.userPwd === userPwd){
			return userInfo.userId;
		} else {
			throw "Incorrect password"
		}
	})
	.catch( (err) => {
		throw err;
	})
}


module.exports = {
	getInfo,
	updateUser,
	createUser,
	deleteUser,
	getProfile,
	getProfileById,
	updateProfile,
	login
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