'use strict';
//This file contains all HTTP requests for Group Calendar project
import React, {Component} from 'react';
import {Alert} from 'react-native';


export default class GCNetwork extends Component {


	//	Function used to login
	//	Arguments: 
	//		url: http request url
	//		user: an user object that contains user_email and password
	//	Returns:
	//		200: correct user info
	//		400: incorrect password
	//		404: cannot find 
	//	Note that user name should be validated 
	//
	static fetchUser(url, user) {
		return fetch(url, {method: 'GET', body: JSON.stringify(user)})
				.then(response => {
					return {
						status: [response.status],
						user: [response.json()]
					}
				})
				.catch(error => {
					Alert.alert("Something Bad Happened");
					return {
						status: 0,
					}
				});
	}
}