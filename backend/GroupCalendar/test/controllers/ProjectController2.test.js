var httpMocks = require('node-mocks-http');
const ProjectController = require('../../controllers/ProjectController');
// const User = require('../../models/user');
const Project = require('../models/project');

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
 */

// const isMemberInProject = Project.isMemberInProject;
// const addUserInEvents = Project.addUserInEvents;
// const deleteUserInEvents = Project.deleteUserInEvents;
// const deleteUserInEventsAll = Project.deleteUserInEventsAll;
// const isOwner2 = Project.isOwner2;
// const isUserInProject2 = Project.isUserInProject2;
// const addUserInInviteList = Project.addUserInInviteList;
// const deleteUserInInviteList = Project.deleteUserInInviteList;
// const isUserInInviteList = Project.isUserInInviteList;


/**
 * Test List:
 * 
 * addEventMember
 * deleteEventMember
 * deleteEventMemberAll
 * inviteUser
 * deleteInvitedUser
 */

describe('Testing addEventMember', () => {

	var getInfoSpy = jest.spyOn(ProjectController, 'addEventMember');

	describe('Testing by invalid req', () => {

		var req = httpMocks.createRequest({
			session: {
				uuid: null
			},
			body: {
				idToken: 'undefined',
				accessToken: '123abc',
				user: 
				{ photo: 'https://example.com/photo.jpg',
				familyName: 'Smith',
				name: 'Jackal Smith',
				pwd: '123456',
				email: 'jsmith@gmail.com',
				id: '12345',
				givenName: 'Jackal' },
				accessTokenExpirationDate: 3599.8298959732056,
				serverAuthCode: null,
				scopes: [] 
			}
		});

		test('Unverifed; return 400', async () => {

			mockVerify(false);

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

function mockisMemberInProject(isVerified){
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

function mockaddUserInEvents(isPassed, isFound){
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


