'use strict';
//this page is only used for displaying profile

import React, {Component} from 'react';
import UserAvatar from 'react-native-user-avatar';
import {StyleSheet, Text, View, Button, Alert, TouchableWithoutFeedback,
		ScrollView, RefreshControl, ActivityIndicator, AlertIOS} from 'react-native';
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
	}

	async componentDidMount() {
		try {
            let userId = this.props.navigation.getParam('userId', null);
            if (!userId) {
                Alert.alert('Something went wrong');
                this.props.navigation.goBack();
            }
            let response = await Network.searchProfile(userId);
            var profile;
            switch (response.status) {
                case 200: {
                    profile = response.profile;
                }
                break;
                default: {
                    Alert.alert('HTTP ERROR ' + response.status.toString());
                    this.props.navigation.goBack();
                }
            }
			//calculate age
			let curr = new Date();
			let userBirth = new Date(profile.userBirth);
			let age = curr.getFullYear() - userBirth.getFullYear();
			if (isNaN(age)) {
				age = ' ';
			}
			this.setState ({
				age,
				profile,
				isLoading: false,
			});
		} catch (error) {
			Alert.alert(error.toString());
		}
	}

	//callback function for refreshing
	_onRefresh = async (animating) => {
		let {profile} = this.state;

		if (animating){
			this.setState({isRefreshing: true});
		}
		try {
			let response = await Network.searchProfile(profile.userId);
			switch(response.status) {
				case 200: {
					profile = response.profile;
					let curr = new Date();
					let userBirth = new Date(profile.userBirth);
                    let age = curr.getFullYear() - userBirth.getFullYear();
                    if (isNaN(age)) {
                        age = ' ';
                    }
					this.setState({profile, age});
				}
				break;
				default: {
                    Alert.alert('HTTP ERROR ' + response.status.toString());
                    this.props.navigation.goBack();
				}
			}
		} catch(error) {
			Alert.alert(error.toString());
		}
		if (animating) {
			this.setState({isRefreshing: false});
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
			userEmail, userBirth} = this.state.profile;
		let {age} = this.state;
		return(
			<View style = {[cs.container, s.content]}>
				<ScrollView 
					style = {s.content}
					refreshControl = {
						<RefreshControl 
							refreshing = {isRefreshing}
							onRefresh = {() => this._onRefresh(true)}
						/>
					}
				>
				{/*Username*/}
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
				{/*Region*/}
                <View style = {[cs.container, s.infoContainer]}>
                    <Text style = {cs.normalText}>
                    Region
                    </Text>
                    <Text style = {cs.h5}>
                    {userRegion}
                    </Text>
                </View>
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
                <View style = {[cs.container, s.infoContainer]}>
                    <Text style = {cs.normalText}>
                    Gender
                    </Text>
                    <Text style = {cs.h5}>
                    {userGender}
                    </Text>
                </View>
				{/*birth day*/}
                <View style = {[cs.container, s.infoContainer]}>
                    <Text style = {cs.normalText}>
                    Birth Day
                    </Text>
                    <Text style = {cs.h5}>
                    {userBirth ? userBirth.substr(0, 10) : ''}
                    </Text>
                </View>
				<View style = {cs.empty}></View>
				</ScrollView>
			</View> 
		);
	}
}

const s = StyleSheet.create({
	content: {
		width: '100%',
	},
	allButtons: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 10,
		backgroundColor: '#f2f2f2',
	},
	button: {
		padding: 10,
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-end',
		backgroundColor: '#f2f2f2',
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