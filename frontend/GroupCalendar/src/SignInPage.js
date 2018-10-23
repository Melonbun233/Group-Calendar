'use strict';
//This file is for the login page
//We will also implement sign up here

import React, {Component} from 'react';
import {Text, TextInput, View, StyleSheet, 
		Alert, Button, ActivityIndicator} from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import Network from './common/GCNetwork';
import cs from './common/CommonStyles';
import * as config from './../config.json';

export default class SignInPage extends Component {
	//this page dont need a header
	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props);
	
		this.state = {
		  	signInFailed: false,
		  	isLoading: false,
		  	user_email: '',
		  	user_pwd: '',
		};
		
	}

	async componentDidMount() {
    	GoogleSignin.configure(config.googleSignIn);
	}

	//Function handles button press
	_onSignInButtonPressed = () => {
		//we first get the user info by the username
		this.setState({isLoading: true});
		var response = Network.fetchUser(this.state.user)
		
		switch(response.status) {
			case 200: this._signIn(response.user);
			break;
			case 0:
			case 400: 
			case 404: this.setState({signInFailed: true});
			break;
			default: Alert.alert("HTTP ERROR", JSON.stringify(response.status));
		}
		this.setState({isLoading: false});
	}

	//Actually compare the password and call onLogin to jump to main page
	_signIn = (user) => {
		if (user.user_pwd === this.state.user_pwd &&
			user.user_email === this.state.user_email){
			this.setState({signInFailed: false});
			this.props.navigation.navigate('Main', {user});
		} else {
			this.setState({signInFailed: true});
		}
	}

	_googleSignIn = async () => {
		this.setState({isLoading: true});
		await GoogleSignin.hasPlayServices();
		//await GoogleSignin.signOut();
		await GoogleSignin.signIn()
			.then((userInfo) => 
			{
				var user = {
						user_name: userInfo.user.name,
						user_email: userInfo.user.email,
						user_id: userInfo.user.id,
					};
				this.setState({
					isLoading: false,
				})
				this.props.navigation.navigate('Main', {user});
			})
			.catch((error) => {
				if(error.code === statusCodes.SIGN_IN_CANCELLED) {
					//user canceled the login flow
					Alert.alert(JSON.stringify(error));
				} else if (error.code === statusCodes.IN_PROGRESS) {
					//in progress
					Alert.alert(JSON.stringify(error));
				} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      				// play services not available or outdated
      				Alert.alert(JSON.stringify(error));
   				} else {
      				//some other error happened
      				Alert.alert(JSON.stringify(error));
    			}
    			this.setState({isLoading: false});
			});
		
	}

	render() {
		const spinner = this.state.isLoading ?
			<ActivityIndicator size='large'/> : null;
		const fail = this.state.signInFailed ?
			<Text style = {s.failLogin}>Email or Password Incorrect</Text> : null;

		return (
			<View style = {[cs.container, cs.wholePage]}>
				{/*sign up button*/}
				<View style = {[cs.container, s.signUpContainer]}>
					<Button 
						title = 'Sign up'
						color = '#66a3ff'
						onPress = {() => this.props.navigation.push('SignUp')}
					/>
				</View>
				{/*title*/}
				<View style = {[cs.container, s.titleContainer]}>
					<Text style = {cs.title}>Group</Text>
					<Text style = {cs.title}>Calendar</Text>
					<Text style = {[cs.h3, s.welcom]}>Welcom Back</Text>
				</View>
				{/*user email and passwrod*/}
				<View style = {[cs.container, s.contentContainer]}>
					<TextInput 
						style = {s.input}
						placeholder = 'Email'
						placeholderTextColor = '#b3b3b3'
						onChangeText = {(text) => this.setState({user_email: text})}
						autoCorrect = {false}
						autoCapitalize = 'none'
						keyboardType = 'default'
						textContentType = 'username'
					/>
					<TextInput 
						style = {s.input}
						placeholder = 'Password'
						placeholderTextColor = '#b3b3b3'
						onChangeText = {(text) => this.setState({user_pwd: text})}
						secureTextEntry= {true}
						keyboardType = 'default'
						textContentType = 'password'
					/>
					<View style = {s.buttonContainer}>
						<Button
							title = {this.state.isLoading ? 'Signing in...' : 'Sign in'}
							disabled = {this.state.isLoading}
							color = '#ffffff'
							onPress = {this._onSignInButtonPressed}
						/>
					</View>
					{fail}
					{spinner}
					<GoogleSigninButton
    					style={{ width: 48, height: 48 }}
    					size={GoogleSigninButton.Size.Icon}
    					color={GoogleSigninButton.Color.Dark}
    					onPress={this._googleSignIn}
    					disabled={this.state.isLoading} 
    				/>
					<View style = {[cs.container, cs.flowBottom]}>
						<Text style = {cs.smallText}> by Talking Code </Text> 
					</View>
				</View>
			</View>
			);
	}
} 



const s = StyleSheet.create({
	welcom: {
		color: '#e6e6e6',
	},
	signUpContainer: {
		width: '100%',
		paddingRight: 20,
		alignItems: 'flex-end',
	},
	titleContainer: {
		margin: 10,
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		flex: 2,
	},
	contentContainer: {
		margin: 10,
		justifyContent: 'flex-start',
		alignItems: 'center',
		flex: 4,
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
		borderColor: '#e6e6e6',
	},
	//background color
	bg: {
		backgroundColor: '#ffffff',
	},
	failLogin: {
		fontSize: 14,
		color: '#ff0000',
	}
});