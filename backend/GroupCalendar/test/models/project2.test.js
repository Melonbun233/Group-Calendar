const Project = require('../models/project');
const ProjectDB = require('../databases/ProjectDB');
const CalendarDB = require('../databases/CalendarDB');

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
 * isMemberInProject
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
				return Promise.resolve([1]);
			});

			var result = await Project.isOwner2(projectId, userId);
			expect(result).toBe(true);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {
		test('query err', () => {
			ProjectDB.query = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await Project.isOwner2(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('length > 1', () => {
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

	beforeEach(()=> {

	})

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
				return Promise.resolve([1]);
			});

			var result = await Project.isOwner2(projectId, userId);
			expect(result).toBe(true);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {
		test('query err', () => {
			ProjectDB.query = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await Project.isOwner2(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('length > 1', () => {
			ProjectDB.query = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([2, 3]);
			});

			await Project.isOwner2(projectId, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})
	}
})


	afterEach( () => {
		ProjectDB.query = query;
	})


