'use strict';
/**
 * This page constructs the user profile
 */

import React, {Component} from 'react';
import UserAvatar from 'react-native-user-avatar';
import {Platform, StyleSheet, Text, View, Button, Alert, TouchableWithoutFeedback,
		ScrollView, RefreshControl, AsyncStorage, ActivityIndicator} from 'react-native';
import cs from './common/CommonStyles';
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
			let cookie = await AsyncStorage.getItem('cookie')
			//	.then((res) => JSON.parse(res));
			let profile = await AsyncStorage.getItem('profile')
				.then((res) => JSON.parse(res));
			//calculate age
			let curr = new Date();
			let userBirth = new Date(profile.userBirth);
			let age = curr.getFullYear() - userBirth.getFullYear();

			this.setState ({
				userBirth,
				age,
				profile,
				cookie,
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
		let res = await Network.fetchProfile(profile.userId, cookie);
		switch(res.status) {
			case 200: this.setState({profile: res.profile});
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
		let {userLastname, userFirstname} = this.state.profile;
		let {cookie} = this.state;
		switch(_editInfo){
			case 'username' : {
				this.props.navigation.navigate('EditProfile', {
					editInfo: {
						userLastname,
						userFirstname
					}, cookie
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
				this.props.navigation.navigate('EditProfile', {
					editInfo, cookie,
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
					<ActivityIndicator size = 'large' animating = {false}/>
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
					onPress = {() => this._onEditProfile('username')}
				>
				<View style = {[cs.container, s.infoContainer]}>
					<View style = {[cs.container, s.nameContainer]}>
						<Text style = {cs.h3}>
						{userLastname}
						</Text>
						<Text style = {cs.h3}>
						{userFirstname}
						</Text>
					</View>
					<View style = {[cs.container, s.avatarContainer]}>
						<UserAvatar 
							size = '80' 
							name = {userLastname + ' ' + userFirstname}
						/>
					</View>
				</View>
				</TouchableWithoutFeedback>	
				{/*User Email*/}
					<View style = {[cs.container, s.infoContainer]}>
						<Text style = {cs.normalText}>
						Email
						</Text>
						<Text style = {cs.h5}>
						{userEmail}
						</Text>
					</View>
				{/*User Description*/}
				<TouchableWithoutFeedback 
					onPress = {() => this._onEditProfile('userDescription')}
				>
					<View style = {[cs.container, s.generalContainer]}>
						<Text style = {cs.normalText}>
						What's up
						</Text>
						<View style = {cs.container, s.descriptionContainer}>
							<Text style = {cs.h5}>
							{userDescription}
							</Text>
						</View>
					</View>
				</TouchableWithoutFeedback>
				{/*Region*/}
				<TouchableWithoutFeedback 
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
					<View style = {[cs.container, s.infoContainer]}>
						<Text style = {cs.normalText}>
						Age
						</Text>
						<Text style = {cs.h5}>
						{age}
						</Text>
					</View>
				{/*gender*/}
				<TouchableWithoutFeedback 
					onPress = {() => this._onEditProfile('userGender')}
				>
					<View style = {[cs.container, s.infoContainer]}>
						<Text style = {cs.normalText}>
						Gender
						</Text>
						<Text style = {cs.h5}>
						{userGender === 1 ? "Male" : "Female"}
						</Text>
					</View>
				</TouchableWithoutFeedback>
				{/*birth day*/}
				<TouchableWithoutFeedback 
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