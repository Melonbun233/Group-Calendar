'use strict';
/**
 * This is the main file for this application
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Login from "./Login";

type Props = {};
export default class App extends Component<Props> {
	constructor(props) {
		super(props);
	  
		this.state = {
			login: false,
			username: '',
			password: '',
		};
		
		this._onSuccessfulLogin = this._onSuccessfulLogin.bind(this);
  	}

	//this handler is called when username and password are correct
	_onSuccessfulLogin = (_username, _password) => {	
  		this.setState({
  			login: true,
  			username: _username,
  			password: _password,
  		});
  	}

	render() {
		if(this.state.login) {
		  return (
		  	<View style = {s.container}>
		  		<Text>You have successfully login!</Text>
		  		<Text>Username : {this.state.username}</Text>
		  		<Text>Password : {this.state.password}</Text>
		  	</View>
		  	);
		} else {
		  return (<Login callback = {this._onSuccessfulLogin} />);
		}
	}
}

const s = StyleSheet.create({
  container: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '#F5FCFF',
  },
});
