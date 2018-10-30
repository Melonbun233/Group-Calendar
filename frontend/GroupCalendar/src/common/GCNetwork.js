'use strict';
//This file contains all HTTP requests for Group Calendar project
import React, {Component} from 'react';
import {Alert} from 'react-native';
import * as config from './../../config.json';


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
		// let url = config.server.concat('/auth/app');
		// try {
		//     let response = await fetch( url, 
		//     {	
		//     	method: 'POST', 
		//     	headers: {"Content-Type": "application/json"},
		//     	body: JSON.stringify({
		//     		"userEmail":_userEmail,
		//     		"userPwd":_userPwd,
		//     	})
		// 	});
		//     let responseJson = await response.json();
		//     return {
		//     	status: response.status,
		//     	profile: responseJson.profile,
		//     	id_token: responseJson.uuid,
		//     }
		// } catch (_error) {
		// 	return {
		// 		status: 0,
		// 		error: _error,
		// 	}
		// }

		//this is for test
		return {
			status: 200,
			idToken: 'this is idToken',
			profile: {
				userEmail: 'admin@mail.com',
				userId: '0',
				userDescription: 'my name is henry',
				userRegion: 'Canada',
				userLastname: 'Zeng',
				userFirstname: 'Zhuohang',
				isAdmin: 1,
			}
		};
	}

	//	Function used to fetch user profile
	//	Arguments
	//		user_id: corresponding user id, this can be fetched from user
	//	Returns status: 
	//		200: correct user id
	//		400: invalid user id
	//		404: cannot find user id
	static async fetchProfile(_userId, _idToken){
		// let url = config.server.concat('/users/profile');
		// try {
		// 	let response = await fetch(url, {
		// 		method: 'GET',
		// 		headers: {"Content-Type": "application/json"},
		// 		body: JSON.stringify({
		// 			userId: _userId,
		// 			uuid: _idToken,
		// 		})
		// 	});
		// 	let responseJson = await response.json();
		// 	return {
		// 		status: response.status,
		// 		profile: responseJson,
		// 	}
		// } catch (_error) {
		// 	return {
		// 		status: 0,
		// 		error: _error,
		// 	}
		// }
		
		//this is only used for test
		return {
			status: 200,
			profile: {
				userEmail: 'test@fetch.com',
				userId: '0',
				userDescription: 'my name is henry',
				userRegion: 'Canada',
				userLastname: 'Zeng',
				userFirstname: 'Zhuohang',
				isAdmin: 1,
			}
		};
	}

	//we will assume user information is checked
	static async createUser(userInfo) {
		// let url = config.server.concat('/users');
		// try {
		// 	let response = await fetch(url, {
		// 		method: 'POST',
		// 		headers: {"Content-Type": "application/json"},
		// 		body: JSON.stringify(userInfo),
		// 	});
		// 	let responseJson = await response.json();
		// 	return {
		// 		status: response.status,
		// 		idToken: responseJson.uuid,
		// 		profile: responseJson.profile,
		// 	}
		// } catch (_error) {
		// 	return {
		// 		status: 0,
		// 		error: _error,
		// 	}
		// }

		//this is only used for test
		return {
			status: 200,
			idToken: 'this is idToken',
			profile: userInfo.profile,
		};
	}


	static async verifyUserByGoogle(userInfo){
		// var url = config.server.concat('/auth/google');
		// try {
		// 	let response = await fetch(url, {
		// 		method: 'POST',
		// 		headers: {"Content-Type": "application/json"},
		// 		body: JSON.stringify(userInfo),
		// 	})
		// 	let responseJson = await response.json();
		// 	return {
		// 		status: response.status,
		// 		id_token: responseJson.uuid,
		// 		profile: responseJson.profile,
		// 	}
		// } catch (_error) {
		// 	return {
		// 		status: 0,
		// 		error: _error,
		// 	}
		// }
		//this is for test
		return {
			status: 200,
			idToken: 'this is id_token',
			profile: {
				userEmail: userInfo.user.email,
				userId: userInfo.user.id,
				userDescription: 'my name is henry',
				userRegion: 'Canada',
				userLastname: userInfo.user.familyName,
				userFirstname: userInfo.user.givenName,
				isAdmin: 1,
			}
		};
	}

}