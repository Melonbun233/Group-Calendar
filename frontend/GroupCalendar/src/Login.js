'use strict';
//This file is for the login page
//We will also implement sign up here

import React, {Component} from 'react';
import {Text, TextInput, View, StyleSheet, Alert, Button} from 'react-native';
import * as config from './../config.json'

export default class Login extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	username: '',
	  	password: '',
	  	isLoading: false,
	  };
	}

	//Function handles button press
	_onLoginButtonPressed = () => {
		//we first get the user info by the username
		var url = config.server.concat("/users");
		this._login(url);
	}

	//This function retrives user's info by username. It also handles http error
	_login = (url) => {
		fetch(url, {method: "GET", body: this.state.username})
			.then(response => {
				//we need to check response code
				if(response.ok) {
					//check password
					//suppose its correct here
					this.props.callback(this.state.username, this.state.password);
				} else if(res.status == 400 || res.status == 404) { //invalid username
					Alert.alert("Username or Password Incorrect");
				} else {
					Alert.alert(response.json().msg);
				}
			})
			.catch(error => {
					//this line is only for test
					this.props.callback(this.state.username, this.state.password);
					Alert.alert("Something Bad Happened")
				});
	}

	render() {
		return (
			<View style = {[s.container, s.background]}>
				<View style = {[s.container, s.titleContainer, s.bottom]}>
					<Text style = {s.title}>Group</Text>
					<Text style = {s.title}>Calendar</Text>
				</View>
				<View style = {[s.container, s.contentContainer]}>
					<TextInput 
						style = {s.slimRect}
						placeholder = "Username"
						onChangeText = {(text) => this.setState({username: text})}
						autoCorrect = {false}
						autoCapitalize = 'none'
					/>
					<TextInput 
						style = {s.slimRect}
						placeholder = "Password"
						onChangeText = {(text) => this.setState({password: text})}
						secureTextEntry= {true}
					/>
					<Button
						style = {s.slimRect}
						title = "Login"
						onPress = {this._onLoginButtonPressed}
					/>
				</View>
			</View>
			);
	}
} 


const s = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#00ccff',
	},
	titleContainer: {
		margin: 10,
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		flex: 1,
	},
	contentContainer: {
		margin: 10,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flex: 2,
	},
	title: {
		fontSize: 50,
		fontWeight: 'bold',
		color: '#000000',
	},
	button: {
		margin: 10,
		color: '#0066ff',
	},
	slimRect: {
		width: 230,
		height: 36,
		padding: 4,
		margin: 5,
		fontSize: 18,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: '#48BBEC',
		color: '#48BBEC',
		backgroundColor: '#ffffff',
	},
	

});