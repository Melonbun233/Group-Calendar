const User = require('../../models/user');

jest.mock('../../databases/UserDB');
const db = require('../../databases/UserDB');
db.query = jest.fn();

describe('Testing models/user', () => {
	const user = {
		userId: 1,
		userEmail: "123@gmail.com"
	};
	const profile = {
		userId: 1,
		userEmail: "123@gmail.com"
	};

	var querySpy = jest.spyOn(db, 'query');
	
	describe('Testing getInfo', () => {
		test('Existing userEmail, should call db.query once', async () => {
			sqlReturn(1);

			await User.getInfo("123@gmail.com");
			expect(db.query.mock.calls.length).toBe(1);
		})
		test('Non-existing userEmail, should call db.query once, throws err', async () => {
			sqlReturn(0);
			const expectedError = "User name does not refer to any entry.";

			await User.getInfo("123@gmail.com")
			.catch( error => {
				expect(error).toBe(expectedError);
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
		test('SQL internal err', async () => {
			sqlInternalErr();

			await User.getInfo("123@gmail.com")
			.catch( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
	})

	describe('Testing updateUser', () => {
		test('Valid userId, should call db.query', async () => {
			sqlAffectedRows(1);

			await User.updateUser(user);
			expect(querySpy).toHaveBeenCalled();
		});

		test('Invalid userId, should call db.query, throws error', async () => {
			sqlAffectedRows(0);

			const expectedError = "No such userId";

			await User.updateUser(user)
			.catch( error => {
				expect(error).toBe(expectedError);
			})
			expect(querySpy).toHaveBeenCalled();
		})

		test('Empty user object, should not call db.query, throws error', async () => {
			const expectedError = "Empty user object";

			await User.updateUser(null)
			.catch( error => {
				expect(error).toBe(expectedError);
			})
		})

		test('MySQL error, should call db.query, throws error', async () => {
			sqlInternalErr();

			await User.updateUser(user)
			.catch( error => {
				expect(querySpy).toHaveBeenCalled();
			})
		})
	})

	describe('Testing createUser', () => {
		test('valid user and profile, should call db.query twice', async () => {
			sqlAffectedRows(2);

			await User.createUser(user, profile);
			expect(db.query.mock.calls.length).toBe(2);
		})
		test('MySQL internal error, throws error', async () => {
			sqlInternalErr();

			await User.createUser(user, profile)
			.catch ( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
	})

	describe('Testing deleteUser', () => {
		test('Existing userId, should call db.query twice', async () => {
			sqlAffectedRows(1);
			sqlAffectedRows(1);

			await User.deleteUser(1);
			expect(db.query.mock.calls.length).toBe(2);
		})
		test('Non-existing userId, should call db.query once', async () => {
			sqlAffectedRows(0);

			const expectedError = "The user has been deleted.";

			await User.deleteUser(1)
			.catch( error => {
				expect(error).toBe(expectedError);
			})
			expect(db.query.mock.calls.length).toBe(1);
		})
		test('userId in user and profile does not match, should call db.query twice, throws error', async () => {
			sqlAffectedRows(1);
			sqlAffectedRows(0);

			const expectedError = "The user's profile has been deleted."

			await User.deleteUser(1)
			.catch( error => {
				expect(error).toBe(expectedError);
			})
			expect(db.query.mock.calls.length).toBe(2);
		})
		test('SQL internal error, throws error', async () => {
			sqlInternalErr();

			await User.deleteUser(1)
			.catch( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
	})

	describe('Testing getProfile', () => {
		test('Exisiting userId, should call db.query once', async () => {
			sqlReturn(1);

			await User.getProfile(1);
			expect(db.query.mock.calls.length).toBe(1);
		})
		test('Non-existing userId, should call db.query once, throws error', async () => {
			sqlReturn(0);

			const expectedError = "The userId does not exist.";

			await User.getProfile(1)
			.catch( error => {
				expect(error).toBe(expectedError);
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
		test('SQL internal error, throws error', async () => {
			sqlInternalErr();

			await User.getProfile(1)
			.catch( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
	})


});

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
