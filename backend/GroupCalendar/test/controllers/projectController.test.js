var httpMocks = require('node-mocks-http');
const projectController = require('../../controllers/projectController');

jest.mock('../../models/user');
jest.mock('../../models/project');
var User = require('../../models/user');
var Project = require('../../models/project');

describe('Testing projectController', () => {
	var req = httpMocks.createRequest({
		body: {
			projectId: 1,
			userId: 1
		},
		param:{
			projectId: 1,
			userId: 1
		}
	});

	describe('Testing putEventOwner', () => {
		test('userId is not owner', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(0);
			await projectController.putEventOwner(req, res);
			expect(res.statusCode).toBe(400);
			expect(JSON.parse(res._getData())).toEqual({"error":"user is not owner"});
		})
		test('isOwner error', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(-1);
			await projectController.putEventOwner(req, res);
			expect(res.statusCode).toBe(400);
			expect(JSON.parse(res._getData())).toEqual({"error": "isOwner error"});
		})
		test('userId is owner, putEventOwner success', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(1);
			mockPutEventOwner(1);
			await projectController.putEventOwner(req, res);
			expect(res.statusCode).toBe(200);
		})
		test('putEventOwner fail', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(1);
			mockPutEventOwner(0);
			await projectController.putEventOwner(req, res);
			expect(res.statusCode).toBe(403);			
		})
	})

	describe('Testing createEvents', () => {
		test('userId is not owner', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(0);
			await projectController.createEvents(req, res);
			expect(res.statusCode).toBe(400);
			expect(JSON.parse(res._getData())).toEqual({"error":"user is not owner"});
		})
		test('isOwner error', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(-1);
			await projectController.createEvents(req, res);
			expect(res.statusCode).toBe(400);
			expect(JSON.parse(res._getData())).toEqual({"error": "isOwner error"});
		})
		test('userId is owner, createEvents success', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(1);
			mockCreateEvents(1);
			await projectController.createEvents(req, res);
			expect(res.statusCode).toBe(200);
			expect(JSON.parse(res._getData())).toEqual({eventId: 1});
		})
		test('createEvents fail', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(1);
			mockCreateEvents(0);
			await projectController.createEvents(req, res);
			expect(res.statusCode).toBe(403);
		})
	})
	describe('Testing deleteEvents', async () => {
		test('userId is not owner', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(0);
			await projectController.deleteEvents(req, res);
			expect(res.statusCode).toBe(400);
			expect(JSON.parse(res._getData())).toEqual({"error":"user is not owner"});
		})
		test('isOwner error', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(-1);
			await projectController.deleteEvents(req, res);
			expect(res.statusCode).toBe(400);
			expect(JSON.parse(res._getData())).toEqual({"error": "isOwner error"});
		})
		test('userId is owner, putEventOwner success', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(1);
			mockDeleteEvents(1);
			await projectController.deleteEvents(req, res);
			expect(res.statusCode).toBe(200);
		})
		test('putEventOwner fail', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(1);
			mockDeleteEvents(0);
			await projectController.deleteEvents(req, res);
			expect(res.statusCode).toBe(400);			
			expect(JSON.parse(res._getData())).toEqual({"error": "deleteEvents fail"});
		})
	})
	describe('Testing getProject', () => {
		test('getProject success', async () => {
			var res = httpMocks.createResponse();
			mockGetProject(1);
			mockGetEvents(2);
			mockGetMemberId(3);

			var expected = {
				project: {
					projectId: 1,
					events:{
						eventId : 2
					},
					memberId: [3]
				}
			}

			await projectController.getProject(req, res);
			expect(res.statusCode).toBe(200);
			expect(JSON.parse(res._getData())).toEqual(expected);
		})
		test('getProject fail', async () => {
			var res = httpMocks.createResponse();
			mockGetProject(0);

			await projectController.getProject(req, res);
			expect(res.statusCode).toBe(403);
		})
	})

	describe('Testing putProject', async () => {
		test('userId is not owner', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(0);
			await projectController.putProject(req, res);
			expect(res.statusCode).toBe(400);
			expect(JSON.parse(res._getData())).toEqual({"error":"user is not owner"});
		})
		test('isOwner error', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(-1);
			await projectController.putProject(req, res);
			expect(res.statusCode).toBe(400);
			expect(JSON.parse(res._getData())).toEqual({"error": "isOwner error"});
		})
		test('userId is owner, putProject success', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(1);
			mockPutProject(1);
			await projectController.putProject(req, res);
			expect(res.statusCode).toBe(200);
		})
		test('putProject fail', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(1);
			mockPutProject(0);
			await projectController.putProject(req, res);
			expect(res.statusCode).toBe(403);			
		})
	})

	describe('Testing createProject', () => {
		test('createProject success', async () => {
			var res = httpMocks.createResponse();
			mockCreateProject(1);
			await projectController.createProject(req, res);
			expect(res.statusCode).toBe(200);
			expect(JSON.parse(res._getData())).toEqual({projectId: 1});
		})
		test('createProject fail', async () => {
			var res = httpMocks.createResponse();
			mockCreateProject(0);
			await projectController.createProject(req, res);
			expect(res.statusCode).toBe(403);
		})
	})

	describe('Testing deleteProject', () => {
		test('userId is not owner', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(0);
			await projectController.deleteProject(req, res);
			expect(res.statusCode).toBe(400);
			expect(JSON.parse(res._getData())).toEqual({"error":"user is not owner"});
		})
		test('isOwner error', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(-1);
			await projectController.deleteProject(req, res);
			expect(res.statusCode).toBe(400);
			expect(JSON.parse(res._getData())).toEqual({"error": "isOwner error"});
		})
		test('userId is owner, deleteProject success', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(1);
			mockDeleteProject(1);
			await projectController.deleteProject(req, res);
			expect(res.statusCode).toBe(200);
		})
		test('putProject fail', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(1);
			mockDeleteProject(0);
			await projectController.deleteProject(req, res);
			expect(res.statusCode).toBe(400);			
			expect(JSON.parse(res._getData())).toEqual({"error": "deleteProject fail"});
		})
	})

	describe('Testing deleteMembers', () => {
		test('userId is not in project', async () => {
			var res = httpMocks.createResponse();
			mockIsUserInProject(0);
			await projectController.deleteMembers(req, res);
			expect(res.statusCode).toBe(400);
		})
		test('isUserInProject error', async () => {
			var res = httpMocks.createResponse();
			mockIsUserInProject(-1);
			await projectController.deleteMembers(req, res);
			expect(res.statusCode).toBe(400);
		})
		test('userId is owner, deleteMembers success', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(1);
			mockDeleteMembers(1);
			await projectController.deleteMembers(req, res);
			expect(res.statusCode).toBe(200);
		})
		test('deleteMembers fail', async () => {
			var res = httpMocks.createResponse();
			mockIsOwner(1);
			mockDeleteMembers(0);
			await projectController.deleteMembers(req, res);
			expect(res.statusCode).toBe(400);			
			expect(JSON.parse(res._getData())).toEqual({"error": "deleteMembers fail"});
		})
	})

})

//-------mock functions-----------------
function mockIsOwner(isOwner){
	Project.isOwner = jest.fn().mockImplementationOnce(() => {
		if (isOwner != -1){
			return Promise.resolve(isOwner);
		} else {
			return Promise.reject('isOwner error');
		}
	})
}

function mockIsUserInProject(userInProject){
	Project.isUserInProject = jest.fn().mockImplementationOnce(() => {
		if (userInProject != -1){
			return Promise.resolve(userInProject);
		} else {
			return Promise.reject('isUserInProject error');
		}
	})
}

function mockPutEventOwner(success){
	Project.putEventOwner = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve();
		} else {
			return Promise.reject("putEventOwner fail");
		}
	})
}

function mockCreateEvents(eventId){
	Project.createEvents = jest.fn().mockImplementationOnce(() => {
		if (eventId){
			return Promise.resolve(eventId);
		} else {
			return Promise.reject('createEvents error');
		}
	})
}

function mockDeleteEvents(success){
	Project.deleteEvents = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve();
		} else {
			return Promise.reject("deleteEvents fail");
		}
	})
}

function mockGetProject(projectId){
	Project.getProject = jest.fn().mockImplementationOnce(() => {
		if (projectId){
			return Promise.resolve({projectId});
		} else {
			return Promise.reject('getProject error');
		}
	})
}

function mockGetEvents(eventId){
	Project.getEvents = jest.fn().mockImplementationOnce(() => {
		if (eventId){
			return Promise.resolve({eventId});
		} else {
			return Promise.reject('getEvents error');
		}
	})
}

function mockGetMemberId(projectId){
	Project.getMemberId = jest.fn().mockImplementationOnce(() => {
		if (projectId){
			return Promise.resolve([projectId]);
		} else {
			return Promise.reject('getMemberId error');
		}
	})
}

function mockPutProject(success){
	Project.putProject = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve();
		} else {
			return Promise.reject("putProject fail");
		}
	})
}

function mockCreateProject(success){
	Project.createProject = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve(success);
		} else {
			return Promise.reject("createProject fail");
		}
	})
}

function mockDeleteProject(success){
	Project.deleteProject = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve();
		} else {
			return Promise.reject("deleteProject fail");
		}
	})
}

function mockDeleteMembers(success){
	Project.deleteMembers = jest.fn().mockImplementationOnce(() => {
		if (success){
			return Promise.resolve();
		} else {
			return Promise.reject("deleteMembers fail");
		}
	})
}

afterEach(() => {
	jest.resetAllMocks();
})