'use strict';
/**
 * This is the main file for this application
 * This is only responsible for user login status change
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import Login from './Login';
import MainPage from './MainPage';
import cs from './common/CommonStyles';

type Props = {};
export default class App extends Component<Props> {
	constructor(props) {
		super(props);
	  
		this.state = {
			loginStatus: false,
			user: {
				user_id: 0
				user_name: '',
				user_pwd: '',
				user_email: '',
				//more
			},
		};
		
		//bind callback functions
		this.onLogin = this.onLogin.bind(this);
		this.onLogout = this.onLogout.bind(this);
	}

	//this handler is called when user_name and user_pwd are correct
	onLogin = (_user) => {	
		this.setState({
			loginStatus: true,
			user: [_user],
		});
	}

	//this function is triggered when logout button is pressed
	onLogout = () => {
		this.setState({
			loginStatus: false,
			user: {
				user_name: '',
				user_pwd: '',
			},
		});
	}

	render() {
		if(this.state.loginStatus) {
			//render main page
			return (
				<MainPage 
					user = {this.state.user} 
					onLogout = {this.onLogout}
				/>
			);
		} else {
			//render login page
			return (<Login onLogin = {this.onLogin} />);
		}
	}
}
