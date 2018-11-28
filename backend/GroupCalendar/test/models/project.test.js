var Project = require('../../models/project');

jest.mock('../../databases/UserDB');
var db = require('../../databases/UserDB');
db.query = jest.fn();

jest.mock('../../databases/ProjectDB');
var ProjectDB = require('../../databases/ProjectDB');
ProjectDB.query = jest.fn();

jest.mock('../../databases/CalendarDB');
var CalendarDB = require('../../databases/CalendarDB');
CalendarDB.query = jest.fn();

// const getMemberId = Project.getMemberId;
// var isOwner = Project.isOwner;

// beforeEach( () => {
// 	Project.getMemberId = getMemberId;
// 	Project.isOwner = isOwner;
// })

describe('Testing models/project', () => {
	var event = [{
		"eventName": "test"
	}]
	var project = {
		"projectName": "test"
	}

	describe('Testing isOwner', () => {
		test('isOwner returns true', async () => {
			projectDbReturnIsOwner(1);
			await Project.isOwner(1, 1)
			.then(result => {
				expect(result).toBe(true);
			})
		})
		test('isOwner returns false', async () => {
			projectDbReturnIsOwner(0);
			await Project.isOwner(1,1)
			.then(result => {
				expect(result).toBe(false);
			})
		})
		test('multiple project with same projectId, throws error', async () => {
			projectDbReturnIsOwner(2);
			await Project.isOwner(1,1)
			.catch(error => {
				expect(error).toBe("Multiple projects with same projectId, something's wrong");
			})
		})
		test('non-existing projectId', async () => {
			projectDbReturnIsOwner(-1);
			await Project.isOwner(1,1)
			.catch(error => {
				expect(error).toBe("projectId 1 does not exist in Projects table");
			})
		})
		test('projectDbErr', async () => {
			projectDbErr();
			await Project.isOwner(1,1)
			.catch(error => {
				expect(error).toBe("projectDbErr");
			})
		})
	})

	describe('Testing putEventOwner', () => {
		test('existing eventId', async () => {
			calendarDbAffectedRows(1);
			await Project.putEventOwner(1, event);
			expect(CalendarDB.query.mock.calls.length).toBe(1);
		})
		test('non-existing eventId', async () => {
			calendarDbAffectedRows(0);
			await Project.putEventOwner(1, event)
			.catch(error => {
				expect(error).toBe("eventId 1 does not exist in Events table")
			})
		})
		test('calendarDbErr', async () => {
			calendarDbErr();
			await Project.putEventOwner(1, event)
			.catch(error => {
				expect(error).toBe("calendarDbErr");
			})
		})
	})

	describe('Testing createEvents', () => {
		test('create events success', async () => {
			calendarDbAffectedRows(1);
			projectDbAffectedRows(1);

			await Project.createEvents(1, event)
			.then(result => {
				expect(result[0]).toBe(1);
			})
		})
		test('create events fail in Events table', async () => {
			calendarDbAffectedRows(0);

			await Project.createEvents(1, event)
			.catch(error => {
				expect(error).toBe("Creating event was not successful, something wrong with CalendarDB");
			})
		})
		test('create events fail in EventList table', async () => {
			calendarDbAffectedRows(1);
			projectDbAffectedRows(0);

			await Project.createEvents(1, event)
			.catch(error => {
				expect(error).toBe("Creating event was not successful, something wrong with CalendarDB");
			})
		})
		test('calendarDbErr', async () => {
			calendarDbErr();
			await Project.createEvents(1, event)
			.catch(error => {
				expect(error).toBe("calendarDbErr");
			})
		})
		test('projectDbErr', async () => {
			calendarDbAffectedRows(1);
			projectDbErr();

			await Project.createEvents(1, event)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
	})

	describe('Testing deleteEvents', () => {
		test('delete events success', async () => {
			calendarDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbAffectedRows(1);

			await Project.deleteEvents([1]);
			expect(CalendarDB.query.mock.calls.length).toBe(1);
			expect(ProjectDB.query.mock.calls.length).toBe(2);
		})
		test('event not in Events table', async () => {
			calendarDbAffectedRows(0);
			await Project.deleteEvents([1])
			.catch(error => {
				expect(error).toBe("eventId 1 does not exist in Events table");
			})
		})
		test('event not in EventList table', async () => {
			calendarDbAffectedRows(1);
			projectDbAffectedRows(0);
			await Project.deleteEvents([1])
			.catch(error => {
				expect(error).toBe("eventId 1 does not exist in EventList table");
			})
		})
		test('calendarDbErr', async () => {
			calendarDbErr();
			await Project.deleteEvents([1])
			.catch(error => {
				expect(error).toBe('calendarDbErr');
			})
		})
		test('projectDbErr', async () => {
			calendarDbAffectedRows(1);
			projectDbErr();
			await Project.deleteEvents([1])
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
		test('second projectDbErr', async () => {
			calendarDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbErr();
			await Project.deleteEvents([1])
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
	})

	describe('Testing isUserInProject', () => {
		test('user in project', async () => {
			projectDbReturnUserId(1);
			await Project.isUserInProject(1, 1)
			.then(result => {
				expect(result).toBe(true);
			})
		})
		test('user in project as owner', async () => {
			projectDbReturnUserId(2);
			projectDbReturnIsOwner(1);
			await Project.isUserInProject(1,1)
			.then(result => {
				expect(result).toBe(true);
				expect(ProjectDB.query.mock.calls.length).toBe(2);
			})
		})
		test('projectDbErr', async () => {
			projectDbReturnUserId(2);
			projectDbErr();
			await Project.isUserInProject(1,1)
			.catch(error => {
				expect(error).toBe("projectDbErr");
			})
		})
	})

	describe('Testing getProject', () => {
		test('existing projectId', async () => {
			projectDbReturn(1);
			await Project.getProject(1)
			.then(result => {
				expect(result.result).toBe("Some results");
			})
		})
		test('non-existing projectId', async () => {
			projectDbReturn(0);
			await Project.getProject(1)
			.catch(error => {
				expect(error).toBe("projectId1does not exist in Projects table");
			})
		})
		test('projectDbErr', async () => {
			projectDbErr();
			await Project.getProject(1)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
	})

	describe('Testing getEvents', () => {
		test('existing projectId that has events', async () => {
			projectDbReturnEventId(1);
			calendarDbReturn(2);
			projectDbReturnUserId(3);

			await Project.getEvents(1)
			.then(result => {
				expect(result[0].eventId).toBe(2);
				expect(result[0].chosenId[0]).toBe(3);
			})
		})
		test('existing projectId that has no events', async () => {
			projectDbReturnEventId(0);
			await Project.getEvents(1)
			.then(result => {
				expect(result.length).toBe(0);
			})
		})
		test('event not in Events table', async	() => {
			projectDbReturnEventId(1);
			calendarDbReturn(0);
			await Project.getEvents(1)
			.catch(error => {
				expect(error).toBe("eventId 1 does not exist in Events table");
			})
		})
		test('event has no members', async () => {
			projectDbReturnEventId(1);
			calendarDbReturn(2);
			projectDbReturn(0);
			await Project.getEvents(1)
			.then(result => {
				expect(result[0].chosenId.length).toBe(0);
			})
		})
		test('projectDbErr in eventlist', async () => {
			projectDbErr();
			await Project.getEvents(1)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
		test('calendarDbErr in events', async () => {
			projectDbReturnEventId(1);
			calendarDbErr();
			await Project.getEvents(1)
			.catch(error => {
				expect(error).toBe('calendarDbErr');
			})
		})	
		test('projectDbErr in eventlist', async () => {
			projectDbReturnEventId(1);
			calendarDbReturn(2);
			projectDbErr();
			await Project.getEvents(1)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
	})

	describe('Testing getMemberId', async () => {
		test('existing projectId', async () => {
			projectDbReturnUserId(5);
			await Project.getMemberId(1)
			.then(result => {
				expect(result[0]).toBe(5);
			})
		})
		test('non-existing projectId', async () => {
			projectDbReturnUserId(0);
			await Project.getMemberId(1)
			.then(result => {
				expect(result[0]).toBe();
			})
		})
		test('projectDbErr', async () => {
			projectDbErr();
			await Project.getMemberId(1)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
	})

	describe('Testing putProject', () => {
		test('update success', async () => {
			projectDbAffectedRows(1);
			await Project.putProject(1, project)
			expect(ProjectDB.query.mock.calls.length).toBe(1);
		})
		test('update fail', async () => {
			projectDbAffectedRows(0);
			await Project.putProject(1, project)
			.catch(error => {
				expect(error).toBe("projectId 1 does not exist in Projects table");
			})
		})
		test('projectDbErr', async () => {
			projectDbErr();
			await Project.putProject(1, project)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
	})

	describe('Testing createProject', () => {
		test('create success', async () => {
			projectDbAffectedRows(2);
			await Project.createProject(project, 1)
			.then(result => {
				expect(result).toBe(2);
			})
		})
		test('create fail', async () => {
			projectDbAffectedRows(0);
			await Project.createProject(project, 1)
			.catch(error => {
				expect(error).toBe("Creating project was not successful, something wrong with ProjectDB");
			})
		})
		test('projectDbErr', async () => {
			projectDbErr();
			await Project.createProject(project, 1)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
	})

	describe('Testing deleteProject', () => {
		test('delete success', async () => {
			projectDbReturnEventId(1);
			//deleteEvents
			calendarDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbAffectedRows(1);
			//delete from invitelist
			projectDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbAffectedRows(1);

			await Project.deleteProject(1);
			expect(ProjectDB.query.mock.calls.length).toBe(6);
		})
		test('non-existing projectId in Projects', async () => {
			projectDbReturnEventId(1);
			//deleteEvents
			calendarDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbAffectedRows(1);
			//delete from invitelist
			projectDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbAffectedRows(0);

			await Project.deleteProject(1)
			.catch(error => {
				expect(error).toBe("projectId 1 does not exist in Projects");
			})
		})
		test('very first projectDbErr', async () => {
			projectDbErr(); 
			await Project.deleteProject(1)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
		test('projectDbErr in deleteEvents', async () => {
			projectDbReturnEventId(1);
			//deleteEvents
			calendarDbAffectedRows(1);
			projectDbErr(); 
			await Project.deleteProject(1)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
		test('projectDbErr in invitelist', async () => {
			projectDbReturnEventId(1);
			//deleteEvents
			calendarDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbErr(); 
			await Project.deleteProject(1)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
		test('projectDbErr in membership', async () => {
			projectDbReturnEventId(1);
			//deleteEvents
			calendarDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbErr(); 
			await Project.deleteProject(1)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
		test('projectDbErr in projects', async () => {
			projectDbReturnEventId(1);
			//deleteEvents
			calendarDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbAffectedRows(1);
			projectDbErr(); 
			await Project.deleteProject(1)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
	})

	describe('Testing deleteMembers', () => {
		test('delete success', async () => {
			projectDbAffectedRows(1);
			projectDbReturn(1);
			projectDbAffectedRows(1);
			await Project.deleteMembers(1, [1]);
			expect(ProjectDB.query.mock.calls.length).toBe(3);
		})
		test('no projectId and userId pair', async () => {
			projectDbAffectedRows(0);
			await Project.deleteMembers(1, [1])
			.catch(error => {
				expect(error).toBe("No projectId 1 userId 1 pair in Membership");
			})
		})
		test('projectDbErr in membership', async () => {
			projectDbErr();
			await Project.deleteMembers(1, [1])
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
		test('projectDbErr in EventList', async () => {
			projectDbAffectedRows(1);
			projectDbErr();
			await Project.deleteMembers(1, [1])
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
		test('projectDbErr in EventList', async () => {
			projectDbAffectedRows(1);
			projectDbReturn(1);
			projectDbErr();
			await Project.deleteMembers(1, [1])
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
	})

	describe('Testing getInvitation', async () => {
		test('existing userId', async () => {
			projectDbReturnUserId(3);
			await Project.getInvitation(1)
			.then(result => {
				expect(result[0]).toBe(3);
			})
		})
		test('projectDbErr', async () => {
			projectDbErr();
			await Project.getInvitation(1)
			.catch(error => {
				expect(error).toBe('projectDbErr');
			})
		})
	})
})

//--------------db helper functions-------------------
function userDbErr(){
	db.query.mockImplementationOnce( () => {
		return Promise.reject("userDbErr");
	});
}

function userDbAffectedRows(rows){
	db.query.mockImplementationOnce( () => {
		return Promise.resolve({affectedRows: rows});
	});
}

function userDbReturn(numResult){
	db.query.mockImplementationOnce( () => {
		if (numResult == 0){
			return Promise.resolve([]);
		} else {
			return Promise.resolve([{result: "Some results"}]);
		}
	});
}

function userDbReturnIsAdmin(isAdmin){
	db.query.mockImplementationOnce( () => {
		return Promise.resolve([
			{"isAdmin": isAdmin}
		])
	})
}

function projectDbReturn(numResult){
	ProjectDB.query.mockImplementationOnce( () => {
		if (numResult == 0){
			return Promise.resolve([]);
		} else {
			return Promise.resolve([{result: "Some results"}]);
		}
	})
}

function projectDbReturnIsOwner(isOwner){
	ProjectDB.query.mockImplementationOnce( () => {
		if (isOwner > 1){
			return Promise.resolve([
				{"projectOwnerId": 1},
				{"projectOwnerId": 2}
			])
		} else if (isOwner == 0 || isOwner == 1) {
			return Promise.resolve([
				{"projectOwnerId": isOwner}
			]);
		} else {
			return Promise.resolve([]);
		}
	})
}

function projectDbReturnUserId(userId){
	ProjectDB.query.mockImplementationOnce( () => {
		if (userId > 0){
			return Promise.resolve([{userId}])
		} else {
			return Promise.resolve([]);
		}
	})
}

function projectDbReturnEventId (eventId){
	ProjectDB.query.mockImplementationOnce( () => {
		if (eventId > 0){
			return Promise.resolve([{eventId}])
		} else {
			return Promise.resolve([]);
		}
	})
}

function projectDbErr(){
	ProjectDB.query.mockImplementationOnce( () => {
		return Promise.reject("projectDbErr");
	});
}

function projectDbAffectedRows(affectedRows){
	ProjectDB.query.mockImplementationOnce( () => {
		return Promise.resolve({
			"affectedRows": affectedRows,
			"insertId": affectedRows
		});
	})
}

function calendarDbReturn(numResult){
	CalendarDB.query.mockImplementationOnce( () => {
		if (numResult){
			return Promise.resolve([{eventId: numResult}]);
		} else {
			return Promise.resolve([]);
		}
	})
}

function calendarDbAffectedRows(affectedRows){
	CalendarDB.query.mockImplementationOnce( () => {
		return Promise.resolve({
			"affectedRows": affectedRows,
			"insertId": affectedRows
		})
	})
}

function calendarDbErr(){
	CalendarDB.query.mockImplementationOnce( () => {
		return Promise.reject('calendarDbErr');
	})
}

afterEach( () => {
	db.query.mockReset();
	ProjectDB.query.mockReset();
	CalendarDB.query.mockReset();
});
