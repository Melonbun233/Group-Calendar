'use strict';
/**
 * This page constructs the search view
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import cs from './common/CommonStyles';

export default class Search extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
		};
	}

	render() {
		return(
			<View style = {cs.container}>
				<Text style = {cs.normal}>Search page is under construction.</Text>
			</View> 
		);
	}
}