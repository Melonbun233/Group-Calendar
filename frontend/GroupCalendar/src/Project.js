'use strict';
/**
 * This page constructs the project view
 */

import React, {Component} from 'react';
import {TouchableWithoutFeedback, StyleSheet, Text, View, Button, Alert, 
	RefreshControl, AsyncStorage, ActivityIndicator, FlatList, ScrollView} 
	from 'react-native';
import cs from './common/CommonStyles';
import UserAvatar from 'react-native-user-avatar';
import Network from './common/GCNetwork';

export default class Project extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			//refresh user's project list
			isRefreshing: false,
			//loading user's project list when first enter
			isLoading: true,
			project:[
				{
					projectId: 1,
					projectName: 'Apple',
					projectOwnerId: 1,
					projectDescription: 'This is an apple'
				},
				{
					projectId: 2,
					projectName: 'Banana',
					projectOwnerId: 1,
					projectDescription: 'This is a banana'
				},
				{
					projectId: 3,
					projectName: 'Sushi',
					projectOwnerId: 1,
					projectDescription: 'This is a sushi'
				}
			],
		};
		this._onRefresh = this._onRefresh.bind(this);
		this._renderItem = this._renderItem.bind(this);
		this._getProject = this._getProject.bind(this);
	}

	//fetch user's projects
	async componentDidMount() {
		try{
			let cookie = await AsyncStorage.getItem('cookie');
			let profile = await AsyncStorage.getItem('profile')
				.then((res) => JSON.parse(res));
				
			this.setState({
				cookie,
				profile,
				isLoading: false,
			})
		} catch (error) {
			Alert.alert(JSON.stringify(error));
		}
	}

	_renderItem({item}) {
		return (
			<TouchableWithoutFeedback
				testID = {item.projectName}
			>
			<View style = {s.contentContainer}>
				<View style = {s.project}>
					<View style = {s.projectContent}>
					<Text style = {cs.h4}>{item.projectName}</Text>
					</View>
					<View style = {s.projectContent}>
					<Text style = {cs.normalText}>{item.projectDescription}</Text>
					</View>
				</View>
				<View style = {s.avatar}>
					<UserAvatar
						size = '80'
						name = {item.projectName}
					/>
				</View>
			</View>
			</TouchableWithoutFeedback>
		);
	}

	async _onRefresh() {
		let {profile} = this.state;
		var projectId;
		var project = [];
		this.setState({isRefreshing: true});
		try {
			let res = await Network.fetchProjectId(profile.userId);
		} catch (error) {
			Alert.alert(error);
		}
		this.setState({isRefreshing: false});
	}

	async _getProject(projectId) {
		for (var i = 0; i < projectId.length; i ++) {

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
		let {project, profile} = this.state;
		let {navigation} = this.props;
		return(
			<ScrollView 
				style = {s.scrollContainer}
				keyboardShouldPersistTaps = 'never'	
				refreshControl = {
				<RefreshControl
					refreshing = {isRefreshing}
					onRefresh = {this._onRefresh}
				/>
				}
			>
				<View style = {s.button}>
				<Button
					style = {s.button}
					testID = 'createProjectButton'
					title = 'New Project'
					color = '#66a3ff'
					onPress = {() => navigation.push('CreateProject', {profile})}
				/>
				</View>
				<FlatList
					data = {project}
					renderItem = {this._renderItem}
					keyExtractor = {(item, index) => item.projectId.toString()}
				/>
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
		alignItems: 'flex-start',
		borderBottomWidth: 1,
		borderBottomColor: '#e6e6e6',
	},
	contentContainer: {
		flexDirection: 'row',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#e6e6e6',
	},
	projectContent: {
		padding: 10,
	},
	project: {
		flex: 3,
		flexDirection: 'column',
	},
	avatar: {
		flex:1,
		paddingRight: 30,
	}
})