'use strict';
import React, {Component} from 'react';
import {Text, TextInput, View, StyleSheet, Alert, TouchableWithoutFeedback, 
	ActivityIndicator, Image} from 'react-native';
import cs from './common/CommonStyles';
import Storage from './common/Storage';
import Profile from './Profile';
import Calendar from './Agenda';
import Project from './Project';
import Invitation from './Invitation';
import { GoogleSignin } from 'react-native-google-signin';
import SvgUri from 'react-native-svg-uri';
import Network from './common/GCNetwork';

export default class MainPage extends Component {

	static navigationOptions = {
		header: null,
		gesturesEnabled: false,
	}

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			title: 'Agenda',
			buttonColor: {
				agenda: cs.blue,
				project: cs.black,
				profile: cs.black,
				invitation: cs.black,
			},
		};
		this._onSignOut = this._onSignOut.bind(this);
		this._onSessionOut = this._onSessionOut.bind(this);
		this._switchContent = this._switchContent.bind(this);
	}

	componentDidMount = async () => {
		let profile = await Storage.getProfile();
		await Network.fetchProfile(profile.userId);
		profile = await Storage.getProfile();
		this.setState({isLoading: false});
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
		let {title} = this.state;
		let agendaIcon = title == 'Agenda' ? 
		<SvgUri width = {24} height = {24} source = {require('../img/calendar-color.svg')}/> : 
		<SvgUri width = {24} height = {24} source = {require('../img/calendar.svg')}/>;

		let projectIcon = title == 'Project' ?
		<SvgUri width = {24} height = {24} source = {require('../img/project-color.svg')}/> : 
		<SvgUri width = {24} height = {24} source = {require('../img/project.svg')}/>;

		let invitationIcon = title == 'Invitation' ?
		<SvgUri width = {24} height = {24} source = {require('../img/invitation-color.svg')}/> : 
		<SvgUri width = {24} height = {24} source = {require('../img/invitation.svg')}/>;

		let profileIcon = title == 'Profile' ?
		<SvgUri width = {24} height = {24} source = {require('../img/profile-color.svg')}/> : 
		<SvgUri width = {24} height = {24} source = {require('../img/profile.svg')}/>;

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
						testID = 'agendaButton'
						onPress = {() => this._switchContent('Agenda')}
					>
						<View style = {s.switchButton}>
						{agendaIcon}
						<Text style = {[buttonColor.agenda, {paddingTop:4,fontSize:10}]}>
						Agenda</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback 
						testID = 'projectButton'
						onPress = {() => this._switchContent('Project')}
					>
						<View style = {s.switchButton}>
						{projectIcon}
						<Text style = {[buttonColor.project, {paddingTop:4,fontSize:10}]}>
						Project</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback 
						testID = 'invitationButton'
						onPress = {() => this._switchContent('Invitation')}
					>
						<View style = {s.switchButton}>
						{invitationIcon}
						<Text style = {[buttonColor.invitation, {paddingTop:4,fontSize:10}]}>
						Invitation</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback 
						testID = 'profileButton'
						onPress = {() => this._switchContent('Profile')}
					>
						<View style = {s.switchButton}>
						{profileIcon}
						<Text style = {[buttonColor.profile, {paddingTop:4,fontSize:10}]}>
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
					title: 'Agenda',
					buttonColor: {
						agenda: cs.blue,
						project: cs.black,
						profile: cs.black,
						invitation: cs.black,
					}
				};
			case 'Agenda' :
				ret = {
					title: 'Agenda',
					buttonColor: {agenda: cs.blue}};
			break;
			case 'Project' : 
				ret = {
					title: 'Project',
					buttonColor: {project: cs.blue}};
			break;
			case 'Invitation' : 
				ret = {
					title: 'Invitation',
					buttonColor: {invitation: cs.blue}};
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
			case 'Agenda' :
				return(<Calendar
					onSignOut = {this._onSignOut.bind(this)}
					onSessionOut = {this._onSessionOut.bind(this)}
					navigation = {this.props.navigation}	
				/>);
			case 'Project' :
				return(<Project
					navigation = {this.props.navigation}
					onSignOut = {this._onSignOut.bind(this)}
					onSessionOut = {this._onSessionOut.bind(this)}
				/>);
			case 'Invitation' :
				return(<Invitation
					navigation = {this.props.navigation}
					onSignOut = {this._onSignOut.bind(this)}
					onSessionOut = {this._onSessionOut.bind(this)}
				/>);
			case 'Profile' :
				return(<Profile 
					onSignOut = {this._onSignOut.bind(this)}
					onSessionOut = {this._onSessionOut.bind(this)}
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
			//clean up async storage
			await Storage.deleteAll();
		} catch (error) {
			Alert.alert('Something went wrong when signing out');
		}
		this.props.navigation.popToTop();
	}

	_onSessionOut = async () => {
		await this._onSignOut();
		Alert.alert('You have expired the session time', 'Please sign in again');
	}
}


const s = StyleSheet.create({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 5,
		marginRight: 10,
		width: 100,
		height: 40,
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
	icon: {
		padding:2,
	}
});