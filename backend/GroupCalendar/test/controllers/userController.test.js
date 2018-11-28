var httpMocks = require('node-mocks-http');
const userController = require('../../controllers/userController');

jest.mock('../../models/user');
jest.mock('../../models/project');
var User = require('../../models/user');
var Project = require('../../models/project');

describe('Testing userController', () => {
	var req = httpMocks.createRequest({
		body: {
			projectId: 1,
			userId: 1,
			update: {
				userPwd: "123"
			},
			user: {
				userEmail: "123@gmail.com"
			}
		},
		param:{
			projectId: 1,
			userId: 1
		}
	});

	describe('Testing userUpdate', () => {
		test('updateUser success', async () => {
			var res = httpMocks.createResponse();
			mockUpdateUser(1);
			await userController.userUpdate(req, res);
			expect(res.statusCode).toBe(200);
		})
		test('updateUser fail', async () => {
			var res = httpMocks.createResponse();
			mockUpdateUser(0);
			await userController.userUpdate(req, res);
			expect(res.statusCode).toBe(403);
		})
	})

	describe('Testing userCreate', () => {
		test('emailExist error', async () => {
			var res = httpMocks.createResponse();
			mockEmailExist(0);
			await userController.userCreate(req, res);
			expect(res.statusCode).toBe(403);
		})
		test('createUser success', async () => {
			var res = httpMocks.createResponse();
			mockEmailExist(1);
			mockCreateUser(1);
			await userController.userCreate(req, res);
			expect(res.statusCode).toBe(200);
		})
		test('createUser fail', async () => {
			var res = httpMocks.createResponse();
			mockEmailExist(1);
			mockCreateUser(0);
			await userController.userCreate(req, res);
			expect(res.statusCode).toBe(403);
		})
	})

	describe('Testing userDelete', () => {
		test('isAdmin false', async () => {
			var res = httpMocks.createResponse();
			mockIsAdmin(0);
			await userController.userDelete(req, res);
			expect(res.statusCode).toBe(400);
		})
		test('isAdmin error', async () => {
			var res = httpMocks.createResponse();
			mockIsAdmin(-1);
			await userController.userDelete(req, res);
			expect(res.statusCode).toBe(403);
		})
		test('deleteUser success', async () => {
			var res = httpMocks.createResponse();
			mockIsAdmin(1);
			mockDeleteUser(1);
			await userController.userDelete(req, res);
			expect(res.statusCode).toBe(200);
		})
		test('deleteUser fail', async () => {
			var res = httpMocks.createResponse();
			mockIsAdmin(1);
			mockDeleteUser(0);
			await userController.userDelete(req, res);
			expect(res.statusCode).toBe(404);
		})
	})
})

function mockUpdateUser(success){
	User.updateUser = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve();
		} else {
			return Promise.reject("updateUser fail");
		}
	})
}

function mockEmailExist(success){
	User.emailExist = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve();
		} else {
			return Promise.reject();
		}
	})
}

function mockCreateUser(success){
	User.createUser = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve({profile: success});
		} else {
			return Promise.reject();
		}
	})
}

function mockIsAdmin(isAdmin){
	User.isAdmin = jest.fn().mockImplementationOnce(() => {
		if (isAdmin != -1){
			return Promise.resolve(isAdmin);
		} else {
			return Promise.reject();
		}
	})
}

function mockDeleteUser(success){
	User.deleteUser = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve();
		} else {
			return Promise.reject();
		}
	})
}
