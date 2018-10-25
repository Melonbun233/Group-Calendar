//this page is used for sign up
//this should be navigated from introPage
import React, {Component} from 'react';
import {StyleSheet, TextInput, Text, View, 
		Button, Alert, KeyboardAvoidingView} from 'react-native';
import cs from './common/CommonStyles';
import Network from './common/GCNetwork.js';

export default class SignUpPage extends Component {
	static navigationOptions = {
	}

	constructor(props) {
		super(props);
	
		this.state = {
			user_email: '',
			user_name: '',
			user_pwd: '',
			emailIsValid: true,
			nameIsValid: true,
			pwdIsValid: true,
			isLoading: false,
		};
	}

	_onSignUpButtonPressed = async () => {
		//validate user input here
		this.setState({isLoading: true});
		let res = await Network.createUser(
				this.state.user_email,
				this.state.user_name,
				this.state.user_pwd,
				);
		//Alert.alert(JSON.stringify(res.body));
		if (res !== null) {
			if(res.status == 200) {
				this.setState({isLoading: false});
				this.props.navigation.navigate('Main',
					{user: res.body, signInByGoogle: false});
			} else if (res.status == 400) {
				Alert.alert('Invalid Inputs');
			} else {
				Alert.alert("Internet Error", JSON.stringify(res.error));
			}
		}
		this.setState({isLoading: false});
	}

	render() {
		return (
			<View style = {cs.container}>
				<View style = {[cs.container, s.welcome]}>
					<Text style = {s.welcomeMsg}>Welcome</Text>
				</View>
				<KeyboardAvoidingView style = {[cs.container, s.contentContainer]}>
					<TextInput
						style = {s.input}
						placeholder = 'Email'
						placeholderTextColor = '#b3b3b3'
						onChangeText = {(text) => this.setState({user_email: text})}
						keyboardType = 'email-address'
						autoCapitalize = 'none'
						autoCorrect = {false}
						onSubmitEditing = {this._onSignUpButtonPressed}
						blurOnSubmit={false} 
					/>
					<TextInput
						style = {s.input}
						placeholder = 'Name'
						placeholderTextColor = '#b3b3b3'
						onChangeText = {(text) => this.setState({user_name: text})}
						keyboardType = 'default'
						autoCapitalize = 'words'
						autoCorrect = {false}
						onSubmitEditing = {this._onSignUpButtonPressed}
						blurOnSubmit={false} 
					/>
					<TextInput
						style = {s.input}
						placeholder = 'Password'
						placeholderTextColor = '#b3b3b3'
						onChangeText = {(text) => this.setState({user_pwd: text})}
						keyboardType = 'default'
						autoCapitalize = 'none'
						autoCorrect = {false}
						secureTextEntry= {true}
						onSubmitEditing = {this._onSignUpButtonPressed}
						blurOnSubmit={false} 
					/>
				</KeyboardAvoidingView>
				<View style = {[cs.container, s.signUpContainer]}>
					<Button
						title = 'Sign up'
						color = '#66a3ff'
						onPress = {this._onSignUpButtonPressed}
					/>
				</View>
			</View>
		);
	}
}

const s = StyleSheet.create({
	welcome: {
		flex: 2,
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingTop: '10%',
		width: '100%',
		paddingLeft: '15%',
	},
	welcomeMsg: {
		fontSize: 50,
		color: '#000000',
		fontWeight: 'bold',
	},
	contentContainer: {
		flex: 4,
		width: "100%",
		paddingTop: 0,
		paddingLeft: '10%',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	signUpContainer: {
		flex: 2,
		width: '100%',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		paddingLeft: '13%',

	},
	input: {
		width: 250,
		height: 36,
		padding: 10,
		margin: 10,
		paddingTop: 0,
		fontSize: 18,
		borderBottomWidth: 1,
		borderColor: '#e6e6e6',
	},
})