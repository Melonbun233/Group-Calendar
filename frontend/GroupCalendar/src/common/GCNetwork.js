'use strict';
//This file contains all HTTP requests for Group Calendar project
import React, {Component} from 'react';
import {Alert} from 'react-native';
import * as config from './../../config.json';


export default class GCNetwork extends Component {


	//	Function used to fetch user information
	//	Arguments: 
	//		user: an user object that contains user_email and user_pwd
	//	Returns:
	//		200: correct user info
	//		400: incorrect password
	//		404: cannot find 
	//	Note that user name should be validated 
	//
	static fetchUser(user) {
		//var url = config.server.concat("/users");
		// return fetch(url, {method: 'GET', body: JSON.stringify(user)})
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

	//
	static fetchProfile(){

	}
}