'use strict';
//This file is for the login page
//We will also implement sign up here

import React, {Component} from 'react';
import {Text, TextInput, View, StyleSheet, KeyboardAvoidingView,
		Alert, Button, ActivityIndicator, ScrollView} from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import {TextField} from 'react-native-material-textfield';
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
		  	isSigning: false, //by google
		  	user_email: '',
		  	user_pwd: '',
		};

		this._onSubmitEmail = this._onSubmitEmail.bind(this);
		this._onSubmitPassword = this._onSubmitPassword.bind(this);

		//setting up references
		this.emailRef = this._updateRef.bind(this, 'email');
		this.passwordRef = this._updateRef.bind(this, 'password');
	}

	//only called once
	async componentDidMount() {
    	GoogleSignin.configure(config.googleSignIn);
	}

	_updateRef = (name, ref) => {
		this[name] = ref;
	}

	_onSubmitEmail = () => {
		this.password.focus();
	}

	_onSubmitPassword = () => {
		this._onSignInButtonPressed();
	}

	//Function handles button press
	_onSignInButtonPressed = async () => {
		//we first get the user info by the username
		this.setState({isLoading: true});
		let res = await Network.fetchUser(this.state.user_email);
		if(res !== null){
			if(res.status == 200){
				if (res.body.user_pwd == this.state.user_pwd &&
					res.body.user_email == this.state.user_email){
					this.setState({signInFailed: false, isLoading: false});
					this.props.navigation.navigate('Main', 
						{user: res.body, signInByGoogle: false});
				} else {
					this.setState({signInFailed: true});
				}
			} else if (res.status == 400 || res.status == 404) {
				this.setState({signInFailed: true});
			} else {
				Alert.alert("Internet Error", JSON.stringify(res.error));
			}
		}
		this.setState({isLoading: false});
	}

	_onGoogleSignInPressed = async () => {
		this.setState({isSigning: true});
		await GoogleSignin.hasPlayServices();
		await GoogleSignin.signIn()
			.then(async (userInfo) => 
			{
				let res = await Network.fetchUserWithGoogle(userInfo)
				if(res !== null) {
					if (res.status == 200) {
						this.setState({isSigning: false});
						this.props.navigation.navigate('Main', 
							{user: res.body, signInByGoogle: true});
					} else if (res.status == 400) {
						Alert.alert('Something Wrong with Your Google Account');
					} else {
						Alert.alert("Internet Error", JSON.stringify(res.error));
					}
				}
			})
			.catch((error) => {
				if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      				// play services not available or outdated
      				Alert.alert('Play Service Not Avaliable');
   				} else {
      				//some other error happened
      				Alert.alert('Something Bad Happend\n', JSON.stringify(error));
    			}
			});
		this.setState({isSigning: false});
	}

	render() {
		const fail = this.state.signInFailed ?
			<View style = {s.failLogin}>
			<Text style = {s.failLogin}>Email or Password Incorrect</Text>
			</View> : null;

		return (
			<KeyboardAvoidingView 
				behavior="padding" 
				style = {[cs.container, cs.wholePage, s.scrollContainer]}
			>
			<ScrollView
				style = {[s.scrollContainer]}
				keyboardShouldPersistTaps = 'never'
				//scrollEnabled = {false}
			>
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
					<Text style = {[cs.h3, s.welcome]}>Welcome Back</Text>
				</View>
				{/*user email and password*/}
				<View style = {[s.contentContainer]}>
					<TextField
						ref = {this.emailRef}
						label = 'Email'
						fontSize = {18}
						labelHeight = {24}
						onChangeText = {(text) => this.setState({user_email: text})}
						autoCorrect = {false}
						autoCapitalize = 'none'
						onSubmitEditing = {this._onSubmitEmail}
						returnKeyType = 'next'
						keyboardType = 'email-address'
						textContentType = 'username'
					/>
					<TextField
						ref = {this.passwordRef}
						fontSize = {18}
						labelHeight = {24}
						label = 'Password'
						inputContainerPadding = {4}
						onChangeText = {(text) => this.setState({user_pwd: text})}
						secureTextEntry= {true}
						keyboardType = 'default'
						returnKeyType = 'go'
						onSubmitEditing = {this._onSubmitPassword}
						textContentType = 'password'
						clearTextOnFocus = {true}
					/>
				</View>

			{/*sign in buttons*/}
				<View style = {[cs.container, s.buttonContainer]}>
					<Button
						title = {this.state.isLoading ? 'Signing in...' : 'Sign in'}
						disabled = {this.state.isLoading}
						color = '#ffffff'
						onPress = {this._onSignInButtonPressed}
					/>
				</View>
				<View style = {[cs.container, s.buttonContainer]}>
					<Button
    					//style = {{ width: 230, height: 48 }}
    					title = 'Sign in by Google'
    					onPress = {this._onGoogleSignInPressed}
    					color = '#ffffff'
    					disabled = {this.state.isSigning} 
    				/>
				</View>
				{fail}
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
		height: '6%',
		backgroundColor: '#66a3ff',
	},
	failLogin: {
		alignItems: 'center',
		fontSize: 14,
		color: '#ff0000',
	},
});