'use strict';
//This file contains all HTTP requests for Group Calendar project
import React, {Component} from 'react';
import {Alert, AsyncStorage} from 'react-native';
import * as config from '../../config.json';


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
		let url = config.server.concat('/auth/app');
		try {
			let response = await fetch( url, 
			{	
				method: 'POST', 
				headers: {
					'Content-Type' : 'application/json',
				},
				body: JSON.stringify({
					'userEmail':_userEmail,
					'userPwd':_userPwd,
				})
			});
			let responseJson = await response.json();

			await AsyncStorage.setItem('cookie', 
				JSON.stringify(res.headers.get('set-cookie')));
			await AsyncStorage.setItem('profile', 
				JSON.stringify(responseJson.profile));

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

	//	Function used to fetch user profile
	//	Arguments
	//		user_id: corresponding user id, this can be fetched from user
	//	Returns status: 
	//		200: correct user id
	//		400: invalid user id
	//		404: cannot find user id
	static async fetchProfile(_userId, _cookie){
		let url = config.server.concat('/users/profile');
		try {
			let response = await fetch(url, {
				method: 'GET',
				headers: {
					"Content-Type" : "application/json",
					"cookie" : _cookie,
				},
				body: JSON.stringify({
					userId: _userId,
				})
			});
			let responseJson = await response.json();

			await AsyncStorage.setItem('cookie', 
		    	JSON.stringify(res.headers.get('set-cookie')));
		    await AsyncStorage.setItem('profile', 
		    	JSON.stringify(responseJson.profile));

			return {
				status: response.status,
				profile: responseJson.profile,
			};
		} catch (_error) {
			return {
				status: 0,
				error,
			}
		}
	}

	static async updateProfile(_profile, _cookie) {
		let url = config.server.concat('/users/profile');
		try {
			let response = await fetch(url, {
				method: 'PUT',
				headers: {
					"Content-Type" : "application/json",
					"cookie" : _cookie,
				},
				body: JSON.stringify({
					profile: _profile,
				})
			});
			let responseJson = await response.json();

			await AsyncStorage.setItem('cookie',
				JSON.stringify(res.headers.get('set-cookie')));
			await AsyncStorage.setItem('profile',
				JSON.stringify(responseJson.profile));

			return {
				status: response.status,
				profile: responseJson.profile,
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
			let response = await fetch(url, {
				method: 'POST',
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(userInfo),
			});
			let responseJson = await response.json();

			await AsyncStorage.setItem('cookie', 
		    	JSON.stringify(res.headers.get('set-cookie')));

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

			await AsyncStorage.setItem('cookie', 
		    	JSON.stringify(res.headers.get('set-cookie')));
		    await AsyncStorage.setItem('profile', 
		    	JSON.stringify(responseJson.profile));

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