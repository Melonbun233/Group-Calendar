//this page is used for sign up
//this should be navigated from introPage
import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, ScrollView, 
	KeyboardAvoidingView} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import Ripple from 'react-native-material-ripple';
import cs from './common/CommonStyles';
import Network from './common/GCNetwork';
import Storage from './common/Storage';
import validate from 'validate.js';
import {signUpConstraints} from './common/validation';

export default class SignUpPage extends Component {
	static navigationOptions = {
		headerBackTitle: 'Back'
	}

	constructor(props) {
		super(props);
	
		this.state = {
			userEmail: '',
			userLastname: '',
			userFirstname: '',
			userPwd: '',
			isLoading: false,
			errors: {},
		};

		//general callback when focusing text field
		this._onFocus = this._onFocus.bind(this);
		//general callback when submit all info
		this._onSubmit = this._onSubmit.bind(this);

		//on submit callback
		this._onSubmitEmail = this._onSubmitEmail.bind(this);
		this._onSubmitLastname = this._onSubmitLastname.bind(this);
		this._onSubmitFirstname = this._onSubmitFirstname.bind(this);
		this._onSubmitPassword = this._onSubmitPassword.bind(this);

		//seting up references
		this.firstnameRef = this._updateRef.bind(this, 'firstname');
		this.lastnameRef = this._updateRef.bind(this, 'lastname');
		this.passwordRef = this._updateRef.bind(this, 'password');
		this.emailRef = this._updateRef.bind(this, 'email');
	}

	_updateRef = (name, ref) => {
		this[name] = ref;
	}
	//remove error
	_onFocus = () => {
		let {errors} = this.state;
		for (let name in errors) {
			let ref = this[name];
			if(ref.isFocused()){
				delete errors[name];
			}
		}

		this.setState({errors});
	}

	//check error
	_onSubmit = async () => {
		let {userEmail, userLastname, userFirstname, 
			userPwd, errors} = this.state;
		this.setState({isLoading: true});
		//validate user input here
		let invalid = validate({
			//attributes
			email: userEmail, 
			lastname: userLastname,
			firstname: userFirstname,
			password: userPwd,
			}, signUpConstraints, {fullMessages: false});
		//some error occured
		if (invalid) {
			for (let key in invalid) {
				let val = invalid[key][0];
				errors[key] = val;
			}
			this.setState(errors);
			this.setState({isLoading: false});
			return;
		}
		Alert.alert
		//correct info, create a new user
		let status = await Network.createUser(
				{
					user: {
						userEmail,
						userPwd,
					},
					profile: {
						userEmail,
						userFirstname,
						userLastname,
					}
				});
		switch (status) {
			case 200: {
				this.setState({isLoading: false});
				await Storage.setSignInByGoogle('false');
				this.props.navigation.navigate('Main');
			}
			break;
			case 400: Alert.alert('Email Already Used');
			break;
			default: Alert.alert('Internet Error ', status.toString());
		}
		this.setState({isLoading: false});
	}

	_onSubmitEmail = () => {
		this.firstname.focus();
	}

	_onSubmitFirstname = () => {
		this.lastname.focus();
	}

	_onSubmitLastname = () => {
		this.password.focus();
	}

	_onSubmitPassword = () => {
		this.password.blur();
	}

	render() {
		let {userEmail, userLastname, userFirstname, 
			userPwd, errors, isLoading} = 
			this.state;
		return (
			<KeyboardAvoidingView 
				keyboardVerticalOffset = {0}
				behavior = 'padding' 
				style = {[cs.container, s.scrollContainer]}
			>
			<ScrollView
				style = {[s.scrollContainer]}
				keyboardShouldPersistTaps = 'never'
			>
				<View style = {[cs.container, s.welcomeContainer]}>
					<Text style = {s.welcomeMsg}>Sign Up</Text>
				</View>
				<View style = {[s.contentContainer]}>
				{/*Email*/}
					<TextField
						testID = 'emailText'
						ref = {this.emailRef}
						label = 'Email'
						value = {userEmail}
						autoCorrect = {false}
						returnKeyType = 'next'
						autoCapitalize = 'none'
						labelHeight = {24}
						onChangeText = {(text) => this.setState({userEmail: text})}
						onSubmitEditing = {this._onSubmitEmail}
						onFocus = {this._onFocus}
						error = {errors.email}
						keyboardType = 'email-address'
						title = 'this email will be used to sign in'
					/>
				{/*Fist name*/}
					<TextField
						testID = 'firstnameText'
						ref = {this.firstnameRef}
						label = 'First Name'
						value = {userFirstname}
						autoCorrect = {false}
						autoCapitalize = 'words'
						returnKeyType = 'next'
						labelHeight = {24}
						onChangeText = {(text) => this.setState({userFirstname: text})}
						onSubmitEditing = {this._onSubmitFirstname}
						onFocus = {this._onFocus}
						error = {errors.firstname}
					/>
				{/*Last name*/}
					<TextField
						testID = 'lastnameText'
						ref = {this.lastnameRef}
						label = 'Last Name'
						value = {userLastname}
						autoCorrect = {false}
						autoCapitalize = 'words'
						returnKeyType = 'next'
						labelHeight = {24}
						onChangeText = {(text) => this.setState({userLastname: text})}
						onSubmitEditing = {this._onSubmitLastname}
						onFocus = {this._onFocus}
						error = {errors.lastname}
					/>
				{/*Password*/}
					<TextField
						testID = 'passwordText'
						ref = {this.passwordRef}
						label = 'Password'
						value = {userPwd}
						autoCorrect = {false}
						autoCapitalize = 'none'
						returnKeyType = 'done'
						labelHeight = {24}
						onChangeText = {(text) => this.setState({userPwd: text})}
						onSubmitEditing = {this._onSubmitPassword}
						onFocus = {this._onFocus}
						error = {errors.password}
						secureTextEntry = {true}
						clearTextOnFocus = {true}
						title = 'length should be between 6 and 14 inclusively'
					/>
					<Ripple
						testID = 'signUpButton'
						disabled = {isLoading}
						onPress = {this._onSubmit.bind(this)}
						style = {[cs.container, s.signUpButton]}
					>
						<Text style = {s.signUpMsg}>
						{isLoading ? 'Signing up for you...' : 'Submit'}
						</Text>
					</Ripple>
				</View>
				
			</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}

const s = StyleSheet.create({
	scrollContainer:{
		backgroundColor: '#ffffff',
		width: '100%',
		height: '100%',
	},
	welcomeContainer: {
		alignItems: 'flex-start',
		width: '100%',
		flex: 2,
		paddingLeft: '15%',
	},
	welcomeMsg: {
		fontSize: 50,
		color: '#000000',
		fontWeight: 'bold',
		paddingTop: '10%',
	},
	contentContainer: {
		marginLeft: '15%',
		width: '70%',
		flex: 5,
	},
	signUpButton: {
		marginTop: 5,
		alignItems: 'center',
		height: 40,
		width: '100%',
		backgroundColor: '#66a3ff',
	},
	signUpMsg: {
		color: '#ffffff',
		fontSize: 18,
	},
});