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
import EditProject from './EditProject';
import CreateProject from './CreateProject';
import CreateEvent from './CreateEvent';
import EditPwd from './EditPwd';
import ProjectDetail from './ProjectDetail';
import ProfileDetail from './ProfileDetail';
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
		EditProject: EditProject,
		CreateProject: CreateProject,
		CreateEvent: CreateEvent,
		EditPwd: EditPwd,
		GoogleSignIn: GoogleSignInPwd,
		ProjectDetail: ProjectDetail,
		ProfileDetail: ProfileDetail,
	},
	{
		initialRouteName: 'SignIn',
	},
);



