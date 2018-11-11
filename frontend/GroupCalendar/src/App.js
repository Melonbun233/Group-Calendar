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
import cs from './common/CommonStyles';
import {createStackNavigator} from 'react-navigation';

type Props = {};

export default class App extends Component<Props> {
	//this is only for test
	async componentDidMount() {
		let date = new Date(1997, 4, 3);
		await AsyncStorage.setItem('cookie', 'this is test cookie');
		await AsyncStorage.setItem('profile', 
						JSON.stringify({
							userFirstname: 'Zhuohang',
							userLastname: 'Zeng',
							userEmail: 'zeng_zh@foxmail.com',
							userGender: 1,
							userBirth: date.toJSON(),
							userDescription: 'hello this is henry',
							userRegion: 'Canada',
							isAdmin: 1,
						}));
	}

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
	},
	{
		initialRouteName: 'Main',
	},
);



