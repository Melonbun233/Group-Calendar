'use strict';
//This file is for the login page
//We will also implement sign up here

import React, {Component} from 'react';
import {Text, View, StyleSheet, KeyboardAvoidingView,
		Alert, Button, ScrollView} 
		from 'react-native';
import { GoogleSignin, statusCodes} from 'react-native-google-signin';
import {TextField} from 'react-native-material-textfield';
import Ripple from 'react-native-material-ripple';
import Network from './common/GCNetwork';
import cs from './common/CommonStyles';
import Storage from './common/Storage';
import * as config from './../config.json';

export default class SignInPage extends Component {
	//this page dont need a header
	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props);
	
		this.state = {
			//checking whether user has signed in
			isChecking: true,
			//user is signing by app
			isLoading: false,
			//user is signing by google
			isSigning: false, 
			userEmail: '',
			userPwd: '',
			errors: {},
		};

		//general callback when focusing text field
		this._onFocus = this._onFocus.bind(this);

		this._onSubmitEmail = this._onSubmitEmail.bind(this);
		this._onSubmitPassword = this._onSubmitPassword.bind(this);

		//setting up references
		this.emailRef = this._updateRef.bind(this, 'email');
		this.passwordRef = this._updateRef.bind(this, 'password');
		this._onSignInButtonPressed = this._onSignInButtonPressed.bind(this);
		this._onGoogleSignInPressed = this._onGoogleSignInPressed.bind(this);
	}

	//only called once
	//we will check whether user has signed out
	//if not, we will just sign in automatically
	async componentDidMount() {
		GoogleSignin.configure(config.googleSignIn);
		await this.checkUserSignedIn();
	}

	//check whether user has signed in
	async checkUserSignedIn(){
		try {
			let profile = await Storage.getProfile();
			if (profile == null){
				//user hasn't signed in
				this.setState({isChecking: false});
			} else {
				this.setState({isChecking: false});
				this.props.navigation.navigate('Main');
			}
		} catch (error) {
			Alert.alert('Something Went Wrong');
			//user hasn't signed in
			this.setState({isChecking: false});
		}
	}

	_onFocus(){
		let {errors} = this.state;
		for (let key in errors) {
			let ref = this[key];
			if(ref.isFocused()){
				delete errors[key];
			}
		}
		this.setState({errors});
	}

	_updateRef(name, ref){
		this[name] = ref;
	}

	_onSubmitEmail(){
		this.password.focus();
	}

	_onSubmitPassword(){
		this.password.blur();
		this._onSignInButtonPressed();
	}

	//Function handles sign in button press
	// we will send email and password to 
	async _onSignInButtonPressed(){
		let {userEmail, userPwd} = this.state;
		//we first get the user info by the username
		this.setState({isLoading: true});
		try {
			let status = await Network.verifyUser(userEmail, userPwd);
			//Alert.alert(JSON.stringify(status));
			switch (status) {
				//correct user_email and user_pwd
				//we save the user info to async storage and jump to main pages
				case 200: {
					this.setState({isLoading: false});
					Storage.setSignInByGoogle('false');
					//jump to main page
					this.props.navigation.navigate('Main');
				}
				break;
				case 400:
				case 404: this.setState(
						{errors: {
							email: 'incorrect email or password',
							password: 'incorrect email or password',
						}});
				break;
				default: Alert.alert('Internet Error', JSON.stringify(res.error));
			}
		} catch (error) {
			Alert.alert('Something went wrong');
		}
		this.setState({isLoading: false});
	}

	//sign in by google
	//on successful signin, we send the google id token to server and get 
	//our cookie
	async _onGoogleSignInPressed(){
		this.setState({isSigning: true});
		await GoogleSignin.hasPlayServices();
		await GoogleSignin.signIn()
			.then(async (userInfo) => 
			{
				let status = await Network.verifyUserByGoogle(userInfo);
				switch(status) {
					//already has an account
					case 200: {
						Storage.setSignInByGoogle('true');
						this.setState({isSigning: false});
						this.props.navigation.navigate('Main');
					}
					break;
					//doesnt has a password
					case 0: {
						this.props.navigation.push('GoogleSignIn');
					}
					break;
					default: {
						Alert.alert('Internet Error', JSON.stringify(status));
					}
				}
			})
			.catch((error) => {
				if (error.code === statusCodes.SIGN_IN_CANCELLED) {
					//user canceled the login flow
				} else if (error.code === statusCodes.IN_PROGRESS) {
					//in progress
				} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
					// play services not available or outdated
					Alert.alert('Play Service Not Avaliable');
				} else {
					//some other error happened
					Alert.alert('Something went wrong\n', JSON.stringify(error));
				}
			});
		this.setState({isSigning: false});
	}

	render() {
		let {isSigning, isLoading, isChecking, errors} = this.state;
		if (isChecking) {
			return (
				<View></View>
			);
		}
		//let {errors} = this.state;
		return (
			<KeyboardAvoidingView 
				behavior="padding" 
				style = {[cs.container, cs.wholePage, s.scrollContainer]}
			>
			<ScrollView
				style = {[s.scrollContainer]}
				keyboardShouldPersistTaps = 'never'
				scrollEnabled = {false}
			>
				{/*sign up button*/}
				<View style = {[cs.container, s.signUpContainer]}>
					<Button 
						testID = 'SignUpButton'
						title = 'Sign up'
						color = '#66a3ff'
						onPress = {() => this.props.navigation.push('SignUp')}
					/>
				</View>
				{/*title*/}
				<View style = {[cs.container, s.titleContainer]}>
					<Text style = {cs.title}>Group</Text>
					<Text style = {cs.title}>Calendar</Text>
					<Text style = {[cs.h3, s.welcome]}>Welcome Back</Text>
				</View>
				{/*user email and password*/}
				<View style = {[s.contentContainer]}>
					<TextField
						testID = 'UserEmail'
						ref = {this.emailRef}
						label = 'Email'
						fontSize = {18}
						labelHeight = {24}
						onChangeText = {(text) => this.setState({userEmail: text})}
						autoCorrect = {false}
						autoCapitalize = 'none'
						onSubmitEditing = {this._onSubmitEmail}
						returnKeyType = 'next'
						keyboardType = 'email-address'
						textContentType = 'username'
						error = {errors.email}
						onFocus = {this._onFocus}
					/>
					<TextField
						testID = 'UserPwd'
						ref = {this.passwordRef}
						fontSize = {18}
						labelHeight = {24}
						label = 'Password'
						inputContainerPadding = {4}
						onChangeText = {(text) => this.setState({userPwd: text})}
						secureTextEntry= {true}
						keyboardType = 'default'
						returnKeyType = 'go'
						onSubmitEditing = {this._onSubmitPassword}
						textContentType = 'password'
						clearTextOnFocus = {true}
						error = {errors.password}
						onFocus = {this._onFocus}
					/>
				</View>

			{/*sign in buttons*/}
				
				<Ripple
					testID = 'AppSignInButton'
					disabled = {isLoading}
					onPress = {this._onSignInButtonPressed}
					style = {[cs.container, s.buttonContainer]}
				>
						<Text style = {s.buttonMsg}>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</Text>
				</Ripple>

				<Ripple
					testID = 'GoogleSignInButton'
					onPress = {this._onGoogleSignInPressed}
					disabled = {isSigning} 
					style = {[cs.container, s.buttonContainer]}
				>
						<Text style = {s.buttonMsg}>Sign in by Google</Text>
				</Ripple>
				
			</ScrollView>
			</KeyboardAvoidingView>
			);
	}
} 



const s = StyleSheet.create({
	welcome: {
		color: '#e6e6e6',
	},
	scrollContainer: {
		paddingTop: 10,
		flex: 1,
		width: '100%',
		height: '100%',
	},
	signUpContainer: {
		flex: 1,
		width: '100%',
		paddingRight: 20,
		paddingTop: 30,
		alignItems: 'flex-end',
	},
	titleContainer: {
		marginLeft: '10%',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flex: 1,
	},
	contentContainer: {
		marginLeft: '10%',
		width: '80%',
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		marginLeft: '10%',
		marginTop: 5,
		marginBottom: 5,
		width: '80%',
		height: 40,
		backgroundColor: '#66a3ff',
	},
	buttonMsg: {
		color : '#ffffff',
		fontSize: 18,
	},
	failLogin: {
		alignItems: 'center',
		fontSize: 14,
		color: '#ff0000',
	},
});