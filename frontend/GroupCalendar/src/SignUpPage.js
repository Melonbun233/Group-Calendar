//this page is used for sign up
//this should be navigated from introPage
import React, {Component} from 'react';
import {StyleSheet, TextInput, Text, View, Button} from 'react-native';
import cs from './common/CommonStyles';
import validate from 'validate.js';


export default class SignUpPage extends Component {
	static navigationOptions = {
	}

	constructor(props) {
		super(props);
	
		this.state = {
			user: {}
		};
	}
	render() {
		return (
			<View style = {cs.container}>
				<View style = {[cs.container, s.welcome]}>
					<Text style = {s.welcomeMsg}>Welcome</Text>
				</View>
				<View style = {[cs.container, s.contentContainer]}>
					<TextInput
						style = {s.input}
						placeholder = 'Email'
						placeholderTextColor = '#b3b3b3'
					/>
					<TextInput
						style = {s.input}
						placeholder = 'Username'
						placeholderTextColor = '#b3b3b3'
					/>
					<TextInput
						style = {s.input}
						placeholder = 'Password'
						placeholderTextColor = '#b3b3b3'
					/>
				</View>
				<View style = {[cs.container, s.signUpContainer]}>
				</View>
			</View>
		);
	}
}

const s = StyleSheet.create({
	welcome: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: '10%',
		width: '100%',
	},
	welcomeMsg: {
		fontSize: 40,
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
	input: {
		width: 250,
		height: 36,
		padding: 10,
		margin: 3,
		fontSize: 18,
		borderBottomWidth: 1,
		borderColor: '#e6e6e6',
	},
})