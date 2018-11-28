var httpMocks = require('node-mocks-http');
const UserController = require('../../controllers/userController');
const Project = require('../../models/project');

/**
 * Mock List:
 *
 * getInvitation
 * isUserInInviteList
 * deleteUserInInviteList
 * isUserInProject2
 * addUserInMembership
 * deleteUserInInviteList
 */

 /*------------mocking user---------------*/
jest.mock('../../databases/ProjectDB');

/**
 * Test List:
 *
 * getNotification
 * acceptInvite
 * declineInvite
 */
//

describe('Testing getNotification', () => {

	var getInfoSpy = jest.spyOn(UserController, 'getNotification');
	var req = httpMocks.createRequest({
		param: {
			userId: "1"
		}
	});

	test('200', async() => {

		Project.getInvitation = jest.fn().mockImplementationOnce(() => {
			return Promise.resolve();
		})

		var res = httpMocks.createResponse();
		await UserController.getNotification(req, res);
		expect(res.statusCode).toBe(200);
		expect(getInfoSpy).toHaveBeenCalled();

	})

	test('400', async() => {

		Project.getInvitation = jest.fn().mockImplementationOnce(() => {
			return Promise.reject();
		})

		var res = httpMocks.createResponse();
		await UserController.getNotification(req, res);
		expect(res.statusCode).toBe(400);
		expect(getInfoSpy).toHaveBeenCalled();

	})
})

describe('Testing acceptInvite', () => {
	var getInfoSpy = jest.spyOn(UserController, 'acceptInvite');
	var req = httpMocks.createRequest({
		body: {
			userId: "1",
			projectId: "1"
		}
	});

	describe('Testing without err', async () => {

		test('userId not in InviteList, 400', async() => {

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			var res = httpMocks.createResponse();
			await UserController.acceptInvite(req, res);
			expect(res.statusCode).toBe(400);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('userId in Project already, 200', async() => {

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.deleteUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve();
			})

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})
			
			var res = httpMocks.createResponse();
			await UserController.acceptInvite(req, res);
			expect(res.statusCode).toBe(200);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('userId not in Project, 200', async() => {

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.deleteUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve();
			})

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.addUserInMembership = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve();
			})
			
			var res = httpMocks.createResponse();
			await UserController.acceptInvite(req, res);
			expect(res.statusCode).toBe(200);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Err Test', async () => {

		test('err in 1, 403', async() => {

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.reject();
			})

			var res = httpMocks.createResponse();
			await UserController.acceptInvite(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 2, 403', async() => {

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.deleteUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.reject();
			})
			
			var res = httpMocks.createResponse();
			await UserController.acceptInvite(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 3, 403', async() => {

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.deleteUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve();
			})

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.reject();
			})
			
			var res = httpMocks.createResponse();
			await UserController.acceptInvite(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 4, 403', async() => {

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.deleteUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve();
			})

			Project.isUserInProject2 = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.addUserInMembership = jest.fn().mockImplementationOnce(() => {
				return Promise.reject();
			})
			
			var res = httpMocks.createResponse();
			await UserController.acceptInvite(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

})

describe('Testing declineInvite', () => {
	var getInfoSpy = jest.spyOn(UserController, 'acceptInvite');
	var req = httpMocks.createRequest({
		body: {
			userId: "1",
			projectId: "1"
		}
	});

	describe('Testing without err', async () => {

		test('userId not in InviteList, 400', async() => {

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(false);
			})

			var res = httpMocks.createResponse();
			await UserController.acceptInvite(req, res);
			expect(res.statusCode).toBe(400);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('userId in InviteList, 200', async() => {

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.deleteUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve();
			})
			
			var res = httpMocks.createResponse();
			await UserController.acceptInvite(req, res);
			expect(res.statusCode).toBe(200);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Err Test', async () => {
		test('err in 1, 403', async() => {

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.reject();
			})

			var res = httpMocks.createResponse();
			await UserController.acceptInvite(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('err in 2, 403', async() => {

			Project.isUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(true);
			})

			Project.deleteUserInInviteList = jest.fn().mockImplementationOnce(() => {
				return Promise.reject();
			})

			var res = httpMocks.createResponse();
			await UserController.acceptInvite(req, res);
			expect(res.statusCode).toBe(403);
			expect(getInfoSpy).toHaveBeenCalled();

		})

})

afterEach( () => {
	jest.resetAllMocks();
})


