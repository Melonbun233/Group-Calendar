const User = require('../../models/user');

jest.mock('../../databases/UserDB');
var db = require('../../databases/UserDB');
db.query = jest.fn();

jest.mock('../../databases/ProjectDB');
var ProjectDB = require('../../databases/ProjectDB');
ProjectDB.query = jest.fn();

jest.mock('../../databases/CalendarDB');
var CalendarDB = require('../../databases/CalendarDB');
CalendarDB.query = jest.fn();

jest.mock('../../models/project');
var Project = require('../../models/project');
Project.isOwner = jest.fn();
Project.deleteProject = jest.fn();
Project.deleteMembers = jest.fn();

describe('Testing models/user', () => {
	const user = {
		userId: 1,
		userEmail: "123@gmail.com"
	};
	const profile = {
		userGender: 1
	};

	var querySpy = jest.spyOn(db, 'query');
	
	describe('Testing getInfo', () => {
		test('Existing userEmail, should call db.query once', async () => {
			userDbReturn(1);

			await User.getInfo("123@gmail.com");
			expect(db.query.mock.calls.length).toBe(1);
		})
		test('Non-existing userEmail, should call db.query once, throws err', async () => {
			userDbReturn(0);

			await User.getInfo("123@gmail.com")
			.catch( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
		test('SQL internal err', async () => {
			userDbErr();

			await User.getInfo("123@gmail.com")
			.catch( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
	})

	describe('Testing updateUser', () => {
		test('Valid userId, should call db.query', async () => {
			userDbAffectedRows(1);

			await User.updateUser(user);
			expect(querySpy).toHaveBeenCalled();
		});

		test('Invalid userId, should call db.query, throws error', async () => {
			userDbAffectedRows(0);

			const expectedError = "No such userId";

			await User.updateUser(user)
			.catch( error => {
				expect(error).toBe(expectedError);
			})
			expect(querySpy).toHaveBeenCalled();
		})

		test('MySQL error, should call db.query, throws error', async () => {
			userDbErr();

			await User.updateUser(user)
			.catch( error => {
				expect(querySpy).toHaveBeenCalled();
			})
		})
	})

	describe('Testing createUser', () => {
		test('valid user and profile, should call db.query twice', async () => {
			userDbAffectedRows(1);
			userDbAffectedRows(1);
			userDbReturn(1);

			await User.createUser(user, profile);
			expect(db.query.mock.calls.length).toBe(3);
		})
		test('MySQL internal error, throws error', async () => {
			userDbErr();

			await User.createUser(user, profile)
			.catch ( error => {
				expect(db.query.mock.calls.length).toBe(1);
				expect(error).toBe('userDbErr');
			})
		})
		test('Another MySQL internal error, throws error', async () => {
			userDbAffectedRows(1);
			userDbErr();

			await User.createUser(user, profile)
			.catch ( error => {
				expect(db.query.mock.calls.length).toBe(2);
				expect(error).toBe('userDbErr')
			})
		})
	})

	describe('Testing deleteUser', () => {
		test('Existing userEmail who owns projects', async () => {
			userDbReturn(1);
			userDbAffectedRows(1);
			userDbAffectedRows(1);
			// getProjectId
			projectDbReturn(1);
			projectDbReturn(1);
			mockIsOwner(1);
			mockDeleteProject(1);

			await User.deleteUser(1);
			expect(querySpy).toHaveBeenCalled();
			expect(Project.deleteProject.mock.calls.length).toBe(1);
		})
		test('Existing userEmail who is member of some projects', async () => {
			userDbReturn(1);
			userDbAffectedRows(1);
			userDbAffectedRows(1);
			// getProjectId
			projectDbReturn(1);
			projectDbReturn(1);
			mockIsOwner(1);
			mockDeleteMembers(1);

			await User.deleteUser(1);
			expect(querySpy).toHaveBeenCalled();
			expect(Project.deleteMembers.mock.calls.length).toBe(1);
		})
		test('Non-existing userEmail, should call db.query once', async () => {
			userDbReturn(0)

			await User.deleteUser("123@gmail.com")
			.catch( error => {
				expect(error).toBe("userEmail 123@gmail.com does not exist");
			})
		})		
		test('SQL internal error, throws error', async () => {
			userDbErr();

			await User.deleteUser(1)
			.catch( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
		test('another SQL internal error, throws error', async () => {
			userDbReturn(1);
			userDbErr();

			await User.deleteUser(1)
			.catch( error => {
				expect(db.query.mock.calls.length).toBe(2);
				expect(error).toBe('userDbErr');
			})
		})
		test('projectDbErr', async () => {
			userDbReturn(1);
			userDbAffectedRows(1);
			userDbAffectedRows(1);
			// getProjectId
			projectDbErr();

			await User.deleteUser(1)
			.catch( error => {
				expect(error).toBe('projectDbErr');
			})
		})
		test('isOwner throws err', async () => {
			userDbReturn(1);
			userDbAffectedRows(1);
			userDbAffectedRows(1);
			// getProjectId
			projectDbReturn(1);
			projectDbReturn(1);
			mockIsOwner(-1);

			await User.deleteUser(1)
			.catch( error => {
				expect(error).toBe('isOwner err');
			})
		})
	})

	describe('Testing getProfile', () => {
		test('Exisiting userId, should call db.query once', async () => {
			userDbReturn(1);

			await User.getProfile(1);
			expect(db.query.mock.calls.length).toBe(1);
		})
		test('Non-existing userId, should call db.query once, throws error', async () => {
			userDbReturn(0);

			const expectedError = "The userId does not exist.";

			await User.getProfile(1)
			.catch( error => {
				expect(error).toBe(expectedError);
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
		test('SQL internal error, throws error', async () => {
			userDbErr();

			await User.getProfile(1)
			.catch( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
	})

	describe('Testing modifyProfile', () => {
		test('Exisiting userId, should call db.query once', async () => {
			userDbAffectedRows(1);

			await User.modifyProfile(1, profile);
			expect(querySpy).toHaveBeenCalled();
		})
		test('Non-existing userId, throw err', async () => {
			userDbAffectedRows(0);

			await User.modifyProfile(1, profile)
			.catch(error => {
				expect(querySpy).toHaveBeenCalled();
			})
		})
		test('userDbErr', async () => {
			userDbErr();

			await User.modifyProfile(1, profile)
			.catch(error => {
				expect(error).toBe('userDbErr');
				expect(querySpy).toHaveBeenCalled();
			})
		})
	})

	describe('Testing getProjectId', () => {
		test('userId maps to projectId', async () => {
			projectDbReturn(1);
			projectDbReturn(1);

			await User.getProjectId(1)
			.then( (result) => {
				expect(result.length).toBe(2);
			})
		})
		test('userId has no mapping to projectId', async () => {
			projectDbReturn(0);
			projectDbReturn(0);

			await User.getProjectId(1)
			.then( (result) => {
				expect(result.length).toBe(0);
			})
		})
		test('projectDbErr', async () => {
			projectDbErr();
			await User.getProjectId(1)
			.catch( err => {
				expect(err).toBe('projectDbErr');
			})
		})
		test('projectDbErr', async () => {
			projectDbReturn(1)
			projectDbErr();
			await User.getProjectId(1)
			.catch( err => {
				expect(err).toBe('projectDbErr');
			})
		})
	})

	describe('Testing emailExist', () => {
		test('Existing userEmail', async () => {
			userDbReturn(1);
			await User.emailExist('123@gmail.com')
			.catch( error => {
				expect(error).toBe('userEmail 123@gmail.com has been taken.');
			})
		})
		test('Non-existing userEmail', async () => {
			userDbReturn(0);
			await User.emailExist('123@gmail.com')
			expect(querySpy).toHaveBeenCalled();
		})
		test('userDbErr', async () => {
			userDbErr();
			await User.emailExist('')
			.catch( error => {
				expect(error).toBe('userDbErr');
			})
		})
	})

	describe('Testing isAdmin', () => {
		test('isAdmin return false', async () => {
			userDbReturnIsAdmin(0);
			await User.isAdmin(1)
			.then( result => {
				expect(result).toBe(false);
			})
		})
		test('isAdmin return true', async () => {
			userDbReturnIsAdmin(1);
			await User.isAdmin(1)
			.then( result => {
				expect(result).toBe(true);
			})
		})
		test('userId does not exist', async () => {
			userDbReturn(0);
			await User.isAdmin(1)
			.catch(error => {
				expect(error).toBe("userId 1 does not exist");
			})
		})
		test('userDbErr', async () => {
			userDbErr();
			await User.isAdmin(1)
			.catch(error => {
				expect(error).toBe("userDbErr");
			})
		})
	})

});

function mockDeleteProject(success){
	Project.deleteProject.mockImplementationOnce( () => {
		if (!success){
			throw "deleteProject not success";
		}
	})
}

function mockDeleteMembers(success){
	Project.deleteMembers.mockImplementationOnce( () => {
		if (!success){
			throw "deleteMembers not success";
		}
	})
}

function mockIsOwner(userIsOwner){
	Project.isOwner.mockImplementationOnce( () => {
		if (userIsOwner != -1)
			return userIsOwner;
		else
			throw "isOwner err";
	})
}

function userDbErr(){
	db.query.mockImplementationOnce( () => {
		return Promise.reject("userDbErr");
	});
}

function userDbAffectedRows(rows){
	db.query.mockImplementationOnce( () => {
		return Promise.resolve({affectedRows: rows});
	});
}

function userDbReturn(numResult){
	db.query.mockImplementationOnce( () => {
		if (numResult == 0){
			return Promise.resolve([]);
		} else {
			return Promise.resolve([{result: "Some results"}]);
		}
	});
}

function userDbReturnIsAdmin(isAdmin){
	db.query.mockImplementationOnce( () => {
		if (isAdmin){
			return Promise.resolve([
				{"isAdmin": 1}
			])
		} else {
			return Promise.resolve([
				{"isAdmin": 0}
			])
		}
	})
}

function projectDbReturn(numResult){
	ProjectDB.query.mockImplementationOnce( () => {
		if (numResult == 0){
			return Promise.resolve([]);
		} else {
			return Promise.resolve([{result: "Some results"}]);
		}
	})
}

function projectDbErr(){
	ProjectDB.query.mockImplementationOnce( () => {
		return Promise.reject("projectDbErr");
	});
}

afterEach( () => {
	db.query.mockReset();
	ProjectDB.query.mockReset();
	Project.deleteMembers.mockReset();
	Project.deleteProject.mockReset();
	Project.isOwner.mockReset();
});
