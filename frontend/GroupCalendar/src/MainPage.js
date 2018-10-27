'use strict';
import React, {Component} from 'react';
import {Text, TextInput, View, StyleSheet, 
	Alert, Button, TouchableWithoutFeedback} 
	from 'react-native';
import cs from './common/CommonStyles';
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
		var user = this.props.navigation.getParam('user', 'user');
		this.state = {
	  		//calendar is the default content page
	  		title: 'Calendar',
	  		buttonColor: {
	  			calendar: '#66a3ff',
	  			project: '#000000',
	  			profile: '#000000',
	  			search: '#000000',
	  		},
	  		user,
		};

		this._onSignOut = this._onSignOut.bind(this);
	}

	componentDidMount() {
		
	}
	//this function is invoked on switch button press
	_switchContent = (_name) => {
		this.setState(this._getButtonColorState(_name));
	}

	render() {
		return (
			<View style = {cs.container}>		
				{/*Title*/}
				<View style = {[cs.container, s.topBar]}>
					<View style = {s.title}>
						<Text style = {cs.h3}>{this.state.title}</Text>
					</View>
				</View>
				{/*Calendar Display*/}
				<View style = {[cs.container, s.content]}>
					{this._getContent()}
				</View>
				{/*Content Selection*/}
				<View style = {[cs.container, s.bottomBar]}>
					<TouchableWithoutFeedback 
						onPress = {() => this._switchContent('Calendar')}
					>
						<View style = {s.switchButton}>
						<Text style = {{color: this.state.buttonColor.calendar}}>
						Calendar</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback 
						onPress = {() => this._switchContent('Project')}
					>
						<View style = {s.switchButton}>
						<Text style = {{color: this.state.buttonColor.project}}>
						Project</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback 
						onPress = {() => this._switchContent('Search')}
					>
						<View style = {s.switchButton}>
						<Text style = {{color: this.state.buttonColor.search}}>
						Search</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback 
						onPress = {() => this._switchContent('Profile')}
					>
						<View style = {s.switchButton}>
						<Text style = {{color: this.state.buttonColor.profile}}>
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
						calendar: '#66a3ff',
			  			project: '#000000',
			  			profile: '#000000',
			  			search: '#000000',
					}
				};
			case 'Calendar' :
				ret = {
					title: 'Calendar',
					buttonColor: {calendar: '#66a3ff'}};
			break;
			case 'Project' : 
				ret = {
					title: 'Project',
					buttonColor: {project: '#66a3ff'}};
			break;
			case 'Search' : 
				ret = {
					title: 'Search',
					buttonColor: {search: '#66a3ff'}};
			break;
			case 'Profile' : 
				ret = {
					title: 'Profile',
					buttonColor: {profile: '#66a3ff'}};
			break;
			
		}
		return ret;
	}

	//choose which content based on title
	_getContent = () => {
		switch(this.state.title) {
			case 'Calendar' :
				return(<Calendar/>);
			case 'Project' :
				return(<Project/>);
			case 'Search' :
				//need to change this later
				return(<Search/>);
			case 'Profile' :
				return(<Profile 
					user = {this.state.user}
					onSignOut = {this._onSignOut}
				/>);
		}
	}

	_onSignOut = async () => {
		 //we need to sign out google account
		if(this.props.navigation.state.params.signInByGoogle) {
			try {
    			await GoogleSignin.revokeAccess();
    			await GoogleSignin.signOut();
    			//Alert.alert('Signed out');
  			} catch (error) {
    			Alert.alert('Something Bad Happened During Signing Out');
  			}
		}
		this.props.navigation.popToTop();
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
		flexDirection: 'row',
		justifyContent: 'center',
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
		justifyContent: 'space-between',
		width: '100%',
		borderTopWidth: 1,
		borderTopColor: '#e6e6e6',
	},
});