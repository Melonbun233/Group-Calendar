var httpMocks = require('node-mocks-http');
const userController = require('../../controllers/userController');

jest.mock('../../models/user');
jest.mock('../../models/project');
jest.mock('../../controllers/uuidGenerator');
var User = require('../../models/user');
var Project = require('../../models/project');
var UidG = require('../../controllers/uuidGenerator');

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
		},
		session: {
			uuid: ""
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
			mockUuidCreate();
			await userController.userCreate(req, res);
			expect(res.statusCode).toBe(200);
		})
		test('createUser fail', async () => {
			var res = httpMocks.createResponse();
			mockEmailExist(1);
			mockCreateUser(0);
			await userController.userCreate(req, res);
			expect(res.statusCode).toBe(400);
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

	describe('Testing profileGet', () => {
		test('success', async () => {
			var res = httpMocks.createResponse();
			mockGetProfile(1);
			mockGetInvitaion(1);
			await userController.profileGet(req, res);
			expect(res.statusCode).toBe(200);
		})
		test('fail', async () => {
			var res = httpMocks.createResponse();
			mockGetProfile(1);
			mockGetInvitaion(0);
			await userController.profileGet(req, res);
			expect(res.statusCode).toBe(403);
		})
	})

	describe('Testing profileUpdate', () => {
		test('success', async () => {
			var res = httpMocks.createResponse();
			mockModifyProfile(1);
			await userController.profileUpdate(req, res);
			expect(res.statusCode).toBe(200);
		})
		test('fail', async () => {
			var res = httpMocks.createResponse();
			mockModifyProfile(0);
			await userController.profileUpdate(req, res);
			expect(res.statusCode).toBe(403);
		})
	})

	describe('Testing getProjectId', () => {
		test('success', async () => {
			var res = httpMocks.createResponse();
			mockGetProjectId(1);
			await userController.getProjectId(req, res);
			expect(res.statusCode).toBe(200);
		})
		test('fail', async () => {
			var res = httpMocks.createResponse();
			mockGetProjectId(0);
			await userController.getProjectId(req, res);
			expect(res.statusCode).toBe(403);
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

function mockUuidCreate(){
	UidG.uuidCreate = jest.fn().mockImplementation(() => {
		return 1;
	})
}

function mockGetProfile(success){
	User.getProfile = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve({userId: 1});
		} else {
			return Promise.reject();
		}
	})
}

function mockGetInvitaion(success){
	User.getInvitation = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve(1);
		} else {
			return Promise.reject();
		}
	})
}

function mockModifyProfile(success){
	User.modifyProfile = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve();
		} else {
			return Promise.reject();
		}
	})
}

function mockGetProjectId(success){
	User.getProjectId = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve(1);
		} else {
			return Promise.reject();
		}
	})
}