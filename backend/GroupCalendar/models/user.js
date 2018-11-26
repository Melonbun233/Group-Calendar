var db = require('../databases/UserDB.js');
var calen = require('./calendar.js');
var ProjectDB = require('../databases/ProjectDB')


async function getInfo (email) {
	var query = "SELECT * FROM Users WHERE userEmail = '" + email + "'";
	
	var result = await db.query(query)
	.catch( (err) => {
		throw err;
	})
	if (result.length == 0){
		return null;
	} else {
		return result[0];
	}
	
};

async function updateUser (userId, userPwd) {
	var query = "UPDATE Users SET userPwd = '" + userPwd + "' WHERE userId = '" + userId + "'";

	var result = await db.query(query)
	.catch( (err) => {
		throw err;
	});

	if (!result.affectedRows)
		throw "No such userId";
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

	var userResult = await db.query(userQuery)
	.catch ( (err) => {
		throw err;
	})

	var profileResult = await db.query(profileQuery)
	.catch ( (err) => {
		throw err;
	})

	return userResult.insertId;
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
	var query = "SELECT * FROM Profiles WHERE userId = " + userId + "";

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
	console.log('In: getProfileById');

	var query = "SELECT * FROM Profiles WHERE userId = " + userId;
	var result = await db.query(query)
	.catch ( err => {
		throw err;
	});

	if (!result.length){
		throw "No such userId";
	}
	console.log(result[0]);
	return result[0];
	
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


async function modifyProfile (userId, profile){
	for (var x in profile){
		var query = "UPDATE Profiles SET " + x + " = '" + profile[x] + "' WHERE userId = '" + userId + "'";

		var result = await db.query(query)
		.catch( (err) => {
			throw err;
		})

		if (result.affectedRows == 0){
			throw "userId " + userId + " does not exist in Profiles";
		}
	}
}

async function updateProfile(setCmd, userId){
	var query = "UPDATE Profiles SET " + setCmd + " WHERE userId=" + userId;
	await db.query(query)
	.then ((result) => {
		return result[0];
	})
	.catch ((error) => {
		throw error;
	})

};

// async function login(email, pwd){
// 	var query = "SELECT * FROM Users WHERE userEmail = '" + email + "'"; 
// 	await db.query(query)
// 	.catch( (error) => {
// 		throw error;
// 	})
// 	.then ((result) => {

// 		console.log(result);

// 		if (result.length === 0)
// 			return 0;
// 		var userInfo = result[0];
// 		if(userInfo.userPwd === pwd){

// 			console.log(userInfo.userId);

// 			return userInfo.userId;
// 		} else {
// 			return -1;
// 		}
// 	})
// }

async function login(email, pwd){
	var query = "SELECT * FROM Users WHERE userEmail = '" + email + "'"; 
	var result = await db.query(query)
	.catch( (error) => {
		throw error;
	})

	console.log(result);

	if (result.length === 0){
		return 0;
	}
	var userInfo = result[0];
	if(userInfo.userPwd === pwd){

		console.log(userInfo.userId);

		return userInfo.userId;

	} else {
		return -1;
	}
	
}

async function getProjectId (userId){
	var query = "SELECT projectId FROM Projects WHERE projectOwnerId = '" + userId + "'";
	var result = await ProjectDB.query(query)
	.catch (error => {
		throw error;
	})

	var projectId = [];
	for (var i = 0; i < result.length; i++){
		projectId.push(result[i].projectId);
	}

	return projectId;
}


async function getInvitation (userId){
	var query = "SELECT * FROM InviteList WHERE userId = '" + userId + "'";
	var result = await ProjectDB.query(query)
	.catch (error => {
		throw error;
	})

	var invitation = [];
	for (var i = 0; i < result.length; i++){
		invitation.push(result[i].userId);
	}

	return invitation;
}

async function emailExist (userEmail){
	var query = "SELECT userEmail from Users WHERE userEmail = '" + userEmail + "'";
	var result = await db.query(query)
	.catch(error => {
		throw error;
	})
	if (result.length != 0){
		throw "userEmail " + userEmail + " has been taken."
	}
}

async function isUserInInviteList (projectId, userId){
	try{
		var invitingProjects = await getInvitingProjects(userId);
	}catch (error){
		throw error;
	}

	for (var i = 0; i < invitingProjects.length; i++){
		if (invitingProjects[i].projectId == projectId){
			return true;
		}
	}

	return false;
}

async function getInvitingProjects (userId){
	var query = "SELECT projectId FROM InviteList WHERE userId = '" + userId + "'";
	var invitingProjects = await db.query(query)
	.catch ( error => {
		throw error;
	})

	if (invitingProjects.length == 0){
		throw "UserId" + userId + "does not exist in InviteList table";
	}

	// var projectIds = [];
	// for (var i = 0; i < invitingProjects.length; i++){
	// 	projectIds.push(invitingProjects[i].projectId);
	// }

	return invitingProjects;
}


module.exports = {
	getInfo,
	updateUser,
	createUser,
	deleteUser,
	getProfile,
	getProfileById,
	updateProfile,
	login,
	modifyProfile,
	getProjectId,
	getInvitation,
	emailExist,

	isUserInInviteList,
	getInvitingProjects,

}