'use strict';
//This file is for the login page
//We will also implement sign up here

import React, {Component} from 'react';
import {Text, TextInput, View, StyleSheet, 
		Alert, Button, ActivityIndicator} from 'react-native';
import cs from './common/CommonStyles';
import Network from './common/GCNetwork';
import * as config from './../config.json';

export default class Login extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	loginFailed: false,
	  	isLoading: false,
	  	user: {
	  		user_email: '',
	  		password: '',
	  	},
	  };
	}

	//Function handles button press
	onLoginButtonPressed = () => {
		//we first get the user info by the username
		this.setState({isLoading: true});
		var url = config.server.concat("/users");
		Network.fetchUser(url, this.state.user)
			.then(response => {
				switch(response.status) {
					case 200: this.props.onLogin(response.user);
					break;
					case 0:
					case 400: 
					case 404: this.setState({loginFailed: true});
					break;
					default: Alert.alert("HTTP error: ${status}");
				}
			});
		this.setState({isLoading: false});
	}

	render() {
		const spinner = this.state.isLoading ?
			<ActivityIndicator size='large'/> : null;
		return (
			<View style = {cs.container}>
				<View style = {[cs.container, s.titleContainer]}>
					<Text style = {cs.title}>Group</Text>
					<Text style = {cs.title}>Calendar</Text>
				</View>
				<View style = {[cs.container, s.contentContainer]}>
					<TextInput 
						style = {s.input}
						placeholder = 'Username'
						placeholderTextColor = '#b3b3b3'
						onChangeText = {(text) => this.setState({username: text})}
						autoCorrect = {false}
						autoCapitalize = 'none'
						keyboardType = 'default'
					/>
					<TextInput 
						style = {s.input}
						placeholder = 'Password'
						placeholderTextColor = '#b3b3b3'
						onChangeText = {(text) => this.setState({password: text})}
						secureTextEntry= {true}
						keyboardType = 'default'
					/>
					<View style = {s.buttonContainer}>
						<Button
							title = 'Login'
							color = '#ffffff'
							onPress = {this.onLoginButtonPressed}
						/>
					</View>
					{spinner}
					<View style = {[cs.container, cs.flowBottom]}>
						<Text style = {cs.smallText}> by Talking Code </Text> 
					</View>
				</View>
			</View>
			);
	}
} 


const s = StyleSheet.create({
	titleContainer: {
		margin: 10,
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		flex: 1,
	},
	contentContainer: {
		margin: 10,
		justifyContent: 'flex-start',
		alignItems: 'center',
		flex: 2,
	},
	buttonContainer: {
		margin: 5,
		width: 250,
		height: 40,
		backgroundColor: '#66a3ff'
	},
	input: {
		width: 250,
		height: 36,
		padding: 4,
		margin: 3,
		fontSize: 18,
		borderBottomWidth: 1,
		borderColor: '#e1e1ea',
	},
	//background color
	bg: {
		backgroundColor: '#ffffff',
	},
});