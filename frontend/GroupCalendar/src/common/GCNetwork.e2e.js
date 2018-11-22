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
                let date = new Date(1997, 4, 3);
                await Storage.setProfile({
                    userId: '1',
                    userFirstname: 'Zhuohang',
                    userLastname: 'Zeng',
                    userEmail: _userEmail,
                    userGender: 'Male',
                    userBirth: date.toJSON(),
                    userDescription: 'hello this is henry',
                    userRegion: 'Canada',
                    isAdmin: '1',
                });
                return 200;
            } else {
                return 400;
            }
		} catch (_error) {
			return {
				status: 0,
				error: _error,
			}
		}
	}

    static async updatePwd(_userId, _userPwd) {
		try {
			return 200;
		} catch (error) {
			throw error;
		}
	}
	//search a specific user id
	//this function is similar to fetchProfile, but this one returns the profile
	static async searchProfile(_userId) {
		let url = config.server.concat('/users/profile');
		try {
			let cookie = await Storage.getCookie();
			let response = await fetch(url, {
				method: 'Get',
				headers: {
					'Content-Type' : 'application/json',
					'cookie' : cookie,
				},
				body: JSON.stringify({
					userId: _userId,
				})
			});
			let responseJson = await response.json();

			return {
				'response' : responseJson,
				status: response.status
			}
		} catch (error) {
			return {
				status: 0,
				error
			}
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
			return {
				status: 0,
				error,
			}
		}
	}

	static async fetchProjectId(userId) {
		let url = config.server.concat('/users/project/');
		try {
			let cookie = await Storage.getCookie();
			let response = await fetch(url, {
				method : 'GET',
				headers: {
					'Content-Type' : 'application/json',
					'cookie' : cookie
				},
				body: JSON.stringify({
					userId: _userId
				})
			});
			let responseJson = await response.json();
			await Storage.setCookie(res.headers.get('set-cookie'));

			return {
				projectList: responseJson,
				status: response.status,
			}
		} catch (error) {
			return {
				status: 0,
				error,
			}
		}
	}

	static async fetchProject(projectId, userId) {
		let url = config.server.concat('/projects');
		try {
			let cookie = await Storage.getCookie();
			//let response = await 
		} catch (error) {

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
			return {
				status: 0,
				error,
			}
		}
	}

	//	Function used to post a newly created user
	//	Arguments: 
	//		userInfo: an json object that containes a user profile
	//	Returns status:
	//		200: all correct user infomation
	//		400: invalid user information
	static async createUser(userInfo) {
		let url = config.server.concat('/users');
		try {
            await Storage.setProfile(userInfo.profile);
            return 200;
		} catch (_error) {
			return {
				status: 0,
				error: _error,
			}
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

			await Storage.setCookie(res.headers.get('set-cookie'));
			await Storage.setProfile(responseJson.profile);

			return {
				status: response.status,
			}
		} catch (_error) {
			return {
				status: 0,
				error: _error,
			}
		}
	}
}