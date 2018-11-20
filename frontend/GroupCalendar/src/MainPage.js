'use strict';
import React, {Component} from 'react';
import {Text, TextInput, View, StyleSheet, Alert, TouchableWithoutFeedback, 
	ActivityIndicator} from 'react-native';
import cs from './common/CommonStyles';
import Storage from './common/Storage';
import Profile from './Profile';
import Calendar from './Calendar';
import Project from './Project';
import Search from './Search';
import { GoogleSignin } from 'react-native-google-signin';

export default class MainPage extends Component {

	static navigationOptions = {
		header: null,
		gesturesEnabled: false,
	}

	constructor(props) {
		super(props);
		this.state = {
			//calendar is the default content page
			isLoading: true,
			title: 'Calendar',
			buttonColor: {
				calendar: cs.blue,
				project: cs.black,
				profile: cs.black,
				search: cs.black,
			},
		};
		this._onSignOut = this._onSignOut.bind(this);
		this._onSessionOut = this._onSessionOut.bind(this);
		this._switchContent = this._switchContent.bind(this);
	}

	async componentDidMount() {
		try {
			let profile = await Storage.getProfile();
			this.setState ({
				profile,
				isLoading: false,
			});
		} catch (error) {
			Alert.alert('Something went wrong');
			await Storage.deleteAll();
		}
	}

	//this function is invoked on switch button press
	_switchContent = (_name) => {
		this.setState(this._getButtonColorState(_name));
	}

	render() {
		let {isLoading, buttonColor} = this.state;
		if (isLoading) {
			return (
				<View style = {cs.container}>
					<ActivityIndicator size = 'large'/>
				</View>
			);
		}

		return (
			<View style = {cs.container}>		
				{/*Title*/}
				<View style = {[cs.container, s.topBar]}>
					<View style = {s.title}>
						<Text style = {cs.h4}>{this.state.title}</Text>
					</View>
				</View>
				{/*Calendar Display*/}
				<View style = {[cs.container, s.content]}>
					{this._getContent()}
				</View>
				{/*Content Selection*/}
				<View style = {[cs.container, s.bottomBar]}>
					<TouchableWithoutFeedback 
						testID = 'calendarButton'
						onPress = {() => this._switchContent('Calendar')}
					>
						<View style = {s.switchButton}>
						<Text style = {buttonColor.calendar}>
						Calendar</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback 
						testID = 'projectButton'
						onPress = {() => this._switchContent('Project')}
					>
						<View style = {s.switchButton}>
						<Text style = {buttonColor.project}>
						Project</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback 
						testID = 'searchButton'
						onPress = {() => this._switchContent('Search')}
					>
						<View style = {s.switchButton}>
						<Text style = {buttonColor.search}>
						Search</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback 
						testID = 'profileButton'
						onPress = {() => this._switchContent('Profile')}
					>
						<View style = {s.switchButton}>
						<Text style = {buttonColor.profile}>
						Me</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</View>
		);
	}

	//this is used to modify button color on button press
	_getButtonColorState = (_name) => {
		var ret;
		switch (_name) {
			default : 
				ret = {
					title: 'Calendar',
					buttonColor: {
						calendar: cs.blue,
						project: cs.black,
						profile: cs.black,
						search: cs.black,
					}
				};
			case 'Calendar' :
				ret = {
					title: 'Calendar',
					buttonColor: {calendar: cs.blue}};
			break;
			case 'Project' : 
				ret = {
					title: 'Project',
					buttonColor: {project: cs.blue}};
			break;
			case 'Search' : 
				ret = {
					title: 'Search',
					buttonColor: {search: cs.blue}};
			break;
			case 'Profile' : 
				ret = {
					title: 'Profile',
					buttonColor: {profile: cs.blue}};
			break;
			
		}
		return ret;
	}

	//choose which content based on title
	_getContent = () => {
		switch(this.state.title) {
			case 'Calendar' :
				return(<Calendar
					onSignOut = {this._onSignOut}
					onSessionOut = {this._onSessionOut}
					navigation = {this.props.navigation}	
				/>);
			case 'Project' :
				return(<Project
					navigation = {this.props.navigation}
					onSignOut = {this._onSignOut}
					onSessionOut = {this._onSessionOut}
				/>);
			case 'Search' :
				return(<Search/>);
			case 'Profile' :
				return(<Profile 
					onSignOut = {this._onSignOut}
					onSessionOut = {this._onSessionOut}
					navigation = {this.props.navigation}
				/>);
		}
	}

	_onSignOut = async () => {
		try {
			let signInByGoogle = await Storage.getSignInByGoogle();
			
			if(signInByGoogle === 'true') {
				await GoogleSignin.revokeAccess();
				await GoogleSignin.signOut();
			}	
		} catch (error) {
			Alert.alert('Something went wrong when signing out');
		}
		//clean up async storage
		await Storage.deleteAll();
		this.props.navigation.popToTop();
	}

	_onSessionOut = async () => {
		await this._onSignOut();
		Alert.alert('You have Expired the Session Time!');
	}
}


const s = StyleSheet.create({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		margin: 5,
		marginRight: 10,
		width: 100,
		height: 40,
		borderRadius: 5,
	},
	switchButton: {
		width: '25%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	topBar: {
		marginTop: 20,
		flex: 1,
		width: '100%',
		borderBottomWidth: 1,
		borderBottomColor: '#e6e6e6',
	},
	title: {
	},
	content: {
		flex: 8,
		width: '100%',
	},
	bottomBar: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start',
		paddingBottom: 15,
		justifyContent: 'space-between',
		width: '100%',
		borderTopWidth: 1,
		borderTopColor: '#e6e6e6',
	},
});