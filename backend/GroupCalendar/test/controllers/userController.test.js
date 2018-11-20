var httpMocks = require('node-mocks-http');
const userController = require('../../controllers/userController');
const User = require('../../models/user');

/*------------mocking db.query---------------*/
jest.mock('../../databases/UserDB');
const db = require('../../databases/UserDB');
db.query = jest.fn();
/*-----------mocking validationResult---------*/
// jest.mock('express-validator/check/index');
// var validationResult = require('express-validator/check/index');
// validationResult = jest.fn().mockImplementation( () => {
// 	var result = {isEmpty: () => {return false;}};
// 	return result;
// });

describe('Testing userController', () => {
	describe('Testing userInfoGet', () => {
		var req = httpMocks.createRequest({
			param: {
				userEmail: "123@gmail.com"
			}
		});

		var getInfoSpy = jest.spyOn(User, 'getInfo');

		test('Existing userEmail, return 200', async () => {
			var res = httpMocks.createResponse();
			sqlReturn(1);
			await userController.userInfoGet(req, res);
			expect(getInfoSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(200);
		})
		test('Non-existing userEmail, return 404', async () => {
			var res = httpMocks.createResponse();
			sqlReturn(0);
			await userController.userInfoGet(req, res);
			expect(res.statusCode).toBe(400);
			expect(getInfoSpy).toHaveBeenCalled();
		})
		test('SQL internal error', async () => {
			var res = httpMocks.createResponse();
			sqlInternalErr();
			await userController.userInfoGet(req, res);
			expect(res.statusCode).toBe(400);
			expect(getInfoSpy).toHaveBeenCalled();
		})
	})
	describe('Testing userUpdate', () => {
		var req = httpMocks.createRequest({
			body: {
				userId: 1,
				userPwd: "123"
			}
		});

		var updateUserSpy = jest.spyOn(User, 'updateUser');

		test('Exisiting userId, should call updateUser, return 200', async () => {
			var res = httpMocks.createResponse();
			sqlAffectedRows(1);
			await userController.userUpdate(req, res);
			expect(updateUserSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(200);
		})
		test('Non-existing userId, should call updateUser, return 400', async () => {
			var res = httpMocks.createResponse();
			sqlAffectedRows(0);
			await userController.userUpdate(req, res);
			expect(updateUserSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(400);
		})
		test('SQL internal error', async () => {
			var res = httpMocks.createResponse();
			sqlInternalErr();
			await userController.userUpdate(req, res);
			expect(res.statusCode).toBe(400);
			expect(updateUserSpy).toHaveBeenCalled();
		})
	})
	describe('Testing userCreate', () => {
		var req = httpMocks.createRequest({
			body: {
				user: {
					userEmail: "123@gmail.com",
					userPwd: "123"
				},
				profile: {
					userEmail: "123@gmail.com"
				}
			}
		});

		var createUserSpy = jest.spyOn(User, 'createUser');

		test('Successful query, return 200', async () => {
			var res = httpMocks.createResponse();
			sqlAffectedRows(1);
			await userController.userCreate(req, res);
			expect(createUserSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(200);
		})
		test('SQL internal err', async () => {
			var res = httpMocks.createResponse();
			sqlInternalErr();
			await userController.userCreate(req, res);
			expect(res.statusCode).toBe(400);
			expect(createUserSpy).toHaveBeenCalled();
		})
	})
	describe('Testing userDelete', () => {
		var req = httpMocks.createRequest({
			body: {
				userId: 1
			}
		});

		const deleteUserSpy = jest.spyOn(User, 'deleteUser');

		test('Exisiting userId, should call deleteUser, return 200', async () => {
			var res = httpMocks.createResponse();
			sqlAffectedRows(1);
			sqlAffectedRows(1);
			await userController.userDelete(req, res);
			expect(deleteUserSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(200);
		})
		test('Non-existing userId, should call deleteUser, return 400', async () => {
			var res = httpMocks.createResponse();
			sqlAffectedRows(0);
			sqlAffectedRows(0);
			await userController.userDelete(req, res);
			expect(deleteUserSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(400);
		})
		test('userId in user and profile does not match, should call deleteUser, return 400', async () => {
			var res = httpMocks.createResponse();
			sqlAffectedRows(1);
			sqlAffectedRows(0);
			await userController.userDelete(req, res);
			expect(deleteUserSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(400);
		})
		test('SQL internal err', async () => {
			var res = httpMocks.createResponse();
			sqlInternalErr();
			await userController.userDelete(req, res);
			expect(res.statusCode).toBe(400);
			expect(deleteUserSpy).toHaveBeenCalled();
		})
	})
	describe('Testing profileGet', () => {
		var req = httpMocks.createRequest({
			param: {
				userId: 1
			}
		})

		var getProfileSpy = jest.spyOn(User, 'getProfile');

		test('Existing userId, should call getProfile, return 200', async () => {
			var res = httpMocks.createResponse();
			sqlReturn(1);
			await userController.profileGet(req, res);
			expect(res.statusCode).toBe(200);
			expect(getProfileSpy).toHaveBeenCalled();
		})
		test('Non-existing userId, should call getProfile, return 400', async () => {
			var res = httpMocks.createResponse();
			sqlReturn(0);
			await userController.profileGet(req, res);
			expect(res.statusCode).toBe(400);
			expect(getProfileSpy).toHaveBeenCalled();
		})
		test('SQL internal err', async () => {
			var res = httpMocks.createResponse();
			sqlInternalErr();
			await userController.profileGet(req, res);
			expect(res.statusCode).toBe(400);
			expect(getProfileSpy).toHaveBeenCalled();
		})
	})
	describe('Tesing profileUpdate', () => {
		var req = httpMocks.createRequest({
			body: {
				userId: 1,
				userGender: 1
			}
		})

		var updateProfileSpy = jest.spyOn(User, 'updateProfile');

		test('Existing userId, should call updateProfile, return 200', async () => {
			var res = httpMocks.createResponse();
			sqlAffectedRows(1);
			await userController.profileUpdate(req, res);
			expect(res.statusCode).toBe(200);
			expect(updateProfileSpy).toHaveBeenCalled();
		})
		test('Non-existing userId, should call updateProfile, return 400', async () => {
			var res = httpMocks.createResponse();
			sqlAffectedRows(0);
			await userController.profileUpdate(req, res);
			expect(res.statusCode).toBe(400);
			expect(updateProfileSpy).toHaveBeenCalled();
		})
		test('SQL internal err', async () => {
			var res = httpMocks.createResponse();
			sqlInternalErr();
			await userController.profileUpdate(req, res);
			expect(res.statusCode).toBe(400);
			expect(updateProfileSpy).toHaveBeenCalled();
		})
	})


})

function sqlInternalErr(){
	db.query.mockImplementationOnce( () => {
		return Promise.reject();
	});
}

function sqlAffectedRows(rows){
	db.query.mockImplementationOnce( () => {
		return Promise.resolve({affectedRows: rows});
	});
}

function sqlReturn(numResult){
	db.query.mockImplementationOnce( () => {
		if (numResult == 0){
			return Promise.resolve([]);
		} else {
			return Promise.resolve([{result: "Some results"}]);
		}
	});
}

afterEach( () => {
	db.query.mockReset();
});
