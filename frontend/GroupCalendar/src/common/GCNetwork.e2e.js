'use strict';
//This file contains all HTTP requests for Group Calendar project
import React, {Component} from 'react';
import {Alert} from 'react-native';
import * as config from '../../config.json';
import Storage from './Storage';

export default class GCNetwork extends Component {

	//	Function used to fetch user information
	//	Arguments: 
	//		user: an user object that contains user_email and user_pwd
	//	Returns status:
	//		200: correct user info
	//		400: incorrect password
	//		404: cannot find 
	//	Note that user name should be validated 
	//
	static async verifyUser(_userEmail, _userPwd) {
		try {
            if (_userEmail === 'test@mail.com') {
                await Storage.setProfile(testProfile1);
                return 200;
            } else {
                return 400;
            }
		} catch (error) {
			throw Error('unable to verify user');
		}
	}

    static async updatePwd(_userId, _userPwd) {
		try {
			return 200;
		} catch (error) {
			throw Error('unable to update password');
		}
    }
    
    static async updateProject(projectId, userId, update) {
		try {
			return 200;
		} catch (error) {
			throw Error('unable to update project');
		}
	}
	//search a specific user id
	//this function is similar to fetchProfile, but this one returns the profile
	static async searchProfile(userId) {
		try {
            if (userId == 1) {
                return {
                    profile: testProfile1,
                    status: 200
                }
            } else if (userId == 2) {
                return {
                    profile: testProfile2,
                    status: 200
                }
            } else if (userId == 3) {
                return {
                    profile: testProfile3,
                    status:200
                }
            }
		} catch (error) {
			throw Error('unable to fetch profile');
		}
	}
	//	Function used to fetch user profile
	//	Arguments
	//		user_id: corresponding user id, this can be fetched from user
	//	Returns status: 
	//		200: correct user id
	//		400: invalid user id
	//		404: cannot find user id
	static async fetchProfile(_userId){
		try {
			return 200;
		} catch (error) {
			throw Error('unable to fetch profile');
		}
    }

	static async fetchProjectList(userId) {
		try {
			await Storage.setProjectList({projectId:[1, 2, 3]});
			return 200;
		} catch (error) {
			throw Error('unable to fetch project list');
		}
	}

	static async fetchAllProjects(userId) {
		try {
            await this.fetchProjectList(userId);
            await Storage.setAllProjects(allProjects);
			return 200;
		} catch (error) {
            throw error;
		}
    }
    
    static async fetchProject(projectId, userId) {
		try {
            let project = {};
			switch (projectId) {
                case 1: project = allProjects[0];
                break;
                case 2: project = allProjects[1];
                break;
                case 3: project = allProjects[2];
                break;
                case 4: project = allProjects[3];
            }
            return {
                status: 200,
                project,
            };
		} catch (error) {
			throw Error('unable to fetch project');
		}
    }
    
    static async fetchAllInvitations(userId) {
		try {
            this.fetchInvitationList(userId);
            await Storage.setAllInvitations(allProjects);
			return 200;
		} catch (error) {
			throw error;
		}
	}

	static async fetchInvitationList(userId) {
		try {
			await Storage.setInvitationList([1, 2, 3]);
			return 200;
		} catch(error) {
			throw error;
		}
	}

	static async updateProfile(_update, _userId) {
		let url = config.server.concat('/users/profile');
		try {
			let cookie = await Storage.getCookie();
			let response = await fetch(url, {
				method: 'PUT',
				headers: {
					"Content-Type" : "application/json",
					"cookie" : cookie,
				},
				body: JSON.stringify({
					update: _update,
					userId: _userId,
				})
			});
			await Storage.setCookie(res.headers.get('set-cookie'));
			return {
				status: response.status,
			};
		} catch (error) {
			throw Error('unable to update profile');
		}
	}

	//	Function used to post a newly created user
	//	Arguments: 
	//		userInfo: an json object that containes a user profile
	//	Returns status:
	//		200: all correct user infomation
	//		400: invalid user information
	static async createUser(userInfo) {
		try {
            await Storage.setProfile(userInfo.profile);
            return 200;
		} catch (error) {
			throw Error('unable to create a user');
		}
    }
    
    static async createProject(userId, project) {
		try {
            project = {
                projectId: 4,
                projectName: project.projectName,
                projectOwnerId: userId,
                projectDescription: project.projectDescription,
                projectStartDate: project.projectStartDate,
                projectEndDate: project.projectEndDate,
                memberId: [],
                events:[],
            }
            allProjects.push(project);
			return 200;
		} catch (error) {
			throw Error('unable to create project');
		}
    }
    
    static async createEvent(projectId, userId, event) {
        try {
            let project = allProjects[projectId - 1];
            event.eventId = project.events.length + 1;
            event.chosenId = [];
            project.events.push(event);
            return 200;
        } catch (error) {
            throw Error('unable to create event');  
        }
    }

    static async dropEvent(projectId, eventId, userId) {
		try {
            let project = allProjects[projectId - 1];
            for (var key in project.events) {
                let event = project.events[key];
                if (event.eventId == eventId) {
                    let filtered = event.chosenId.filter(function(e){return e != userId});
                    project.events[key].chosenId = filtered;
                    allProjects[projectId-1] = project;
                    break;
                }
            }
			return 200;
		} catch (error) {
			throw Error('unable to drop events');
		}
	}

	static async voteEvent(projectId, eventId, userId){
		try {
            let project = allProjects[projectId - 1];
            for (var key in project.events) {
                let event = project.events[key];
                if (event.eventId == eventId) {
                    project.events[key].chosenId.push(parseInt(userId));
                    allProjects[projectId - 1] = project;
                    break;
                }
            }
			return 200;
		} catch (error) {
			throw Error('unable to vote events');
		}
	}

	//	Function used to verify a user by google authentication
	//	Arguments:
	//		uesrInfo: an json object that directly returns from Google API
	//	Returns status:
	//		200: Google id_token is successfully verified
	//		400: Invalid Google id_token
	static async verifyUserByGoogle(userInfo){
		var url = config.server.concat('/auth/google');
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(userInfo),
			})
			let responseJson = await response.json();

			await Storage.setProfile(responseJson.profile);

			return {
				status: response.status,
			}
		} catch (error) {
			throw Error('unable to sign in');
		}
    }
    
    static async deleteEvent(projectId, eventId, userId) {
		try {
            let project = allProjects[projectId - 1];
            for (var key in project.events) {
                let event = project.events[key];
                if (event.eventId == eventId) {
                    project.events.splice(key, 1);
                    allProjects[projectId - 1] = project;
                    break;
                }
            }
			return 200;
		} catch (error) {
			throw Error('unable to drop events');
		}
    }
    
    static async inviteUser(projectId, userId, invitedEmail) {
		let url = config.server.concat('/project/invite');
		try {
			return 200;
		} catch (error) {
			throw Error('unable to invite user');
		}
    }
    
    static async deleteMember(projectId, memberId, userId) {
		try {
            let project = allProjects[projectId - 1];
            for (let key in project.memberId) {
                let id = project.memberId[key];
                if (id == memberId) {
                    project.memberId.splice(key, 1);
                    allProjects[projectId - 1] = project;
                    break;
                }
            }
			return 200;
		} catch (error) {
            Alert.alert(error.toString());
			throw Error('unable to remove members');
		}
    }
    
    static async acceptInvitation(projectId, userId) {
		try {
			return 200;
		} catch(error) {
			throw Error('unable to accept the invitation');
		}
	}

	static async rejectInvitation(projectId, userId) {
		try {
			return 200;
		} catch (error) {
			throw Error('unable to reject the invitation');
		}
	}
}


var allProjects = [
    {
        projectId: 1,
        projectName: 'Apple',
        projectOwnerId: 1,
        projectDescription: 'This is an apple',
        projectStartDate: '2018-10-21T00:00:00.000Z',
        projectEndDate: '2018-11-21T00:00:00.000Z',
        memberId: [2, 3],
        events:[
            {
                eventId: 0,
                eventName: 'Weekly event 1',
                eventStartTime: '2018-10-20T12:00:00.000Z',
                eventEndTime: '2018-10-20T13:00:00.000Z',
                eventLocation: 'test location',
                eventDescription: 'start on 2018-10-20 pm 12.00',
                eventRepeat: 'week',
                userLimit: 10,
                color: 'aqua',
                chosenId: [1],
            },
            {
                eventId: 1,
                eventName: 'daily event 1',
                eventStartTime: '2018-10-20T13:00:00.000Z',
                eventEndTime: '2018-10-20T14:00:00.000Z',
                eventLocation: 'test location',
                eventDescription: 'start on 2018-10-20 pm 13.00',
                eventRepeat: 'day',
                userLimit: 2,
                color: 'aqua',
                chosenId: [],
            },
            {
                eventId: 3,
                eventName: 'one time event 1',
                eventStartTime: '2018-10-20T12:00:00.000Z',
                eventEndTime: '2018-10-20T13:00:00.000Z',
                eventLocation: 'test location',
                eventDescription: 'start on 2018-10-20 pm 12.00',
                eventRepeat: 'week',
                userLimit: 0,
                color: 'aqua',
                chosenId: [],
            }
        ],
    },
    {
        projectId: 2,
        projectName: 'Banana',
        projectOwnerId: 1,
        projectDescription: 'This is a banana',
        projectStartDate: '2018-11-10T00:00:00.000Z',
        projectEndDate:'2018-12-10T00:00:00.000Z',
        memberId: [3],
        events:[
            {
                eventId: 4,
                eventName: 'Weekly event 2',
                eventStartTime: '2018-10-20T12:00:00.000Z',
                eventEndTime: '2018-10-20T13:00:00.000Z',
                eventLocation: 'test location',
                eventDescription: 'start on 2018-10-20 pm 12.00',
                eventRepeat: 'week',
                userLimit: 5,
                color: 'red',
                chosenId: [1],
            },
        ],
    },
    {
        projectId: 3,
        projectName: 'Sushi',
        projectOwnerId: 2,
        projectDescription: 'This is a sushi',
        projectStartDate: '2018-11-01T00:00:00.000Z',
        projectEndDate:'2018-12-20T00:00:00.000Z',
        memberId: [1],
        events:[
            {
                eventId: 5,
                eventName: 'Weekly event 3',
                eventStartTime: '2018-10-20T17:00:00.000Z',
                eventEndTime: '2018-10-20T18:00:00.000Z',
                eventLocation: 'test location',
                eventDescription: 'start on 2018-10-20 pm 12.00',
                eventRepeat: 'week',
                userLimit: 2,
                color: 'blueviolet',
                chosenId: [],
            },
        ],
    }
];

const testProfile1 = {
    userId: '1',
    userFirstname: 'Zhuohang',
    userLastname: 'Zeng',
    userEmail: 'test@mail.com',
    userGender: 'Male',
    userBirth: '1997-05-03T00:00:00.000Z',
    userDescription: 'hello this is henry',
    userRegion: 'Canada',
    isAdmin: '1',
};

const testProfile2 = {
    userId: '2',
    userFirstname: 'Alice',
    userLastname: 'Zhang',
    userEmail: 'alice@mail.com',
    userGender: 'Female',
    userBirth: '1998-02-20T00:00:00.000Z',
    userDescription: 'hello this is alice',
    userRegion: 'Canada',
    isAdmin: '1',
};

const testProfile3 = {
    userId: '3',
    userFirstname: 'Kyle',
    userLastname: 'Jiang',
    userEmail: 'kyle@mail.com',
    userGender: 'Male',
    userBirth: '1997-08-20T00:00:00.000Z',
    userDescription: 'hello this is kyle',
    userRegion: 'Canada',
    isAdmin: '1',
};