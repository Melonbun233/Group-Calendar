'use strict';
/**
 * This page constructs the project view
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import cs from './common/CommonStyles';

export default class Project extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
		};
	}

	render() {
		return(
			<View style = {cs.container}>
				<Text style = {cs.normal}>Project page is under construction.</Text>
			</View> 
		);
	}
}