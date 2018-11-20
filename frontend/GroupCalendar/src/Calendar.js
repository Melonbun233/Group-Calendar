'use strict';
/**
 * This page constructs the calendar
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import cs from './common/CommonStyles';

export default class Calendar extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			
		};
	}

	render() {
		return(
			<View style = {cs.container}>
				<Text style = {cs.normal}>Calendar page is under construction.</Text>
				<Button
					title = 'Sign Out'
					onPress = {this.props.onSignOut}
				/>
			</View> 
		);
	}
}