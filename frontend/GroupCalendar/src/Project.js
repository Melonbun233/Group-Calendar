'use strict';
/**
 * This page constructs the project view
 */

import React, {Component} from 'react';
import {TouchableWithoutFeedback, StyleSheet, Text, View, Button, Alert, 
	RefreshControl, ActivityIndicator, FlatList, ScrollView} 
	from 'react-native';
import cs from './common/CommonStyles';
import UserAvatar from 'react-native-user-avatar';
import Network from './common/GCNetwork';
import Storage from './common/Storage';

export default class Project extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			//refresh user's project list
			isRefreshing: false,
			//loading user's project list when first enter
			isLoading: true,
		};
		this._onPressProject = this._onPressProject.bind(this);
	}

	//fetch user's projects
	async componentDidMount() {
		try{
			let profile = await Storage.getProfile();
			this.setState({
				profile
			});

			await this._onRefresh();
			this.setState({
				isLoading: false,
			})
		} catch (error) {
			Alert.alert(JSON.stringify(error));
		}
	}

	_onPressProject = (project) => {
		let {profile} = this.state;
		this.props.navigation.push('ProjectDetail', {project, profile});
	}

	_renderItem({item}) {
		return (
			<TouchableWithoutFeedback
				testID = {item.projectName}
				onPress = {() => this._onPressProject(item)}
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
		var allProjects;
		this.setState({isRefreshing: true});
		try {
			let status = await Network.fetchAllProjects(profile.userId);
			allProjects = await Storage.getAllProjects();
			switch (status) {
				case 200: 
				break;
				case 0: {
					Alert.alert('Not all projects fetched');
				}
				break;
				default: Alert.alert('Internet Error ' + status.toString());
			}
		} catch (error) {
			Alert.alert(error.toString());
		}
		this.setState({
			allProjects,
			isRefreshing: false
		});
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
		let {allProjects, profile} = this.state;
		let {navigation} = this.props;
		let emptyMsg = (
			<View style = {[cs.container, {paddingTop: '20%', paddingBottom: '30%'}]}>
				<Text style = {cs.h5}>You don't have any project yet</Text>
			</View>
		);
		return(
			<ScrollView 
				style = {s.scrollContainer}
				keyboardShouldPersistTaps = 'never'	
				refreshControl = {
				<RefreshControl
					refreshing = {isRefreshing}
					onRefresh = {this._onRefresh.bind(this)}
				/>
				}
			>
				<FlatList
					data = {allProjects}
					renderItem = {this._renderItem.bind(this)}
					keyExtractor = {(item) => item.projectId.toString()}
				/>
				{allProjects.length == 0 ? emptyMsg : null}
				<View style = {[s.button]}>
				<Button
					style = {s.button}
					testID = 'createProjectButton'
					title = 'New Project'
					color = '#66a3ff'
					onPress = {() => navigation.push('CreateProject', {profile})}
				/>
				</View>
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