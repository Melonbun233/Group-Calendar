'use strict';
/**
 * This page constructs the user profile
 */

import React, {Component} from 'react';
import UserAvatar from 'react-native-user-avatar';
import {Platform, StyleSheet, Text, View, Button, Alert, TouchableWithoutFeedback,
		ScrollView, RefreshControl, ActivityIndicator} from 'react-native';
import cs from './common/CommonStyles';
import Storage from './common/Storage';
import Network from './common/GCNetwork';

export default class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//this only set to true when we have found the user id somehow changed
			//when this is set to false, we will need to log in again
			isRefreshing: false, 
			isLoading: true,
		};
		this._onRefresh = this._onRefresh.bind(this);
		this._onEditProfile = this._onEditProfile.bind(this);
	}

	async componentDidMount() {
		try {
			let profile = await Storage.getProfile();
			//calculate age
			let curr = new Date();
			let userBirth = new Date(profile.userBirth);
			let age = curr.getFullYear() - userBirth.getFullYear();

			this.setState ({
				userBirth,
				age,
				profile,
				isLoading: false,
			});
		} catch (error) {
			Alert.alert(JSON.stringify(error));
		}
	}

	//callback function for refreshing
	_onRefresh = async () => {
		let {profile, cookie} = this.state;

		this.setState({isRefreshing: true});
		let status = await Network.fetchProfile(profile.userId);
		switch(status) {
			case 200: {
				profile = await Storage.getProfile();
				this.setState({profile});
			}
			break;
			//fetch failed, probably user has expired the session
			//we will log out
			case 400:
			case 404: this.props.onSessionOut();
			break;
			default: Alert.alert('HTTP ERROR', JSON.stringify(res.error));
		}
		this.setState({isRefreshing: false});
	}

	//push a new editing page
	_onEditProfile = (_editInfo) => {
		let {userLastname, userFirstname, userId} = this.state.profile;
		let {cookie} = this.state;
		switch(_editInfo){
			case 'username' : {
				this.props.navigation.push('EditProfile', {
					editInfo: {
						userLastname,
						userFirstname
					}, userId
				});
			}
			break;
			case 'userDescription': 
			case 'userRegion':
			case 'userGender':
			case 'userBirth' : {
				var info = this.state.profile[_editInfo];
				var editInfo = {};
				editInfo[_editInfo] = info;
				this.props.navigation.push('EditProfile', {
					editInfo, userId
				});
			}
			break;
			default : Alert.alert('Not support to change this');
		}
	}

	render() { 
		let {isLoading, isRefreshing} = this.state;
		if (isLoading) {
			return (
				<View style = {cs.container}>
					<ActivityIndicator size = 'large'/>
				</View>
			);
		}
		let {userLastname, userFirstname, userDescription, userRegion, userGender,
			userEmail} = this.state.profile;
		let {age, userBirth} = this.state;
		return(
			<View style = {[cs.container, s.content]}>
				<ScrollView 
					style = {s.content}
					refreshControl = {
						<RefreshControl 
							refreshing = {isRefreshing}
							onRefresh = {this._onRefresh}
						/>
					}
				>
				{/*Username*/}
				<TouchableWithoutFeedback 
					testID = 'editUserName'
					onPress = {() => this._onEditProfile('username')}
				>
				<View style = {[cs.container, s.infoContainer]}>
					<View style = {[cs.container, s.nameContainer]}>
						<Text style = {cs.h3}>
						{userFirstname}
						</Text>
						<Text style = {cs.h3}>
						{userLastname}
						</Text>
					</View>
					<View style = {[cs.container, s.avatarContainer]}>
						<UserAvatar 
							size = '80' 
							name = {userFirstname+ ' ' + userLastname}
						/>
					</View>
				</View>
				</TouchableWithoutFeedback>	
				{/*User Email*/}
				<TouchableWithoutFeedback
					testID = 'editUserEmail'
				>
					<View style = {[cs.container, s.infoContainer]}>
						<Text style = {cs.normalText}>
						Email
						</Text>
						<Text style = {cs.h5}>
						{userEmail}
						</Text>
					</View>
				</TouchableWithoutFeedback>
				{/*User Description*/}
				<TouchableWithoutFeedback 
					testID = 'editUserDescription'
					onPress = {() => this._onEditProfile('userDescription')}
				>
					<View style = {[cs.container, s.generalContainer]}>
						<Text style = {cs.normalText}>
						What's up
						</Text>
						<View style = {[cs.container, s.descriptionContainer]}>
							<Text style = {cs.h5}>
							{userDescription}
							</Text>
						</View>
					</View>
				</TouchableWithoutFeedback>
				{/*Region*/}
				<TouchableWithoutFeedback 
					testID = 'editUserRegion'
					onPress = {() => this._onEditProfile('userRegion')}
				>
					<View style = {[cs.container, s.infoContainer]}>
						<Text style = {cs.normalText}>
						Region
						</Text>
						<Text style = {cs.h5}>
						{userRegion}
						</Text>
					</View>
				</TouchableWithoutFeedback>
				{/*age*/}
				<TouchableWithoutFeedback
					testID = 'editUserAge'
				>
					<View style = {[cs.container, s.infoContainer]}>
						<Text style = {cs.normalText}>
						Age
						</Text>
						<Text style = {cs.h5}>
						{age}
						</Text>
					</View>
				</TouchableWithoutFeedback>
				{/*gender*/}
				<TouchableWithoutFeedback 
					testID = 'editUserGender'
					onPress = {() => this._onEditProfile('userGender')}
				>
					<View style = {[cs.container, s.infoContainer]}>
						<Text style = {cs.normalText}>
						Gender
						</Text>
						<Text style = {cs.h5}>
						{userGender === '1' ? 'Male' : 'Female'}
						</Text>
					</View>
				</TouchableWithoutFeedback>
				{/*birth day*/}
				<TouchableWithoutFeedback 
					testID = 'editUserBirth'
					onPress = {() => this._onEditProfile('userBirth')}
				>
					<View style = {[cs.container, s.infoContainer]}>
						<Text style = {cs.normalText}>
						Birth Day
						</Text>
						<Text style = {cs.h5}>
						{userBirth.toDateString()}
						</Text>
					</View>
				</TouchableWithoutFeedback>
				{/*log out button*/}
					<View style = {[cs.container, cs.flowLeft]}>
						<View style = {[cs.container, s.buttonContainer]}>
							<Button 
								testID = 'signOutButton'
								title = 'Sign out'
								color = '#66a3ff'
								onPress = {() => this.props.onSignOut()}
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
	generalContainer: {
		alignItems: 'flex-start',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e6e6e6',
	},
	infoContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e6e6e6',
	},
	descriptionContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		padding: 10,
	},
	nameContainer: {
		alignItems: 'flex-start',
	},
	avatarContainer: {
		alignItems: 'flex-end',
	},
});