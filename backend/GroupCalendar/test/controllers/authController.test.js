var httpMocks = require('node-mocks-http');
const AuthController = require('../../controllers/authController');
const User = require('../../models/user');
const Gverify = require('../../controllers/googleVerification')

/*------------mocking db.query---------------*/
// jest.mock('../../databases/UserDB');
// const db = require('../../databases/UserDB');
// db.query = jest.fn();

/*-----------mocking verify---------*/
// jest.mock('../../controllers/googleVerification');
const verify = Gverify.verify;
/*------------mocking user---------------*/
// jest.mock('../../models/user');
const getInfo = User.getInfo;
const createUser = User.createUser;
const updateProfile = User.updateProfile;
const getProfileById = User.getProfileById;
const login = User.login;

describe('Testing authGoogle', () => {

	var getInfoSpy = jest.spyOn(AuthController, 'authGoogle');

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
	describe('Testing by valid req without familyName', () => {

		var req = httpMocks.createRequest({
			session: {
				uuid: null
			},
			body: {
				idToken: 'abc123',
				accessToken: '123abc',
				user: 
				{ photo: 'https://example.com/photo.jpg',
				familyName: 'undefined',
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

		test('Verifed, userInfo found, return 200', async () => {

			mockVerify(true);
			mockGetInfo(true, true);
			mockUpdateProfile(true);
			mockGetProfileById(true);

			var res = httpMocks.createResponse();
			await AuthController.authGoogle(req, res);
			expect(getInfoSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(200);

		})

		test('Verifed, userInfo found, getProfileById err, return 500', async () => {

			mockVerify(true);
			mockGetInfo(true, true);
			mockUpdateProfile(true);
			mockGetProfileById(false);

			var res = httpMocks.createResponse();
			await AuthController.authGoogle(req, res);
			expect(getInfoSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(500);

		})
	})

	describe('Testing by valid req', () => {

		var req = httpMocks.createRequest({
			session: {
				uuid: null
			},
			body: {
				idToken: 'abc123',
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

		describe('Testing without err', () => {

			test('Verified, no userInfo found, return 200', async () => {

				mockVerify(true);
				mockGetInfo(true, false);
				mockCreateUser(true);
				mockGetInfo(true, true);
				mockGetProfileById(true);

				var res = httpMocks.createResponse();
				await AuthController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(200);

			})

			test('Verifed, userInfo found, return 200', async () => {

				mockVerify(true);
				mockGetInfo(true, true);
				mockUpdateProfileAll(true);
				mockGetProfileById(true);

				var res = httpMocks.createResponse();
				await AuthController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(200);

			})

			test('Verifed, userInfo found, no pwd, return 200', async () => {

				mockVerify(true);
				mockGetInfoNoPwd();
				mockUpdateProfileAll(true);
				mockGetProfileById(true);

				var res = httpMocks.createResponse();
				await AuthController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(200);

			})

		})

		describe('Testing with err', () => {
			var req = httpMocks.createRequest({
				session: {
					uuid: null
				},
				body: {
					idToken: 'abc123',
					accessToken: '123abc',
					user: 
					{ photo: 'https://example.com/photo.jpg',
					familyName: 'undefined',
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

			test('Unverifed, return 400', async () => {

				mockVerify(false);

				var res = httpMocks.createResponse();
				await AuthController.authGoogle(req, res);
				expect(res.statusCode).toBe(400);
				expect(getInfoSpy).toHaveBeenCalled();

			})

			test('Verified, no userInfo found, first getInfo err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(false, false);


				var res = httpMocks.createResponse();
				await AuthController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})

			test('Verified, no userInfo found, createUser err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, false);
				mockCreateUser(false);


				var res = httpMocks.createResponse();
				await AuthController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})

			test('Verified, no userInfo found, second getInfo err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, false);
				mockCreateUser(true);
				mockGetInfo(false, false);


				var res = httpMocks.createResponse();
				await AuthController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})

			test('Verified, no userInfo found twice, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, false);
				mockCreateUser(true);
				mockGetInfo(false, false);

				var res = httpMocks.createResponse();
				await AuthController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})

			test('Verified, no userInfo found, getProfileById err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, false);
				mockCreateUser(true);
				mockGetInfo(true, true);
				mockGetProfileById(false);

				var res = httpMocks.createResponse();
				await AuthController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})


			test('Verifed, userInfo found, updateProfile err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, true);
				mockUpdateProfile(false);


				var res = httpMocks.createResponse();
				await AuthController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})

			test('Verifed, userInfo found, second updateProfile err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, true);
				mockUpdateProfile(true);
				mockUpdateProfile(false);


				var res = httpMocks.createResponse();
				await AuthController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})

			test('Verifed, userInfo found, getProfileById err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, true);
				mockUpdateProfile(true);
				mockGetProfileById(false);

				var res = httpMocks.createResponse();
				await AuthController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})
		})
	})

})



/* ---------- authApp ----------- */
describe('Testing authApp', () => {

	var getInfoSpy = jest.spyOn(AuthController, 'authApp');

	describe('Testing by valid req', () => {

		var req = httpMocks.createRequest({
			session: {
				uuid: null
			},
			body: {
				userEmail: 'jsmith@gmail.com',
				userPwd: '123456'
			}
		});

		describe('Testing without err', () => {

			test('Success, return 200', async () => {

				mockLogin(true, true);
				mockGetProfileById(true);

				var res = httpMocks.createResponse();
				await AuthController.authApp(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(200);

				// User.getProfileById = getProfileById;
				// User.login = login;

			})

			test('Failure, return 400', async () => {

				mockLogin(true, false);

				var res = httpMocks.createResponse();
				await AuthController.authApp(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(400);

				// User.login = login;

			})
		})

		describe('Testing with err', () => {

			test('login err, return 500', async () => {

				mockLogin(false, false);
				// mockGetProfileById(true);

				var res = httpMocks.createResponse();
				await AuthController.authApp(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

				// User.login = login;

			})

			test('getProfileById err, return 500', async () => {

				mockLogin(true, true);
				mockGetProfileById(false);

				var res = httpMocks.createResponse();
				await AuthController.authApp(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

				// User.getProfileById = getProfileById;
				// User.login = login;

			})

		})

	})
	
	describe('Testing by invalid req', () => {
		var req = httpMocks.createRequest({
			body: {
				userEmail: 'jsmith@gmail.com',
				userPwd: 'undefined'
			}
		});

		test('invalid res, return 400', async () => {

			var res = httpMocks.createResponse();
			await AuthController.authApp(req, res);
			expect(getInfoSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(400);

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


