'use strict';
/*
 * This is the main file for this application
 * This is only responsible for user login status change
 * This file manages all navigation stacks
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, AsyncStorage} from 'react-native';
import MainPage from './MainPage';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import EditProfile from './EditProfile';
import CreateProject from './CreateProject';
import ChangePwd from './ChangePwd';
import {createStackNavigator} from 'react-navigation';

export default class App extends Component {
	render() {
			return (
				<IntroStack
					screenProps = {{onSignIn: this._onSighIn}}
				/>);
	}
}

const IntroStack = createStackNavigator(
	{
		SignIn: SignInPage,
		SignUp: SignUpPage,
		Main: MainPage,
		EditProfile: EditProfile,
		CreateProject: CreateProject,
		ChangePwd: ChangePwd,
	},
	{
		initialRouteName: 'SignIn',
	},
);



