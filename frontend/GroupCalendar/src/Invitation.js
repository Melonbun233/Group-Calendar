'use strict';
/**
 * This page constructs the invitation view
 */

import React, {Component} from 'react';
import {AlertIOS, StyleSheet, Text, View, Button, Alert, 
	RefreshControl, ActivityIndicator, FlatList, ScrollView, TouchableOpacity} 
	from 'react-native';
import cs from './common/CommonStyles';
import Network from './common/GCNetwork';
import Storage from './common/Storage';
import SwipeOut from 'react-native-swipeout';

export default class Invitation extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			//refresh user's project list
			isRefreshing: false,
			//loading user's project list when first enter
			isLoading: true,
			extraData: false,
		};
	}

	//fetch user's invitation
	async componentDidMount() {
		var allInvitations;
		try{
			let profile = await Storage.getProfile();
			if (!profile) {
				Alert.alert('Something went wrong');
				this.props.onSessionOut();
			}

			let status = await Network.fetchAllInvitations(profile.userId);
			switch (status) {
				case 200:
				break;
				case 0: {
					Alert.alert('Not all invitations fetched');
				}
				break;
				default: Alert.alert('Internet Error ' + status.toString());
			}
			allInvitations = await Storage.getAllInvitations();
			
			this.setState({
				profile,
				allInvitations,
				isLoading: false,
			})
		} catch (error) {
			Alert.alert(JSON.stringify(error));
		}
	}

	async _onRefresh(animating) {
		let {profile} = this.state;
		var allInvitations;
		if (animating) {
			this.setState({isRefreshing: true});
		}
		try {
			let status = await Network.fetchAllInvitations(profile.userId);
			switch (status) {
				case 200:
				break;
				case 0: {
					Alert.alert('Not all invitations fetched');
				}
				break;
				default: Alert.alert('Internet Error ' + status.toString());
			}
			allInvitations = await Storage.getAllInvitations();
			this.setState({allInvitations});
		} catch (error) {
			Alert.alert(error.toString());
		}
		if (animating) {
			this.setState({isRefreshing: false});
		}
	}

	async _onRejectInvitation(projectId) {
		let {profile, allInvitations, extraData} = this.state;
		try {
			//for user experence set state here
			for (let key in allInvitations) {
				let value = allInvitations[key];
				if (value.projectId == projectId) {
					allInvitations.splice(key, 1);
				}
				this.setState({allInvitations, extraData: !extraData});
				break;
			}

			let status = await Network.rejectInvitation(projectId, profile.userId);
			if (status != 200) {
				Alert.alert('Internet Error ' + status.toString());
			}
			await this._onRefresh(false);
		} catch (error) {
			Alert.alert(error.toString());
		}
	}

	async _onAccetpInvitation(projectId) {
		let {profile, allInvitations, extraData} = this.state;
		try {
			//for user experience set state here
			for (let key in allInvitations) {
				let value = allInvitations[key];
				if (value.projectId == projectId) {
					allInvitations.splice(key, 1);
					this.setState({allInvitations, extraData: !extraData});
					break;
				}
			}

			let status = await Network.acceptInvitation(projectId, profile.userId);
			if (status != 200) {
				Alert.alert('Internet Error ' + status.toString());
			}
			await this._onRefresh(false);
		} catch (error) {
			Alert.alert(error.toString());
		}
	}

	_renderItem({item}) {
		let button = [{
			backgroundColor: 'red',
			underlayColor: 'red',
            color: 'white',
            text: 'DELETE',
            onPress: () => {
				this._onRejectInvitation(item.projectId);
			}
		}];
		return (
			<SwipeOut
                right = {button}
                autoClose = {true}
            >
			<View style = {s.contentContainer}>
				<View style = {s.project}>
				<Text style = {[cs.smallText, {padding: 5}]}>Invitation from project</Text>
				<Text style = {[cs.normalText, {padding: 5}]}>{item.projectName}</Text>
				</View>
				<View style = {s.button}>
					<Button
						testID = 'acceptButton'
						title = 'Accept'
						onPress = {() => {
							this._onAccetpInvitation(item.projectId);
						}}
					/>
				</View>
			</View>
			</SwipeOut>
		);
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
		let {allInvitations, extraData} = this.state;
		let emptyMsg = (
			<View style = {[cs.container, {paddingTop: '20%', paddingBottom: '30%'}]}>
				<Text style = {cs.h5}>You don't have any invitation</Text>
			</View>
		);

		return (
			<ScrollView 
				style = {s.scrollContainer}
				keyboardShouldPersistTaps = 'never'	
				refreshControl = {
				<RefreshControl
					refreshing = {isRefreshing}
					onRefresh = {() => this._onRefresh(true)}
				/>
				}
			>
			<FlatList
					data = {allInvitations}
					renderItem = {this._renderItem.bind(this)}
					keyExtractor = {(item) => item.projectId.toString()}
					extraData = {extraData}
				/>
				{!allInvitations || allInvitations.length == 0 ? emptyMsg : null}
				<View style = {cs.empty}></View>
			</ScrollView>
		);
	}
}
const s = StyleSheet.create({
	scrollContainer: {
		backgroundColor: '#ffffff',
		width: '100%',
		height: '100%',
	},
	button: {
		padding: 10,
		alignItems: 'center',
	},
	project: {
		padding:10,
		alignItems: 'flex-start',
	},
	contentContainer: {
		paddingLeft: 5,
		paddingRight: 5,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#e6e6e6',
		backgroundColor: 'white',
	},
	invitationContent: {
		padding: 10,
	},
	invitation: {
		flex: 3,
		flexDirection: 'column',
	},
})