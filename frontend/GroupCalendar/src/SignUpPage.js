//this page is used for sign up
//this should be navigated from introPage
import React, {Component} from 'react';
import {StyleSheet, TextInput, Text, View, Button} from 'react-native';
import cs from './common/CommonStyles';
import validate from 'validate.js';


export default class SignUpPage extends Component {
	static navigationOptions = {
		title: 'Sign up',
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
				<Text style = {cs.normalText}>This page is under construction</Text>
			</View>
		);
	}
}