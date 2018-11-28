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
 const query = ProjectDB.query

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
				return Promise.resolve([2]);
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
	let isOwner2 = Project.isOwner2;
	let getMemberId = Project.getMemberId;

	afterEach(()=> {
		Project.isOwner2 = isOwner2;
		Project.getMemberId = getMemberId;
	})

	describe('Testing without err', () => {

		test('is member, true', async () => {

			Project.getMemberId = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([1,2]);
			});

			var result = await Project.isUserInProject2(projectId, userId);
			expect(result).toBe(true);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('is owner, true', async () => {

			Project.getMemberId = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([2, 3]);
			});

			Project.getMemberId = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			});

			var result = await Project.isOwner2(projectId, userId);
			expect(result).toBe(true);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('not in, false', async () => {

			Project.getMemberId = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([2, 3]);
			});

			Project.getMemberId = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			});

			var result = await Project.isOwner2(projectId, userId);
			expect(result).toBe(false);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {
		test('err in 1', async () => {
			Project.getMemberId = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await Project.isUserInProject2(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 2', async () => {
			Project.getMemberId = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([1, 2]);
			});

			Project.getMemberId = jest.fn().mockImplementationOnce(() => {
				return Promise.reject();
			});

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
	let getInvitation = Project.getInvitation;

	afterEach(() => {
		Project.getInvitation = getInvitation;
	})

	describe('Testing without err', () => {

		test('true', async () => {
			Project.getInvitation = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([1, 2]);
			});

			var result = await Project.isUserInInviteList(projectId, userId);
			expect(result).toBe(true);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('false', async () => {
			Project.getInvitation = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([2, 3]);
			});

			var result = await Project.isUserInInviteList(projectId, userId);
			expect(result).toBe(false);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {
		test('err', async () => {
			Project.getInvitation = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			});

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





afterEach( () => {
	ProjectDB.query = query;
})


