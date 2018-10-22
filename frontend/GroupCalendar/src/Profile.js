'use strict';
/**
 * This page constructs the user profile
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import cs from './common/CommonStyles';

export default class Profile extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			user_email: '',
			user_descript: '',
		};
	}

	render() {
		return(
			<View style = {cs.container}>
				<Text style = {cs.normal}>Profile page is under construction.</Text>
			</View> 
		);
	}
}