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
	static async fetchUser(_user_email) {
		let url = config.server.concat('/users?user_email=').concat(_user_email);
		//let url = 'https://facebook.github.io/react-native/movies.json';
		try {
		    let response = await fetch( url, 
		    {	
		    	method: 'GET', 
			});
		    let responseJson = await response.json();
		    return {
		    	status: response.status,
		    	body: responseJson,
		    }
		} catch (_error) {
			return {
				status: 0,
				error: _error,
			}
		}
		//this is for test
		// return {
		// 	status: 200,
		// 	user: {
		// 		user_name: 'Admin',
		// 		user_pwd: 'qwer',
		// 		user_email: 'admin@mail.com',
		// 		user_id: '0',
		// 	}
		// };
	}

	//	Function used to fetch user profile
	//	Arguments
	//		user_id: corresponding user id, this can be fetched from user
	//	Returns status: 
	//		200: correct user id
	//		400: invalid user id
	//		404: cannot find user id
	static async fetchProfile(_user_id){
		let url = config.server.concat('/users/profile?user_id=').concat(_user_id);
		try {
			let response = await fetch(url, {
				method: 'GET'
			});
			let responseJson = await response.json();
			return {
				status: response.status,
				body: responseJson,
			}
		} catch (_error) {
			return {
				status: 0,
				error: _error,
			}
		}
		//this is only used for test
		// return {
		// 	status: 200,
		// 	profile: {
		// 		user_region: 'Canada',
		// 		user_descript: 'my name is Henry',
		// 		user_birth: '1997-05-03',
		// 		user_gender: 'male',
		// 	}
		// }
	}

	//we currently use url to pass parameter because some inevitable bugs
	static async fetchUserWithGoogle(idToken){
		var url = config.server.concat('/auth/google?id_token=').concat(idToken);
		Alert.alert(url);
		//Alert.alert(url);
		try {
			let response = await fetch(url, {
				method: 'POST',
				// headers: JSON.stringify({"Content-Type": "application/json"}),
				// body: JSON.stringify({"tes": "tests"}),
			})
			let responseJson = await response.json();
			return {
				status: response.status,
				body: responseJson,
			}
		} catch (_error) {
			return {
				status: 0,
				error: _error,
			}
		}

		// return {
		// 	status: 200,
		// 	user: {
		// 		id_token: idToken,
		// 		user_name: 'Zhuohang Zeng',
		// 		user_pwd: '',
		// 		user_email: 'zzhuohang@gmail.com',
		// 		user_id: '0',
		// 	}
		// }
	}




}