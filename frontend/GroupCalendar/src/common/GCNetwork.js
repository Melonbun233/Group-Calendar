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
	static async verifyUser(userEmail, userPwd) {
		let url = config.server.concat('/auth/app');
		try {
			let response = await fetch( url, 
			{	
				method: 'POST', 
				headers: {
					'Content-Type' : 'application/json',
				},
				credentials : 'include',
				body: JSON.stringify({
					userEmail,
					userPwd
				})
			});
			if (response.status == 200) {
				let responseJson = await response.json();
				await Storage.setProfile(responseJson);
			}
			
			return response.status;
		} catch (error) {
			throw Error('unable to verify user');
		}
	}

	static async updatePwd(userId, userPwd) {
		let url = config.server.concat('/users');
		let update = {userPwd};
		try {
			let response = await fetch (url, {
				method: 'PUT',
				headers: {
					'Content-Type' : 'application/json',
				},
				credentials : 'include',
				body: JSON.stringify({
					userId,
					update
				})
			});
			return response.status;
		} catch (error) {
			throw Error('unable to update password');
		}
	}

	static async updateProject(projectId, userId, update) {
		let url = config.server.concat('/project');
		try {
			let response = await fetch (url, {
				method: 'PUT',
				headers: {
					'Content-Type' : 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					projectId,
					userId,
					update
				})
			})
			return response.status;
		} catch (error) {
			throw Error('unable to update project');
		}
	}


	//search a specific user id
	//this function is similar to fetchProfile, but this one returns the profile
	static async searchProfile(userId) {
		let url = config.server.concat('/user/profile' + '?userId=' + userId);
		try {
			let response = await fetch(url, {
				method: 'Get',
				headers: {
					'Content-Type' : 'application/json',
				},
				credentials : 'include',
			});
			let responseJson = await response.json();

			return {
				profile : responseJson.profile,
				status: response.status
			}
		} catch (error) {
			throw Error('unable to find the user');
		}
	}
	//	Function used to fetch user profile
	//	Arguments
	//		user_id: corresponding user id, this can be fetched from user
	//	Returns status: 
	//		200: correct user id
	//		400: invalid user id
	//		404: cannot find user id
	static async fetchProfile(userId){
		let url = config.server.concat('/user/profile' + '?userId=' + userId);
		try {
			let response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type' : 'application/json',
				},
				credentials : 'include',
			});

			if (response.status == 200) {
				let responseJson = await response.json();
				await Storage.setProfile(responseJson.profile);
			}
			
			return response.status;
		} catch (error) {
			throw Error('unable to fetch profile');
		}
	}

	//only called by inner funcitons
	static async fetchProjectList(userId) {
		let url = config.server.concat('/user/projects' + '?userId=' + userId);
		try {
			let response = await fetch(url, {
				method : 'GET',
				headers: {
					'Content-Type' : 'application/json',
				},
				credentials : 'include',
			});

			if (response.status == 200) {
				let responseJson = await response.json();
				await Storage.setProjectList(responseJson.projectId);
			}
			return {status: response.status};
		} catch (error) {
			throw Error('unable to fetch project ID')
		}
	}

	static async fetchProject(projectId, userId) {
		let url = config.server.concat('/project' + '?userId=' + userId + 
			'&projectId=' + projectId);
		try {
			let response = await fetch(url, {
				method: 'GET',
				headers:{
					'Content-Type' : 'application/json',
				},
				credentials : 'include',
			});
			if (response.status == 200) {
				let responseJson = await response.json();
				return {
					status: response.status,
					project: responseJson.project,
				};
			}
			
			return {status: response.status};
		} catch (error) {
			throw Error('unable to fetch project');
		}
	}

	//fetch all projects related to this user
	static async fetchAllProjects(userId) {
		try {
			var allProjects = [];
			let response = await this.fetchProjectList(userId);
			if (response.status == 200) {
				let projectList = await Storage.getProjectList();
				for (let i = 0; i < projectList.length; i ++) {
					response = await this.fetchProject(projectList[i], userId);
					if (response.status == 200) {
						allProjects.push(response.project);
					} else {
						let json = await response.json();
						Alert.alert(JSON.stringify(json));
						break;
					}
				}
				await Storage.setAllProjects(allProjects);
				if (allProjects.length != projectList.length) {
					return 0;
				}
				return 200;
			} else {
				await Storage.setAllProjects(allProjects);
				return response.status;
			}
		} catch(error) {
			await Storage.setAllProjects(allProjects);
			throw error;
		}
	}

	static async updateProfile(update, userId) {
		let url = config.server.concat('/user/profile');
		try {
			let response = await fetch(url, {
				method: 'PUT',
				headers: {
					"Content-Type" : "application/json",
				},
				credentials : 'include',
				body: JSON.stringify({
					update,
					userId
				})
			});
			return response.status;
		} catch (error) {
			throw Error('unbale to update profile');
		}
	}

	//	Function used to post a newly created user
	//	Arguments: 
	//		userInfo: an json object that containes a user profile
	//	Returns status:
	//		200: all correct user infomation
	//		400: invalid user information
	static async createUser(userInfo) {
		let url = config.server.concat('/user/signup');
		let user = userInfo.user;
		let profile = userInfo.profile;
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: {"Content-Type": "application/json"},
				credentials : 'include',
				body: JSON.stringify({user, profile}),
			});
			return response.status;
		} catch (error) {
			throw Error('unable to create user');
		}
	}

	static async createProject(userId, project) {
		let url = config.server.concat('/project');
		project.projectOwnerId = userId;
		try {
			let response = await fetch (url, {
				method : 'POST',
				headers: {"Content-Type": "application/json"},
				credentials : 'include',
				body: JSON.stringify({userId, project}),
			});
			return response.status;
		} catch (error) {
			throw Error('unable to create project');
		}
	}

	static async createEvent(projectId, userId, event) {
		let url = config.server.concat('/project/events');
		event = [event];
		try {
			let response = await fetch (url, {
				method : 'POST',
				headers: {"Content-Type": "application/json"},
				credentials : 'include',
				body: JSON.stringify({userId, projectId, event}),
			});
			return response.status;
		} catch (error) {
			throw Error('unable to craete project');
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
				credentials : 'include',
			});
			
			if (response.status == 200) {
				let responseJson = await response.json();
				await Storage.setProfile(responseJson.profile);
				if (responseJson.pwdSet) {
					return 200;
				} else {
					return 0;
				}
			}
			return response.status;
		} catch (error) {
			throw Error('unable to verify user by google');
		}
	}

	static async dropEvent(projectId, eventId, userId) {
		eventId = [eventId];
		let url = config.server.concat('/project/event/member');
		try {
			let response = await fetch(url, {
				method: 'DELETE',
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({projectId, eventId, userId}),
				credentials : 'include',
			});
			return response.status;
		} catch (error) {
			throw Error('unable to drop events');
		}
	}

	static async voteEvent(projectId, eventId, userId){
		eventId = [eventId];
		let url = config.server.concat('/project/event/member');
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({projectId, eventId, userId}),
				credentials : 'include',
			});
			return response.status;
		} catch (error) {
			throw Error('unable to vote events');
		}
	}

	static async deleteEvent(projectId, eventId, userId) {
		eventId = [eventId];
		let url = config.server.concat('/project/events');
		try {
			let response = await fetch(url, {
				method: 'DELETE',
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({projectId, eventId, userId}),
				credentials : 'include',
			});
			return response.status;
		} catch (error) {
			throw Error('unable to drop events');
		}
	}

	static async deleteMember(projectId, memberId, userId) {
		memberId = [memberId];
		let url = config.server.concat('/project/members');
		try {
			let response = await fetch(url, {
				method: 'DELETE',
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({projectId, memberId, userId}),
				credentials : 'include',
			});
			return response.status;
		} catch (error) {
			throw Error('unable to remove members');
		}
	}

	static async inviteUser(projectId, userId, invitedEmail) {
		let url = config.server.concat('/project/invite');
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({projectId, userId, invitedEmail}),
				credentials : 'include',
			});
			return response.status;
		} catch (error) {
			throw Error('unable to invite user');
		}
	}
}