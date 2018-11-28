const User = require('../../models/user');
const UserDB = require('../../databases/UserDB');

jest.mock('../../databases/UserDB');
jest.mock('../../databases/ProjectDB');
jest.mock('../../databases/CalendarDB');

/**
 * Mock List:
 *
 * UserDB.query
 */
 const query = UserDB.query;

/**
 * Test List:
 *
 * getInfo
 * updateUser
 * updateProfile
 * login
 */
//

describe('Testing getInfo', () => {
	var email = "test@mail.com";

	var getInfoSpy = jest.spyOn(User, 'getInfo');

	describe('Testing without err', () => {

		test('length = 0, null', async () => {

			UserDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([]);
			})

			var result = await User.getInfo(email);
			expect(result).toBeNull();
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('sth', async () => {

			UserDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userId: 2}]);
			});

			var result = await User.getInfo(email);
			expect(result).not.toBeNull();
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {

		test('err', async () => {
			UserDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await User.getInfo(email)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})
})

describe('Testing updateUser', () => {
	var userId = "1";
	var userPwd = "123456"

	var getInfoSpy = jest.spyOn(User, 'updateUser');

	describe('Testing without err', () => {

		test('done', async () => {

			UserDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve({affectedRows: 1});
			})

			var result = await User.updateUser(userId, userPwd);
			expect(result).toBeNull();
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {

		test('err', async () => {
			UserDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await User.updateUser(userId, userPwd)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})
})

describe('Testing updateProfile', () => {
	var userId = "1";
	var setCmd = "userName = test";

	var getInfoSpy = jest.spyOn(User, 'updateProfile');

	describe('Testing without err', () => {

		test('done', async () => {

			UserDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve({affectedRows: 1});
			})

			var result = await User.updateProfile(setCmd, userId);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {

		test('err', async () => {
			UserDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await User.updateProfile(setCmd, userId)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})
})


describe('Testing login', () => {
	var email = "test@mail.com";
	var pwd = "123456";

	var getInfoSpy = jest.spyOn(User, 'login');

	describe('Testing without err', () => {

		test('no such user', async () => {

			UserDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([]);
			})

			var result = await User.login(email, pwd);
			expect(result).toBe(0);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('pwd correct', async () => {

			UserDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userPwd: "123456", userId: 5}]);
			})

			var result = await User.login(email, pwd);
			expect(result).toBe(5);
			expect(getInfoSpy).toHaveBeenCalled();

		})

		test('pwd incorrect', async () => {

			UserDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve([{userPwd: "1234567", userId: 5}]);
			})

			var result = await User.login(email, pwd);
			expect(result).toBe(-1);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Failure Test', () => {

		test('err', async () => {
			UserDB.query = jest.fn()
			.mockImplementationOnce(() => {
				return Promise.reject('err');
			});

			await User.login(email, pwd)
			.catch(err => {
				expect(err).toBeDefined();
			})
			expect(getInfoSpy).toHaveBeenCalled();

		})
	})
})


