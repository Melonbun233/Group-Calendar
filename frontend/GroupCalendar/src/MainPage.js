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

export default class MainPage extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  		//calendar is the default content page
	  		title: 'Calendar',
	  		buttonColor: {
	  			calendar: '#66a3ff',
	  			project: '#000000',
	  			profile: '#000000',
	  			search: '#000000',
	  		},
	  };
	}

	//this function is invoked on switch button press
	switchContent = (_name) => {
		this.setState(this.getButtonColorState(_name));
	}

	render() {
		return (
			<View style = {cs.container}>		
				{/*Title*/}
				<View style = {[cs.container, s.topBar]}>
					<View style = {s.title}>
						<Text style = {cs.h1}>{this.state.title}</Text>
					</View>
					<View style = {s.button}>
						<Button
							title = 'Logout >'
							color = '#66a3ff'
							onPress = {this.props.onLogout}
						/>
					</View>
				</View>
				{/*Calendar Display*/}
				<View style = {[cs.container, s.content]}>
					{this.getContent()}
				</View>
				{/*Content Selection*/}
				<View style = {[cs.container, s.bottomBar]}>
					<TouchableWithoutFeedback 
						onPress = {() => this.switchContent('Calendar')}
					>
						<View style = {s.switchButton}>
						<Text style = {{color: this.state.buttonColor.calendar}}>
						Calendar</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback 
						onPress = {() => this.switchContent('Project')}
					>
						<View style = {s.switchButton}>
						<Text style = {{color: this.state.buttonColor.project}}>
						Project</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback 
						onPress = {() => this.switchContent('Search')}
					>
						<View style = {s.switchButton}>
						<Text style = {{color: this.state.buttonColor.search}}>
						Search</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback 
						onPress = {() => this.switchContent('Profile')}
					>
						<View style = {s.switchButton}>
						<Text style = {{color: this.state.buttonColor.profile}}>
						Profile</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</View>
		);
	}

	//this is used to modify button color on button press
	getButtonColorState = (_name) => {
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
	getContent = () => {
		switch(this.state.title) {
			case 'Calendar' :
				return(<Calendar/>);
			case 'Project' :
				return(<Project/>);
			case 'Search' :
				//need to change this later
				return(<Search/>);
			case 'Profile' :
				return(<Profile/>);
		}
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
		marginTop: 40,
		marginBottom: 10,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		borderBottomWidth: 1,
		borderBottomColor: '#e1e1ea',
	},
	title: {
		marginLeft: 20,
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
		borderTopColor: '#e1e1ea',
	},
	focus: {
		backgroundColor: '#ff0000',
	},
});