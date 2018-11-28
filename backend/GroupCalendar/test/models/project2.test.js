const Project = require('../models/project');
const ProjectDB = require('../databases/ProjectDB');
const CalendarDB = require('../databases/CalendarDB');

/**
 * Mock List:
 *
 * ProjectDB.query
 * CalendarDB.query
 */

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

			ProjectDB.query = jest.fn();

			var res = httpMocks.createResponse();
			await AuthController.authGoogle(req, res);
			expect(res.statusCode).toBe(400);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})
})
describe('Testing verify', () => {

	test('Mock test, true', async () => {

		var idToken = 'abc123';

		mockVerify(true);
		await expect(Gverify.verify(idToken)).resolves.toBe('Verifed');

	})

	test('Failure test, false', async () => {

		var idToken = 'abc123';

		await expect(Gverify.verify(idToken)).rejects.not.toBeUndefined();

	})

})

function mockVerify(isVerified){
	if (isVerified){
		// console.log('mockVerify: true');
		Gverify.verify = jest.fn().mockImplementationOnce(() => {
			return Promise.resolve('Verifed');
		});
	} else {
		// console.log('mockVerify: false');
		Gverify.verify = jest.fn().mockImplementationOnce(() => {
			return Promise.reject();
		});
	}
}

function mockGetInfo(isPassed, isFound){
	if (isPassed){
		if (isFound){
			User.getInfo = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({
					userId: 1,
					isAdmin: 0,
					userEmail: 'jsmith@gmail.com',
					userPwd: '123456'
				});
			});
		} else {
			User.getInfo = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(null);
			});
		}
	} else {
		User.getInfo = jest.fn().mockImplementationOnce(() => {
			return Promise.reject();
		});
	}
}

function mockGetInfoNoPwd(){
	User.getInfo = jest.fn().mockImplementationOnce(() => {
		return Promise.resolve({
			userId: 1,
			isAdmin: 0,
			userEmail: 'jsmith@gmail.com',
			userPwd: null
		});
	});
}

function mockCreateUser(isPassed){
	if (isPassed){
		User.createUser = jest.fn().mockImplementationOnce(() => {
			return Promise.resolve([]);
		});

	} else {
		User.createUser = jest.fn().mockImplementationOnce(() => {
			return Promise.reject();
		});
	}
}

function mockUpdateProfile(isPassed){
	if (isPassed){
		User.updateProfile = jest.fn().mockImplementationOnce(() => {
			return Promise.resolve([]);
		});

	} else {
		User.updateProfile = jest.fn().mockImplementationOnce(() => {
			return Promise.reject();
		});
	}
}

function mockUpdateProfileAll(isPassed){
	if (isPassed){
		User.updateProfile = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		});

	} else {
		User.updateProfile = jest.fn().mockImplementation(() => {
			return Promise.reject();
		});
	}
}

function mockGetProfileById(isPassed){
	if (isPassed){
		User.getProfileById = jest.fn().mockImplementationOnce(() => {
			return Promise.resolve({
				userId: 1,
				userGender: 1,
				userBirth: null,
				userDescrption: null,
				userAvarar: null,
				userRegion: null,
				userLastname: 'Smith',
				userFirstname: 'Jackal',
				isAdmin: 0,
				userEmail: 'jsmith@gmail.com'
			});
		});
	} else {
		User.getProfileById = jest.fn().mockImplementationOnce(() => {
			return Promise.reject();
		});
	}
}

function mockLogin(isPassed, isValid){
	if (isPassed){
		if (isValid){
			User.login = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(1);
			});
		} else {
			User.login = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(-1);
			});
		}
	} else {
		User.login = jest.fn().mockImplementationOnce(() => {
			return Promise.reject();
		});
	}
}

afterEach( () => {
	User.getInfo = getInfo;
	User.createUser = createUser;
	User.updateProfile = updateProfile;
	User.getProfileById = getProfileById;
	User.login = login;

	Gverify.verify = verify;
})


