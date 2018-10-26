'use strict';
//This file is for the login page
//We will also implement sign up here

import React, {Component} from 'react';
import {Text, TextInput, View, StyleSheet, KeyboardAvoidingView,
		Alert, Button, ActivityIndicator, ScrollView} 
		from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import {TextField} from 'react-native-material-textfield';
import Ripple from 'react-native-material-ripple';
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
		  	isLoading: false,
		  	isSigning: false, //by google
		  	user_email: '',
		  	user_pwd: '',
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
	}

	//only called once
	async componentDidMount() {
    	GoogleSignin.configure(config.googleSignIn);
	}

	_onFocus = () => {
		let {errors} = this.state;
		for (let key in errors) {
			let ref = this[key];
			if(ref.isFocused()){
				delete errors[key];
			}
		}
		this.setState({errors});
	}

	_updateRef = (name, ref) => {
		this[name] = ref;
	}

	_onSubmitEmail = () => {
		this.password.focus();
	}

	_onSubmitPassword = () => {
		this.password.blur();
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
					this.setState({isLoading: false});
					this.props.navigation.navigate('Main', 
						{user: res.body, signInByGoogle: false});
				} else {
					this.setState({errors: {
						email: 'incorrect email or password',
						password: 'incorrect email or password',
					}});
				}
			} else if (res.status == 400 || res.status == 404) {
				this.setState({errors: {
						email: 'incorrect email or password',
						password: 'incorrect email or password',
					}});
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
				if (error.code === statusCodes.SIGN_IN_CANCELLED) {
					//user canceled the login flow
   				} else if (error.code === statusCodes.IN_PROGRESS) {
					//in progress
				} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
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
		let {errors} = this.state;
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
						error = {errors.email}
						onFocus = {this._onFocus}
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
						error = {errors.password}
						onFocus = {this._onFocus}
					/>
				</View>

			{/*sign in buttons*/}
				
				<Ripple
					disabled = {this.state.isLoading}
					onPress = {this._onSignInButtonPressed}
					style = {[cs.container, s.buttonContainer]}
				>
						<Text style = {s.buttonMsg}>
							{this.state.isLoading ? 'Signing in...' : 'Sign in'}
						</Text>
				</Ripple>
				<Ripple
					onPress = {this._onGoogleSignInPressed}
					disabled = {this.state.isSigning} 
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