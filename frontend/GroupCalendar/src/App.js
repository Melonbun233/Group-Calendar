'use strict';
/*
 * This is the main file for this application
 * This is only responsible for user login status change
 * This file manages all navigation stacks
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import MainPage from './MainPage';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import cs from './common/CommonStyles';
import {createStackNavigator} from 'react-navigation';

type Props = {};
export default class App extends Component<Props> {
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
	},
	{
		initialRouteName: 'SignIn',
	},
);



