var httpMocks = require('node-mocks-http');
const authController = require('../../controllers/authController');
const User = require('../../models/user');

// /*------------mocking db.query---------------*/
// jest.mock('../../databases/UserDB');
// const db = require('../../databases/UserDB');
// db.query = jest.fn();

/*-----------mocking verify---------*/
// const verifyMock = jest.spyOn(authController, 'verify');
// verifyMock = jest.fn();
authController.verify = jest.fn();
/*------------mocking user---------------*/
jest.mock('../../models/user');

describe('Testing authGoogle', () => {

	var getInfoSpy = jest.spyOn(authController, 'authGoogle');

	describe('Testing by valid req', () => {

		var req = httpMocks.createRequest({
			session: {
				uuid: null
			}
			body: {
				idToken: 'abc123',
				accessToken: '123abc',
				user: 
				{ photo: 'https://example.com/photo.jpg',
				familyName: 'Smith',
				name: 'Jackal Smith',
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
				await authController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(200);

			})

			test('Verifed, userInfo found, return 200', async () => {

				mockVerify(true);
				mockGetInfo(true, true);
				mockUpdateProfile(true);
				mockUpdateProfile(true);
				mockGetProfileById(true);
				
				var res = httpMocks.createResponse();
				await authController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(200);

			})
		})

		describe('Testing with err', () => {

			test('Unverifed, return 400', async () => {

				mockVerify(false);

				var res = httpMocks.createResponse();
				await authController.authGoogle(req, res);
				expect(res.statusCode).toBe(400);
				expect(getInfoSpy).toHaveBeenCalled();

			})

			test('Verified, no userInfo found, first getInfo err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(false, false);
				// mockCreateUser(true);
				// mockGetInfo(true, true);
				// mockGetProfileById(true);

				var res = httpMocks.createResponse();
				await authController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})

			test('Verified, no userInfo found, createUser err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, false);
				mockCreateUser(false);
				// mockGetInfo(true, true);
				// mockGetProfileById(true);

				var res = httpMocks.createResponse();
				await authController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})

			test('Verified, no userInfo found, second getInfo err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, false);
				mockCreateUser(true);
				mockGetInfo(false, false);
				// mockGetProfileById(true);

				var res = httpMocks.createResponse();
				await authController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})

			test('Verified, no userInfo found twice, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, false);
				mockCreateUser(true);
				mockGetInfo(true, false);
				// mockGetProfileById(true);

				var res = httpMocks.createResponse();
				await authController.authGoogle(req, res);
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
				await authController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})


			test('Verifed, userInfo found, updateProfile err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, true);
				mockUpdateProfile(false);
				// mockUpdateProfile(true);
				// mockGetProfileById(true);

				var res = httpMocks.createResponse();
				await authController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})

			test('Verifed, userInfo found, second updateProfile err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, true);
				mockUpdateProfile(true);
				mockUpdateProfile(false);
				// mockGetProfileById(true);

				var res = httpMocks.createResponse();
				await authController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})

			test('Verifed, userInfo found, getProfileById err, return 500', async () => {

				mockVerify(true);
				mockGetInfo(true, true);
				mockUpdateProfile(false);
				mockUpdateProfile(true);
				mockGetProfileById(false);

				var res = httpMocks.createResponse();
				await authController.authGoogle(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})
		})


	})
	// test
	describe('Testing by invalid req', () => {

		var req = httpMocks.createRequest({
			session: {
				uuid: null
			}
			body: {
				idToken: 'undefined',
				accessToken: '123abc',
				user: 
				{ photo: 'https://example.com/photo.jpg',
				familyName: 'Smith',
				name: 'Jackal Smith',
				email: 'jsmith@gmail.com',
				id: '12345',
				givenName: 'Jackal' },
				accessTokenExpirationDate: 3599.8298959732056,
				serverAuthCode: null,
				scopes: [] 
			}
		});

		test('Unverifed; return 400', async () => {

			verifyMock.mockRestore();

			var res = httpMocks.createResponse();
			await authController.authGoogle(req, res);
			expect(res.statusCode).toBe(400);
			expect(getInfoSpy).toHaveBeenCalled();

		})

	})

	describe('Testing by valid req without familyName', () => {

		var req = httpMocks.createRequest({
			session: {
				uuid: null
			}
			body: {
				idToken: 'abc123',
				accessToken: '123abc',
				user: 
				{ photo: 'https://example.com/photo.jpg',
				familyName: null,
				name: 'Jackal Smith',
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
			await authController.authGoogle(req, res);
			expect(getInfoSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(200);

		})

		test('Verifed, userInfo found, getProfileById err, return 500', async () => {

			mockVerify(true);
			mockGetInfo(true, true);
			mockUpdateProfile(true);
			mockGetProfileById(false);

			var res = httpMocks.createResponse();
			await authController.authGoogle(req, res);
			expect(getInfoSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(500);

		})
	})
})

/* ---------- authApp ----------- */
describe('Testing authApp', () => {

	var getInfoSpy = jest.spyOn(authController, 'authApp');

	describe('Testing by valid req', () => {

		var req = httpMocks.createRequest({
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
				await authController.authApp(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(200);

			})

			test('Failure, return 400', async () => {

				mockLogin(true, false);

				var res = httpMocks.createResponse();
				await authController.authApp(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(400);

			})
		})

		describe('Testing with err', () => {

			test('login err, return 500', async () => {

				mockLogin(false, false);
				// mockGetProfileById(true);

				var res = httpMocks.createResponse();
				await authController.authApp(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

			})

			test('getProfileById err, return 500', async () => {

				mockLogin(true, true);
				mockGetProfileById(false);

				var res = httpMocks.createResponse();
				await authController.authApp(req, res);
				expect(getInfoSpy).toHaveBeenCalled();
				expect(res.statusCode).toBe(500);

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
			await authController.authApp(req, res);
			expect(getInfoSpy).toHaveBeenCalled();
			expect(res.statusCode).toBe(400);

		})
	})
})

describe('Testing verify', () => {

	var getInfoSpy = jest.spyOn(authController, 'verify');


	var req = httpMocks.createRequest({
		body: {
			session: {
				uuid: null
			}
			idToken: 'abc123',
			accessToken: '123abc',
			user: 
			{ photo: 'https://example.com/photo.jpg',
			familyName: 'Smith',
			name: 'Jackal Smith',
			email: 'jsmith@gmail.com',
			id: '12345',
			givenName: 'Jackal' },
			accessTokenExpirationDate: 3599.8298959732056,
			serverAuthCode: null,
			scopes: [] 
		}
	});

	test('failure test only, return 400', async () => {

		mockVerify.mockRestore();

		var res = httpMocks.createResponse();
		await authController.authApp(req, res);
		expect(getInfoSpy).toHaveBeenCalled();
		expect(res.statusCode).toBe(400);

	})

	
})

function mockVerify(isVerified){
	if (isVerified === true){
		authController.verify.mockImplementationOnce(() => {
			return Promise.resolve({result: 'verified'});
		});
	} else {
		authController.verify.mockImplementationOnce(() => {
			return Promise.reject();
		});
	}
}

function mockGetInfo(isPassed, isFound){
	if (isPassed === true){
		if (isFound === true){
			User.getInfo.mockImplementationOnce(() => {
				return Promise.resolve({
					userId: 1,
					isAdmin: 0,
					userEmail: 'jsmith@gmail.com',
					userPwd: '123456'
				});
			});
		} else {
			User.getInfo.mockImplementationOnce(() => {
				return Promise.resolve(null);
			});
		}
	} else {
		User.getInfo.mockImplementationOnce(() => {
			return Promise.reject();
		});
	}
}

function mockCreateUser(isPassed){
	if (isPassed === true){
		User.createUser.mockImplementationOnce(() => {
			return Promise.resolve();
		});
		
	} else {
		User.createUser.mockImplementationOnce(() => {
			return Promise.reject();
		});
	}
}

function mockUpdateProfile(isPassed){
	if (isPassed === true){
		User.updateProfile.mockImplementationOnce(() => {
			return Promise.resolve();
		});
		
	} else {
		User.updateProfile.mockImplementationOnce(() => {
			return Promise.reject();
		});
	}
}

function mockGetProfileById(isPassed){
	if (isPassed === true){
		User.getProfileById.mockImplementationOnce(() => {
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
		User.getProfileById.mockImplementationOnce(() => {
			return Promise.reject();
		});
	}
}

function mockLogin(isPassed, isValid){
	if (isPassed === true){
		if (isValid === true){
			User.login.mockImplementationOnce(() => {
				return Promise.resolve(1);
			});
		} else {
			User.login.mockImplementationOnce(() => {
				return Promise.resolve(-1);
			});
		}
	} else {
		User.login.mockImplementationOnce(() => {
			return Promise.reject();
		});
	}
}
