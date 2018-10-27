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
	static async verifyUser(_user_email, _user_pwd) {
		// let url = config.server.concat('/');
		// try {
		//     let response = await fetch( url, 
		//     {	
		//     	method: 'POST', 
		//     	headers: {"Content-Type": "application/json"},
		//     	body: JSON.stringify({"user_id":"2345234"})
		// 	});
		//     let responseJson = await response.json();
		//     return {
		//     	status: response.status,
		//     	profile: responseJson.profile,
		//     	id_token: responseJson.id_token,
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
			id_token: 'this is id_token',
			profile: {
				user_email: 'admin@mail.com',
				user_id: '0',
				user_description: 'my name is henry',
				user_region: 'Canada',
				user_lastname: 'Zeng',
				user_firstname: 'Zhuohang',
				is_admin: 1,
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
	static async fetchProfile(_user_id, _id_token){
		// let url = config.server.concat('/users/profile');
		// try {
		// 	let response = await fetch(url, {
		// 		method: 'GET',
		// 		headers: {"Content-Type": "application/json"},
		// 		body: JSON.stringify({
		// 			user_id: _user_id,
		// 			id_token: _id_token,
		// 		})
		// 	});
		// 	let responseJson = await response.json();
		// 	return {
		// 		status: response.status,
		// 		body: responseJson,
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
				user_email: 'test@fetch.com',
				user_id: '0',
				user_description: 'my name is henry',
				user_region: 'Canada',
				user_lastname: 'Zeng',
				user_firstname: 'Zhuohang',
				is_admin: 1,
			}
		};
	}

	//we will assume user information is checked
	static async createUser(userInfo) {
		url = config.server.concat('/users');
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(userInfo),
			});
			let responseJson = await response.json();
			return {
				status: response.status,
				id_token: responseJson.id_token,
				profile: responseJson.profile,
			}
		} catch (_error) {
			return {
				status: 0,
				error: _error,
			}
		}

		//this is only used for test
		return {
			status: 200,
			id_token: 'this is id_token',
			profile: {
				user_email: 'admin@mail.com',
				user_id: '0',
				user_description: 'my name is henry',
				user_region: 'Canada',
				user_lastname: 'Zeng',
				user_firstname: 'Zhuohang',
				is_admin: 1,
			}
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
		// 		id_token: responseJson.id_token,
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
			id_token: 'this is id_token',
			profile: {
				user_email: 'admin@mail.com',
				user_id: '0',
				user_description: 'my name is henry',
				user_region: 'Canada',
				user_lastname: 'Zeng',
				user_firstname: 'Zhuohang',
				is_admin: 1,
			}
		};
	}

}