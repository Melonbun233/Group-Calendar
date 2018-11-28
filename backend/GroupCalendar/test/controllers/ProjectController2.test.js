var httpMocks = require('node-mocks-http');
const ProjectController = require('../../controllers/projectController');
// const User = require('../../models/user');
const Project = require('../../models/project');
const Mailer = require('../../controllers/mailController');

jest.mock('../../databases/UserDB');
jest.mock('../../databases/ProjectDB');
jest.mock('../../databases/CalendarDB');
jest.mock('../../controllers/mailController');

Mailer.sendEmail = jest.fn();

/**
 * Mock List:
 *
 * Project:
 * isMemberInProject
 * addUserInEvents
 * deleteUserInEvents
 * deleteUserInEventsAll
 * isOwner2
 * isUserInProject2
 * addUserInInviteList
 * deleteUserInInviteList
 * isUserInInviteList
 * getProject
 */

 const isMemberInProject = Project.isMemberInProject;
 const addUserInEvents = Project.addUserInEvents;
 const deleteUserInEvents = Project.deleteUserInEvents;
 const deleteUserInEventsAll = Project.deleteUserInEventsAll;
 const isOwner2 = Project.isOwner2;
 const isUserInProject2 = Project.isUserInProject2;
 const addUserInInviteList = Project.addUserInInviteList;
 const deleteUserInInviteList = Project.deleteUserInInviteList;
 const isUserInInviteList = Project.isUserInInviteList;
 const getProject = Project.getProject;


/**
 * Test List:
 * 
 * addEventMember
 * deleteEventMember
 * deleteEventMemberAll
 * inviteUser
 * deleteInvitedUser
 */
//

describe('Testing addEventMember', () => {

	var getInfoSpy = jest.spyOn(ProjectController, 'addEventMember');

	var req = httpMocks.createRequest({
		body: {
			projectId: '1',
			userId: '1',
			eventId: '[1, 2]'
		}
	});

	describe('Testing without err', () => {

		

		test('invalid, 400', async () => {

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			var res = httpMocks.createResponse();
			await ProjectController.addEventMember(req, res);
			expect(res.statusCode).toBe(400);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('valid, all rolled, 200', async () => {

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.addUserInEvents = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([]);
			})

			var res = httpMocks.createResponse();
			await ProjectController.addEventMember(req, res);
			expect(res.statusCode).toBe(200);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('valid, some unrolled, 202', async () => {

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.addUserInEvents = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve([2, 3]);
			})

			var res = httpMocks.createResponse();
			await ProjectController.addEventMember(req, res);
			expect(res.statusCode).toBe(202);
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})

	describe('Testing with err', () => {

		test('err in 1, 403', async () => {

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			var res = httpMocks.createResponse();
			await ProjectController.addEventMember(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 2, 403', async () => {

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.addUserInEvents = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			var res = httpMocks.createResponse();
			await ProjectController.addEventMember(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})
})


describe('Testing deleteEventMember', () => {

	var getInfoSpy = jest.spyOn(ProjectController, 'deleteEventMember');

	var req = httpMocks.createRequest({
		body: {
			projectId: '1',
			userId: '1',
			eventId: '[1, 2]'
		}
	});

	describe('Testing without err', () => {

		test('invalid, 400', async () => {

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			var res = httpMocks.createResponse();
			await ProjectController.deleteEventMember(req, res);
			expect(res.statusCode).toBe(400);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('valid, 200', async () => {

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.deleteUserInEvents = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve();
			})

			var res = httpMocks.createResponse();
			await ProjectController.deleteEventMember(req, res);
			expect(res.statusCode).toBe(200);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		describe('Testing with err', () => {

			test('err in 1, 403', async () => {

				Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
					return Promise.reject('err');
				})

				var res = httpMocks.createResponse();
				await ProjectController.deleteEventMember(req, res);
				expect(res.statusCode).toBe(403);
				expect(getInfoSpy).toHaveBeenCalled();

			})

			test('err in 2, 403', async () => {

				Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
					return Promise.resolve(true);
				})

				Project.deleteUserInEvents = jest.fn().mockImplementationOnce(() => {
					return Promise.reject('err');
				})

				var res = httpMocks.createResponse();
				await ProjectController.deleteEventMember(req, res);
				expect(res.statusCode).toBe(403);
				expect(getInfoSpy).toHaveBeenCalled();

			})
			
		})

	})
})


describe('Testing deleteEventMemberAll', () => {

	var getInfoSpy = jest.spyOn(ProjectController, 'deleteEventMemberAll');

	var req = httpMocks.createRequest({
		body: {
			projectId: '1',
			userId: '1',
			eventId: '[1, 2]'
		}
	});

	describe('Testing without err', () => {

		test('invalid, 400', async () => {

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			var res = httpMocks.createResponse();
			await ProjectController.deleteEventMemberAll(req, res);
			expect(res.statusCode).toBe(400);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('valid, 200', async () => {

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.deleteUserInEventsAll = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve();
			})

			var res = httpMocks.createResponse();
			await ProjectController.deleteEventMemberAll(req, res);
			expect(res.statusCode).toBe(200);
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})

	describe('Testing with err', () => {

		test('err in 1, 403', async () => {

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			var res = httpMocks.createResponse();
			await ProjectController.deleteEventMemberAll(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 2, 403', async () => {

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.deleteUserInEventsAll = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			var res = httpMocks.createResponse();
			await ProjectController.deleteEventMemberAll(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

})

describe('Testing inviteUser', () => {

	var getInfoSpy = jest.spyOn(ProjectController, 'inviteUser');

	var req = httpMocks.createRequest({
		body: {
			projectId: '1',
			userId: '1',
			invitedEmail: 'test@mail.com'
		}
	});

	describe('Testing without err', () => {

		test('is not owner, 403', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			var res = httpMocks.createResponse();
			await ProjectController.inviteUser(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('owner, user not found, 404', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.getInfo = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(null);
			})

			var res = httpMocks.createResponse();
			await ProjectController.inviteUser(req, res);
			expect(res.statusCode).toBe(404);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('owner, user found, inviting self, 400', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.getInfo = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({userId: 1});
			})

			var res = httpMocks.createResponse();
			await ProjectController.inviteUser(req, res);
			expect(res.statusCode).toBe(400);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('owner, user found, user in invitelist, 302', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.getInfo = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({userId: 2});
			})

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			var res = httpMocks.createResponse();
			await ProjectController.inviteUser(req, res);
			expect(res.statusCode).toBe(302);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('owner, user found, user in project, 302', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.getInfo = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({userId: 2});
			})

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			var res = httpMocks.createResponse();
			await ProjectController.inviteUser(req, res);
			expect(res.statusCode).toBe(302);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('owner, user found, valid, 200', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.getInfo = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({userId: 2});
			})

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			Project.addUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve();
			})

			Project.getProject = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve();
			})

			var res = httpMocks.createResponse();
			await ProjectController.inviteUser(req, res);
			expect(res.statusCode).toBe(200);
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})


	describe('Testing with err', () => {

		test('err in 1, 403', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			var res = httpMocks.createResponse();
			await ProjectController.inviteUser(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 2, 403', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.getInfo = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			var res = httpMocks.createResponse();
			await ProjectController.inviteUser(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 3, 403', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.getInfo = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({userId: 2});
			})

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			var res = httpMocks.createResponse();
			await ProjectController.inviteUser(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 4, 403', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.getInfo = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({userId: 2});
			})

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			var res = httpMocks.createResponse();
			await ProjectController.inviteUser(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 5, 403', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.getInfo = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({userId: 2});
			})

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			Project.addUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})


			var res = httpMocks.createResponse();
			await ProjectController.inviteUser(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();
		})

		test('err in 6, 403', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.getInfo = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({userId: 2});
			})

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			Project.addUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve();
			})

			Project.getProject = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			var res = httpMocks.createResponse();
			await ProjectController.inviteUser(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();
		})

	})
})

describe('Testing deleteInvitedUser', () => {

	var getInfoSpy = jest.spyOn(ProjectController, 'deleteInvitedUser');

	var req = httpMocks.createRequest({
		body: {
			projectId: '1',
			userId: '1',
			invitedId: '2'
		}
	});

	describe('Testing without err', () => {

		test('is not owner, 403', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			var res = httpMocks.createResponse();
			await ProjectController.deleteInvitedUser(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('owner, user not in invitelist, 404', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			var res = httpMocks.createResponse();
			await ProjectController.deleteInvitedUser(req, res);
			expect(res.statusCode).toBe(404);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('owner, user in invitelist, 200', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.deleteUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve();
			})

			var res = httpMocks.createResponse();
			await ProjectController.deleteInvitedUser(req, res);
			expect(res.statusCode).toBe(200);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Testing with err', () => {

		test('err in 1, 403', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			var res = httpMocks.createResponse();
			await ProjectController.deleteInvitedUser(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 2, 403', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			var res = httpMocks.createResponse();
			await ProjectController.deleteInvitedUser(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 3, 403', async () => {

			Project.isOwner2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.deleteUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.reject('err');
			})

			var res = httpMocks.createResponse();
			await ProjectController.deleteInvitedUser(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})
		
	})
})


afterEach( () => {
	Project.isMemberInProject = isMemberInProject;
	Project.addUserInEvents = addUserInEvents;
	Project.deleteUserInEvents = deleteUserInEvents;
	Project.deleteUserInEventsAll = deleteUserInEventsAll;
	Project.isOwner2 = isOwner2;
	Project.isUserInProject2 = isUserInProject2;
	Project.addUserInInviteList = addUserInInviteList;
	Project.deleteUserInInviteList = deleteUserInInviteList;
	Project.isUserInInviteList = isUserInInviteList;
	Project.getProject = getProject;
})


