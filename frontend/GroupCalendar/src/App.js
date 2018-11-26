'use strict';
/*
 * This is the main file for this application
 * This is only responsible for user login status change
 * This file manages all navigation stacks
 */

import React, {Component} from 'react';
import MainPage from './MainPage';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import EditProfile from './EditProfile';
import CreateProject from './CreateProject';
import CreateEvent from './CreateEvent';
import ChangePwd from './ChangePwd';
import ProjectDetail from './ProjectDetail';
import {createStackNavigator} from 'react-navigation';
import GoogleSignInPwd from './GoogleSignInPwd';

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
		CreateEvent: CreateEvent,
		ChangePwd: ChangePwd,
		GoogleSignIn: GoogleSignInPwd,
		ProjectDetail: ProjectDetail,
	},
	{
		initialRouteName: 'SignIn',
	},
);



