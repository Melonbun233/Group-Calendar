'use strict';
/**
 * This page constructs the user profile
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, 
		ScrollView, RefreshControl} from 'react-native';
import cs from './common/CommonStyles';
import Network from './common/GCNetwork'

export default class Profile extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			//this only set to true when we have found the user id somehow changed
			//when this is set to false, we will need to log in again
			logInfoChanged: false,
			isRefreshing: false, 
			profile: {},
		}
	}

	//callback function for refreshing
	_onRefresh = () => {
		this.setStatus({isRefreshing: true});
		var response = Network.fetchProfile(this.props.user.user_id);
		switch(response.statue) {
			case 200: this.setStatus(response.profile);
			break;
			case 0:
			case 400:
			case 404: this.setStatus({logInfoChanged: true});
			break;
			default: {
				Alert.alert("HTTP ERROR", JSON.stringify(response.status));
				this.setStatus(logInfoChanged: true);
			}
		}
		this.setStatus({isRefreshing: false});
	}

	render() {
		return(
			<View style = {[cs.container, s.content]}>
				<ScrollView 
					style = {s.content}
					refreshControl = {
						<RefreshControl 
							refreshing = {this.state.isRefreshing}
							onRefresh = {() => this._onRefresh}
						/>
					}
				>
					{/*Username and email*/}
					<View style = {[cs.container, s.userNameContainer]}>
						<Text style = {cs.h2}>{this.props.user.user_name}</Text>
						<Text style = {cs.h5}>{this.props.user.user_email}</Text>
					</View>
					{/*gender*/}
					{/*log out button*/}
					<View style = {[cs.container, cs.flowLeft]}>
						<View style = {[cs.container, s.buttonContainer]}>
							<Button 
								title = 'Sign out'
								color = '#66a3ff'
								onPress = {this.props.onSignOut}
							/>
						</View>
					</View>
				</ScrollView>
			</View> 
		);
	}
}

const s = StyleSheet.create({
	content: {
		width: '100%',
	},
	buttonContainer: {
		width: 50,
		height: 40,
	},
	userNameContainer: {
		alignItems: 'flex-start',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e6e6e6',
	},
	generalContainer: {
		justifyContent: 'space-between',
	},
});