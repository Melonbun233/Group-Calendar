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
		  	isSigning: false, //by google
		  	user_email: '',
		  	user_pwd: '',
		};
		//this._onSignOut = this._onSignOut.bind(this);
	}

	async componentDidMount() {
    	GoogleSignin.configure(config.googleSignIn);
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
				// this.props.navigation.navigate('Main',
				// 	{user: {
				// 		user_email: userInfo.user.email,
				// 		user_name: userInfo.user.name,
				// 		userid: userInfo.user.id,
				// 	}, signInByGoogle: true});

				let res = await Network.fetchUserWithGoogle(userInfo.idToken);
				//Alert.alert(JSON.stringify(res));
				if(res !== null) {
					if (res.status == 200) {
						this.setState({isSigning: false});
						this.props.navigation.navigate('Main', 
							{user: res.user, signInByGoogle: true});
					} else if (res.status == 400) {
						Alert.alert('Something Wrong with Your Google Account');
					} else {
						Alert.alert("Internet Error", JSON.stringify(res.error));
					}
					// switch(res.status) {
					// 	case 200: {
					// 		this.setState({isSigning: false});
					// 		this.props.navigation.navigate('Main', 
					// 			{user: response.user, signInByGoogle: true});
					// 	}
					// 	break;
					// 	case 400: Alert.alert('Something Wrong with Your Google Account');
					// 	break;
					// }
				}
			})
			.catch((error) => {
				if(error.code === statusCodes.SIGN_IN_CANCELLED) {
					//user canceled the login flow
				} else if (error.code === statusCodes.IN_PROGRESS) {
					//in progress
				} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      				// play services not available or outdated
      				Alert.alert('Play Service Not Avaliable');
   				} else {
      				//some other error happened
      				//console.error(JSON.stringify(error));
    			}
			});
		this.setState({isSigning: false});
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
					<Text style = {[cs.h3, s.welcome]}>Welcomee Back</Text>
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
						keyboardType = 'email-address'
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
						clearTextOnFocus = {true}
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
					<View style = {s.googleSignIn}>
						<GoogleSigninButton
	    					style={{ width: 250, height: 48 }}
	    					size={GoogleSigninButton.Size.Standard}
	    					color={GoogleSigninButton.Color.Dark}
	    					onPress={this._onGoogleSignInPressed}
	    					disabled={this.state.isSigning} 
	    				/>
    				</View>
					<View style = {[cs.container, cs.flowBottom]}>
						<Text style = {cs.smallText}> by Talking Code </Text> 
					</View>
				</View>
			</View>
			);
	}
} 



const s = StyleSheet.create({
	welcome: {
		color: '#e6e6e6',
	},
	signUpContainer: {
		flex: 2,
		width: '100%',
		paddingRight: 20,
		paddingTop: 30,
		alignItems: 'flex-end',
	},
	titleContainer: {
		margin: 12,
		marginBottom: 0,
		marginTop: 0,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flex: 10,
	},
	contentContainer: {
		margin: 10,
		marginTop: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		flex: 21,
	},
	buttonContainer: {
		margin: 5,
		width: 250,
		height: 40,
		backgroundColor: '#66a3ff'
	},
	googleSignIn: {
		flex: 10,
		alignItems: 'center',
		justifyContent: 'flex-end',
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