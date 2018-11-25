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
	var memberId = await getMemberId(projectId);

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

	if (memberId.length == 0){
		throw "projectId" + projectId + "does not exist in Membership table";
	}

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


module.exports = {
	isOwner,
	putEventOwner,
	isUserInProject,
	getProject,
	getEvents,
	getMemberId,
	createEvents,
	deleteEvents,
	putProject,
	createProject,
	deleteProject,
}