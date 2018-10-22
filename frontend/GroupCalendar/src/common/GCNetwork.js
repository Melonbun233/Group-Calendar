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
	static fetchUser(_user) {
		//var url = config.server.concat('/users');
		// return fetch(url, {method: 'GET', body: JSON.stringify(_user)})
		// 		.then(response => {
		// 			return {
		// 				status: [response.status],
		// 				user: [response.json()]
		// 			}
		// 		})
		// 		.catch(error => {
		// 			Alert.alert("Something Very Bad Happened");
		// 			return {
		// 				status: 0,
		// 			}
		// 		});
		//this is for test
		return {
			status: 200,
			user: {
				user_name: 'admin',
				user_email: 'zeng_zh@foxmail.com',
				user_id: '0',
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
	static fetchProfile(_user_id){
		// var url = config.server.concat('/users/profile');
		// return fetch(url, {method: 'GET', body: JSON.stringify({user_id: [_userid]})})
		// 	.then(response => {
		// 		return {
		// 			status: [response.status],
		// 			profile: [response.json()]
		// 		}
		// 	})
		// 	.catch(error => {
		// 		Alert.alert("Something Very Bad Happened");
		// 		return {
		// 			status: 0,
		// 		}
		// 	});
		//this is only used for test
		return {
			status: 200,
			profile: {
				user_descript: 'my name is Henry',
				user_birth: '1997-05-03',
				user_gender: 'mail',
			}
		}

	}
}