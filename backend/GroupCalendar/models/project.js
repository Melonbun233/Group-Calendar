var ProjectDB = require('../databases/ProjectDB');
var CalendarDB = require('../databases/CalendarDB');
var UserDB = require('../databases/UserDB');

// check ProjectDB -> Projects
async function isOwner (projectId, userId){
	var query = "SELECT * FROM Projects WHERE projectId = '" + projectId + "'";
	var project = await ProjectDB.query(query)
	.catch ( error => {
		throw error;
	})

	if (project.length > 1){
		throw "Multiple projects with same projectId, something's wrong";
	} else if (project.length == 0){
		throw "projectId " + projectId + " does not exist in Projects table";
	}

	if (project[0].projectOwnerId != userId){
		throw  'userId ' + userId + ' is not the owner of projectId ' + projectId;
	}
	return true;
}

// check ProjectDB -> Projects
async function isOwner2 (projectId, userId){
	var query = "SELECT * FROM Projects WHERE projectId = '" + projectId + "'";
	var project = await ProjectDB.query(query)
	.catch ( error => {
		throw error;
	})

	if (project.length > 1){
		throw "Multiple projects with same projectId, something's wrong";
	} else if (project.length == 0){
		throw "projectId " + projectId + " does not exist in Projects table";
	}

	if (project[0].projectOwnerId != userId){
		// this change make it sense
		return false;
		// throw  'userId ' + userId + ' is not the owner of projectId ' + projectId;
	}
	return true;
}

async function putEventOwner (eventId, event){
	for (var x in event){
		var query = "UPDATE Events SET " + x + " = '" + event[x] + "' WHERE eventId = '" + eventId + "'";
		var result = await CalendarDB.query(query)
		.catch ( error => {
			throw error;
		})

		if (result.affectedRows == 0){
			throw "eventId " + eventId + " does not exist in Events table";
		}
	}
}

// event[] of json
async function createEvents (projectId, event){
	var eventIdArr = [];

	for (var i = 0; i < event.length; i++){
		var eventKeys = Object.keys(event[i]);
		var eventValues = Object.values(event[i]);
		eventValues = addQuotation(eventValues);

		var query = "INSERT INTO Events (" + eventKeys + ") VALUES (" + eventValues + ")";
		var result = await CalendarDB.query(query)
		.catch( error => {
			throw error;
		})
		if (result.affectedRows == 0){
			throw "Creating event was not successful, something wrong with CalendarDB";
		}
		
		var eventId = result.insertId;
		query = "INSERT INTO EventList (projectId, eventId) VALUES ('" + projectId + "', '" + eventId + "')";
		result = await ProjectDB.query(query)
		.catch( error => {
			throw error;
		})
		if (result.affectedRows == 0){
			throw "Creating event was not successful, something wrong with CalendarDB";
		}

		eventIdArr.push(eventId);
	}

	return eventIdArr;
}

// eventId[]
async function deleteEvents (eventId){
	for (var i = 0; i < eventId.length; i++){
		var query = "DELETE FROM Events WHERE eventId = '" + eventId[i] + "'";
		var result = await CalendarDB.query(query)
		.catch( error => {
			throw error;
		})
		if (result.affectedRows == 0){
			throw "eventId " + eventId[i] + " does not exist in Events table";
		}

		query = "DELETE FROM EventList WHERE eventId = '" + eventId[i] + "'";
		result = await ProjectDB.query(query)
		.catch( error => {
			throw error;
		})
		if (result.affectedRows == 0){
			throw "eventId " + eventId[i] + " does not exist in EventList table";
		}

		query = "DELETE FROM MemberInEvents WHERE eventId = '" + eventId[i] + "'";
		result = await ProjectDB.query(query)
		.catch( error => {
			throw error;
		})
	}
}

async function isUserInProject (projectId, userId){
	try{
		var memberId = await getMemberId(projectId);
	}catch (error){
		throw error;
	}

	for (var i = 0; i < memberId.length; i++){
		if (memberId[i] == userId){
			return true;
		}
	}

	try{
		await isOwner(projectId, userId);
	} catch (error){
		throw "userId " + userId + " does not belong to projectId " + projectId;
	}
}

async function isUserInProject2 (projectId, userId){
	try{
		var memberId = await getMemberId(projectId);
	}catch (error){
		throw error;
	}

	for (var i = 0; i < memberId.length; i++){
		if (memberId[i] == userId){
			return true;
		}
	}

	try{
		return (await isOwner2(projectId, userId));
	} catch (error){
		throw "userId " + userId + " does not belong to projectId " + projectId;
	}
}

async function isMemberInProject (projectId, userId){
	try{
		var memberId = await getMemberId(projectId);
	}catch (error){
		throw error;
	}

	for (var i = 0; i < memberId.length; i++){
		if (memberId[i] == userId){
			return true;
		}
	}

	return false;
}


async function getProject (projectId){
	var query = "SELECT * FROM Projects WHERE projectId = '" + projectId + "'";
	var project = await ProjectDB.query(query)
	.catch ( error => {
		console.log(error);
		throw error;
	})

	if (project.length == 0){
		throw "projectId" + projectId + "does not exist in Projects table";
	}

	return project[0];
}

// return events[]
async function getEvents (projectId){
	var query = "SELECT eventId FROM EventList WHERE projectId = '" + projectId + "'";
	var eventIds = await ProjectDB.query(query)
	.catch ( error => {
		throw error;
	})

	var allEvents = [];

	for (var i = 0; i < eventIds.length; i++){
		query = "SELECT * FROM Events WHERE eventId = '" + eventIds[i].eventId + "'";
		var event = await CalendarDB.query(query)
		.catch ( error => {
			throw error;
		})
		if (event.length == 0){
			throw "eventId " + eventIds[i].eventId + " does not exist in Events table";
		}

		// get id of all members who have chosen the event
		query = "SELECT * FROM MemberInEvents WHERE eventId = '" + eventIds[i].eventId + "'";
		var result = await ProjectDB.query(query)
		.catch ( error => {
			throw error;
		})

		var chosenId = [];
		if (result.length != 0){
			for(var j = 0; j < result.length; j++){
				chosenId.push(result[j].userId);
			}
		}
		event[0].chosenId = chosenId;

		allEvents.push(event[0]);
	}

	return allEvents;
}

async function getMemberId (projectId){
	var query = "SELECT userId FROM Membership WHERE projectId = '" + projectId + "'";
	var memberId = await ProjectDB.query(query)
	.catch ( error => {
		throw error;
	})

	var memberIdArr = [];
	for (var i = 0; i < memberId.length; i++){
		memberIdArr.push(memberId[i].userId);
	}

	return memberIdArr;
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

async function putProject (projectId, project){
	for (var x in project){
		var query = "UPDATE Projects SET " + x + " = '" + project[x] + "' WHERE projectId = '" + projectId + "'";
		var result = await ProjectDB.query(query)
		.catch (error => {
			throw error;
		})

		if (result.affectedRows == 0){
			throw "projectId " + projectId + " does not exist in Projects table";
		}
	}
}

async function createProject (project, userId){
	var projectKeys = Object.keys(project);
	var projectValues = Object.values(project);
	projectValues = addQuotation(projectValues);

	var query = "INSERT INTO Projects (" + projectKeys + ") VALUES (" + projectValues + ")";
	var result = await ProjectDB.query(query)
	.catch( error => {
		throw error;
	})
	if (result.affectedRows == 0){
		throw "Creating project was not successful, something wrong with ProjectDB";
	}

	return result.insertId;
}

async function deleteProject (projectId){
	// delete all events
	var query = "SELECT eventId FROM EventList WHERE projectId = '" + projectId + "'";
	var  result = await ProjectDB.query(query)
	.catch( error => {
		throw error;
	})
	if (result.length != 0){
		var eventIdArr = [];
		for (var i = 0; i < result.length; i++){
			eventIdArr.push(result[i].eventId);
		}

		try{
			await deleteEvents(eventIdArr);
		} catch (error) {
			throw error;
		}
	}
	

	//delete members in invitelist
	query = "DELETE FROM InviteList WHERE projectId = '" + projectId + "'";
	result = await ProjectDB.query(query)
	.catch (error => {
		throw error;
	})

	// delete members in membership
	query = "DELETE FROM Membership WHERE projectId = '" + projectId + "'";
	result = await ProjectDB.query(query)
	.catch (error => {
		throw error;
	})

	// delete from Projects
	query = "DELETE FROM Projects WHERE projectId = '" + projectId + "'";
	result = await ProjectDB.query(query)
	.catch (error => {
		throw error;
	})
	if (result.affectedRows == 0){
		throw "projectId " + projectId + " does not exist in Projects";
	}

}

async function addUserInEvents (projectId, eventIds, userId){

	try {
		var isDup = await isUserInEvents(eventIds[i], userId); 
	} catch(error) {
		throw error;
	}
	// console.log(isDup);

	for (var i = 0; i < eventIds.length; i++){

		// console.log(eventIds[i]);

		try {
			var isValid = await isEventInProject(projectId, eventIds[i]); 
		} catch(error) {
			throw error;
		}
		
		// console.log(isValid);

		if (isDup == false && isValid == true){
			var query = "INSERT INTO MemberInEvents (eventId, userId) VALUES ('" + eventIds[i] + "', '" + userId + "')";
			var result = await ProjectDB.query(query)
			.catch (error => {
				throw error;
			})

			if (result.affectedRows == 0){
				throw "Err in ProjectDB: Table MemberInEvents could not found";
			}
		}
	}
}

async function deleteUserInEventsAll (projectId, userId){

	var query = "SELECT eventId from EventList WHERE projectId = '" + projectId + "'";
	var result = await ProjectDB.query(query)
	.catch (error => {
		throw error;
	})

	for (var i = 0; i < result.length; i++){
		// console.log(result[i].eventId);

		query = "DELETE FROM MemberInEvents WHERE eventId = '" + result[i].eventId + "' AND userId = '" + userId[i] + "'";
		await ProjectDB.query(query)
		.catch (error => {
			throw error;
		})
	}

}

async function deleteUserInEvents (projectId, eventIds, userId){
	for (var i = 0; i < eventIds.length; i++){
		try {
			var isValid = await isEventInProject(projectId, eventIds[i]); 
		} catch(error) {
			throw error;
		}
		if (isValid == true){
			var query = "DELETE FROM MemberInEvents WHERE eventId = '" + eventIds[i] + "' AND userId = '" + userId + "'";
			var result = await ProjectDB.query(query)
			.catch (error => {
				throw error;
			})
		}
		
		// if (result.affectedRows == 0){
		// 	throw "The entry could not be found";
		// }
	}

}

async function addUserInInviteList (projectId, userId){
	var query = "INSERT INTO InviteList (projectId, userId) VALUES ('" + projectId + "', '" + userId + "')";
	var result = await ProjectDB.query(query)
	.catch (error => {
		throw error;
	});

	if (result.affectedRows == 0){
		throw "Err in ProjectDB: Table MemberInEvents could not found";
	}

}

async function deleteUserInInviteList (projectId, userId){
	var query = "DELETE FROM InviteList WHERE projectId = '" + projectId + "' AND userId = '" + userId + "'";
	var result = await ProjectDB.query(query)
	.catch (error => {
		throw error;
	});

	if (result.affectedRows == 0){
		throw "The entry could not be found";
	}

}

async function isUserInEvents (eventId, userId){
	var query = "SELECT userId FROM MemberInEvents WHERE eventId = '" + eventId + "'";
	var result = await ProjectDB.query(query)
	.catch (error => {
		throw error;
	});

	if (result.affectedRows == 0){
		return false;
	}

	for(var i = 0; i < result.length; i++){
		if(result[i].userId == userId){
			return true;
		}
	}
	return false;

}


//userId[]
async function deleteMembers(projectId, userId){
	for (var i = 0; i < userId.length; i++){
		var query = "DELETE FROM Membership WHERE projectId = '" + projectId + "' AND userId = '" + userId[i] + "'";
		var result = await ProjectDB.query(query)
		.catch (error => {
			throw error;
		})
		if (result.affectedRows == 0){
			throw "No projectId " + projectId + " userId " + userId + " pair in Membership";
		}
	}

	for (var i = 0; i < userId.length; i++){
		var query = "SELECT eventId from EventList WHERE projectId = '" + projectId + "'";
		var result = await ProjectDB.query(query)
		.catch (error => {
			throw error;
		})

		for (var j = 0; j < result.length; j++){
			query = "DELETE FROM MemberInEvents WHERE eventId = '" + result[j].eventId + "' AND userId = '" + userId[i] + "'";
			await ProjectDB.query(query)
			.catch (error => {
				throw error;
			})
		}
	}
}

async function isEventInProject (projectId, eventId){
	console.log(projectId);
	console.log(eventId);

	var query = "SELECT eventId FROM EventList WHERE projectId = '" + projectId + "'";
	var result = await ProjectDB.query(query)
	.catch (error => {
		throw error;
	});

	// console.log(result);

	if (result.affectedRows == 0){
		return false;
	}

	for(var i = 0; i < result.length; i++){
		if(result[i].eventId == eventId){
			return true;
		}
	}
	return false;
}


module.exports = {
	isOwner,
	isOwner2,
	putEventOwner,
	isUserInProject,
	isUserInProject2,
	isMemberInProject,
	getProject,
	getEvents,
	getMemberId,
	createEvents,
	deleteEvents,
	putProject,
	createProject,
	deleteProject,
	addUserInEvents,
	deleteUserInEvents,
	deleteUserInEventsAll,
	addUserInInviteList,
	deleteUserInInviteList,
	deleteMembers,

}