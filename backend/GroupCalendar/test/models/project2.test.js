const Project = require('../../models/project');
const ProjectDB = require('../../databases/ProjectDB');
const CalendarDB = require('../../databases/CalendarDB');

jest.mock('../../databases/UserDB');
jest.mock('../../databases/ProjectDB');
jest.mock('../../databases/CalendarDB');

/**
 * Mock List:
 *
 * ProjectDB.query
 */
 const p_query = ProjectDB.query;
 const c_query = CalendarDB.query;

/**
 * Test List:
 *
 * isOwner2
 * isUserInProject2
 * isUserInInviteList
 * addUserInMembership
 * addUserInEvents
 * deleteUserInEvents
 * deleteUserInEventsAll
 * addUserInInviteList
 * deleteUserInInviteList
 *
 * Inner functions:
 * 
 * isUserInEvents
 * isEventInProject
 * isEventAvailable
 */
//
var projectId = "1";
var userId = "1";
var eventId = "1";

describe('Testing isOwner2', () => {

	var getInfoSpy = jest.spyOn(Project, 'isOwner2');

	describe('Testing without err', () => {

		test('length = 0, false', async () => {

			ProjectDB.query = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([]);
			});

			var result = await Project.isOwner2(projectId, userId);
			expect(result).toBe(false);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('not owner, false', async () => {

			ProjectDB.query = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([{projectOwnerId: 2}]);
			});

			var result = await Project.isOwner2(projectId, userId);
			expect(result).toBe(false);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('is owner, true', async () => {

			ProjectDB.query = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([{projectOwnerId: 1}]);
			});

			var result = await Project.isOwner2(projectId, userId);
			expect(result).toBe(true);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {

		test('query err', async () => {
			ProjectDB.query = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await Project.isOwner2(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('length > 1', async () => {
			ProjectDB.query = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([2, 3]);
			});

			await Project.isOwner2(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();
			
		})
	})
})

describe('Testing isUserInProject2', () => {

	var getInfoSpy = jest.spyOn(Project, 'isUserInProject2');

	// mock list: getMemberId, isOwner2

	describe('Testing without err', () => {

		test('is member, true', async () => {

			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 1}]);
			});

			var result = await Project.isUserInProject2(projectId, userId);
			expect(result).toBe(true);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('is owner, true', async () => {

			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 2}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{projectOwnerId: 1}]);
			});

			var result = await Project.isUserInProject2(projectId, userId);
			expect(result).toBe(true);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('not in, false', async () => {

			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 2}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{projectOwnerId: 3}]);
			});

			var result = await Project.isUserInProject2(projectId, userId);
			expect(result).toBe(false);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {
		test('err in 1', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			await Project.isUserInProject2(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 2', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 2}]);
			})
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			await Project.isUserInProject2(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})
})

describe('Testing isUserInInviteList', () => {

	var getInfoSpy = jest.spyOn(Project, 'isUserInInviteList');

	// mock getInvitation

	describe('Testing without err', () => {

		test('true', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{projectId: 1}]);
			})

			var result = await Project.isUserInInviteList(projectId, userId);
			expect(result).toBe(true);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('false', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{projectId: 2}]);
			})

			var result = await Project.isUserInInviteList(projectId, userId);
			expect(result).toBe(false);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {
		test('err', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			await Project.isUserInInviteList(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})
})

describe('Testing addUserInMembership', () => {

	var getInfoSpy = jest.spyOn(Project, 'addUserInMembership');

	describe('Testing without err', () => {

		test('no err', async () => {
			ProjectDB.query = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([1]);
			});

			var result = await Project.addUserInMembership(projectId, userId);
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})

	describe('Failure Test', () => {
		test('query err', async () => {
			ProjectDB.query = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await Project.addUserInMembership(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('length = 0', async () => {
			ProjectDB.query = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([]);
			});

			await Project.addUserInMembership(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})
})


describe('Testing addUserInEvents', () => {

	var getInfoSpy = jest.spyOn(Project, 'addUserInEvents');

	describe('eventIds = []', () => {

		var eventIds = [];

		test('no loop, []', async () => {

			var result = await Project.addUserInEvents(projectId, eventIds, userId);
			expect(result.length).toBe(0);
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})


	describe('eventIds = [1]', () => {

		var eventIds = [1];

		test('dup, valid, available, []', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 1}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{eventId: 1}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 10}]);
			})

			CalendarDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userLimit: 2}]);
			})

			var result = await Project.addUserInEvents(projectId, eventIds, userId);
			expect(result).toBe([]);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('undup, invalid, available, []', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 2}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{eventId: 2}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 10}]);
			})

			CalendarDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userLimit: 2}]);
			})

			var result = await Project.addUserInEvents(projectId, eventIds, userId);
			expect(result).toBe([]);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('undup, valid, inavailable, [1]', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{eventId: 1}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 10}]);
			})

			CalendarDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userLimit: 1}]);
			})

			var result = await Project.addUserInEvents(projectId, eventIds, userId);
			expect(result).toContain(1);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('undup, valid, available, []', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 2}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{eventId: 1}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 10}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve({affectedRows: 1});
			})

			CalendarDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userLimit: 2}]);
			})

			var result = await Project.addUserInEvents(projectId, eventIds, userId);
			expect(result).toBe([]);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {

		var eventIds = [1];

		test('err in 1', async () => {
			ProjectDB.query = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await Project.addUserInEvents(projectId, eventIds, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('undup, err in 2', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 2}]);
			})
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			await Project.addUserInMembership(projectId, eventIds, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('undup, valid, err in 3', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 2}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{eventId: 1}]);
			})
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			await Project.addUserInMembership(projectId, eventIds, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('undup, valid, err in 4', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 2}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{eventId: 1}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 10}]);
			})

			CalendarDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			})
			

			await Project.addUserInMembership(projectId, eventIds, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('undup, valid, available, err in 5', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 2}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{eventId: 1}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 10}]);
			})
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			CalendarDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userLimit: 2}]);
			})

			await Project.addUserInMembership(projectId, eventIds, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})
})

describe('Testing deleteUserInEvents', () => {

	var getInfoSpy = jest.spyOn(Project, 'deleteUserInEvents');

	var eventIds = [1];

	describe('Testing without err', () => {

		test('valid', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{eventId: 1}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([]);
			})

			var result = await Project.deleteUserInEvents(projectId, eventIds, userId);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('invalid', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{eventId: 2}]);
			})

			var result = await Project.deleteUserInEvents(projectId, eventIds, userId);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {
		test('err in 1', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await Project.deleteUserInEvents(projectId, eventIds, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('valid, err in 2', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{eventId: 1}]);
			})
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await Project.deleteUserInEvents(projectId, eventIds, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})
})

describe('Testing deleteUserInEventsAll', () => {

	var getInfoSpy = jest.spyOn(Project, 'deleteUserInEventsAll');

	describe('Testing without err', () => {

		test('valid', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{eventId: 1}]);
			})
			.mockImplementationOnce(() => {
				return Promise.resolve([]);
			})

			var result = await Project.deleteUserInEventsAll(projectId, userId);
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})

	describe('Failure Test', () => {
		test('err in 1', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await Project.deleteUserInEventsAll(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 2', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{eventId: 1}]);
			})
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await Project.deleteUserInEventsAll(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})
})


describe('Testing addUserInInviteList', () => {

	var getInfoSpy = jest.spyOn(Project, 'addUserInInviteList');

	describe('Testing without err', () => {

		test('valid', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve({affectedRows: 1});
			})

			var result = await Project.addUserInInviteList(projectId, userId);
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})

	describe('Failure Test', () => {
		test('err in 1', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await Project.addUserInInviteList(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 2', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve({affectedRows: 0});
			})

			await Project.addUserInInviteList(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})
})


describe('Testing deleteUserInInviteList', () => {

	var getInfoSpy = jest.spyOn(Project, 'deleteUserInInviteList');

	describe('Testing without err', () => {

		test('valid', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve({affectedRows: 1});
			})

			var result = await Project.deleteUserInInviteList(projectId, userId);
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})

	describe('Failure Test', () => {
		test('err in 1', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await Project.deleteUserInInviteList(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 2', async () => {
			ProjectDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve({affectedRows: 0});
			})

			await Project.deleteUserInInviteList(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})
})







afterEach( () => {
	ProjectDB.query = p_query;
	CalendarDB.query = c_query;
})


