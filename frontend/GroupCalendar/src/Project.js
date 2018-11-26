'use strict';
/**
 * This page constructs the project view
 */

import React, {Component} from 'react';
import {TouchableWithoutFeedback, StyleSheet, Text, View, Button, Alert, 
	RefreshControl, ActivityIndicator, FlatList, ScrollView, TouchableOpacity} 
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
			extraData: false,
		};
		this._onPressProject = this._onPressProject.bind(this);
	}

	//fetch user's projects
	async componentDidMount() {
		try{
			let profile = await Storage.getProfile();
			if (!profile) {
				Alert.alert('Something went wrong');
				this.props.onSessionOut();
			}
			this.setState({profile});
			let allProjects = await Storage.getAllProjects();

			if (allProjects) {
				this.setState({
					allProjects,
				});
			} else {
				await this._onRefresh();
			}
			this.setState({
				isLoading: false,
			})
		} catch (error) {
			Alert.alert(JSON.stringify(error));
		}
	}

	async _onRefresh() {
		let {profile, extraData} = this.state;
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
			this.setState({
				allProjects,
				isRefreshing: false,
				extraData: !extraData,
			});
		} catch (error) {
			Alert.alert(error.toString());
		}
	}

	_onPressProject = (project) => {
		let {profile} = this.state;
		let {projectId} = project;
		this.props.navigation.push('ProjectDetail', {
			projectId, profile, 
			refreshAll: this._onRefresh.bind(this)});
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

	_getOwnerProjects() {
		let {allProjects, profile} = this.state;
		var ownerProjects = [];
		for (let key in allProjects) {
			let value = allProjects[key];
			if (value.projectOwnerId == profile.userId) {
				ownerProjects.push(value);
			}
		}
		return ownerProjects;
	}

	_getMemberProjects() {
		let {allProjects, profile} = this.state;
		var memberProjects = [];
		for (let key in allProjects) {
			let value = allProjects[key];
			if (value.projectOwnerId != profile.userId) {
				memberProjects.push(value);
			}
		}
		return memberProjects;
	}

	render() {
		let {isLoading, isRefreshing, extraData} = this.state;
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

		let	ownerProjects = this._getOwnerProjects();
		let memberProjects = this._getMemberProjects();

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
				{/* User's project */}
				{ownerProjects.length != 0 ? 
				<View style = {s.membership}>
					<Text style = {[cs.h5, {fontStyle: "italic"}]}>You are the owner</Text>
				</View> : null}
				<FlatList
					data = {ownerProjects}
					renderItem = {this._renderItem.bind(this)}
					keyExtractor = {(item) => item.projectId.toString()}
					extraData = {extraData}
				/>
				{/* projects belonged */}
				{memberProjects.length != 0 ? 
				<View style = {s.membership}>
					<Text style = {[cs.h5, {fontStyle: "italic"}]}>You are the member</Text>
				</View> : null}
				<FlatList
					data = {memberProjects}
					renderItem = {this._renderItem.bind(this)}
					keyExtractor = {(item) => item.projectId.toString()}
					extraData = {extraData}
				/>
				{!allProjects || allProjects.length == 0 ? emptyMsg : null}
				<View style = {[s.button]}>
				<Button
					style = {s.button}
					testID = 'createProjectButton'
					title = 'New Project'
					color = '#66a3ff'
					onPress = {() => navigation.push('CreateProject', {
						profile, refreshAll: this._onRefresh.bind(this)})}
				/>
				</View>
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
	contentContainer: {
		flexDirection: 'row',
		padding: 10,
		borderBottomWidth: 1,
		borderColor: '#e6e6e6',
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
	},
	membership: {
		padding: 10,
		paddingLeft: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		borderBottomWidth: 1,
		borderColor: '#e6e6e6',
		backgroundColor: '#f2f2f2',
	}
});