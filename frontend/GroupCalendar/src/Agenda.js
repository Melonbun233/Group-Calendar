'use strict';
/**
 * This page constructs the calendar
 */

import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, Button, ActivityIndicator,
	TouchableWithoutFeedback} from 'react-native';
import cs from './common/CommonStyles';
import {Agenda} from 'react-native-calendars';
import Storage from './common/Storage';
import Network from './common/GCNetwork';
import UserAvatar from 'react-native-user-avatar';

export default class Calendar extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			isLoading: true,
			isRefreshin: false,
			items: {},
			profile: null,
			allProjects: null,
		};
		this.agendaRef = this._updateRef.bind(this, 'agenda');
	}

	componentDidMount = async () => {
		try {
			this._init();
			let profile = await Storage.getProfile();
			if (!profile) {
				Alert.alert('Something went wrong');
				this.props.onSessionOut();
			}
			this.setState({profile});
			let allProjects = await Storage.getAllProjects();
			if (allProjects) {
				this.setState({allProjects});
			} else {
				await this._onRefresh(false);
			}
			this.setState({isLoading: false});
		} catch (error) {
			Alert.alert(error.toString());
		}
	}

	//manually refresh today's agenda
	_onRefresh = async (animating) => {
		let {profile} = this.state;
		let curr = new Date();
		curr.setMilliseconds(0);
		curr.setSeconds(0);
		curr.setMinutes(0);
		curr.setHours(0);
		if(animating) {
			this.setState({isRefreshing: true});
		}
		try {
			let status = await Network.fetchAllProjects(profile.userId);
			switch (status) {
				case 200:
				break;
				case 0: {
					Alert.alert('Not all projects fetched');
				}
				break;
				default: {
					Alert.alert('Internet Error ' + status.toString());
					this.props.onSessionOut();
				}
			}
			let allProjects = await Storage.getAllProjects();
			this.setState({allProjects});
		} catch(error) {
			Alert.alert(error.toString());
		}
		// let items = {};
		// this.setState(items);
		this._loadItemsForMonth({timestamp: curr.getTime()});
		this.setState({isRefreshing: false});
	}

	_init = () => {
		let curr = new Date();
		curr = new Date(curr.getTime() - (curr.getTimezoneOffset() * 60000));
		let today = this._getDateString(curr);
		let min = new Date(curr.getFullYear() - 1, curr.getMonth(), 
			curr.getDate());
		let minDate = this._getDateString(min);
		let max = new Date(curr.getFullYear() + 1, curr.getMonth(),
			curr.getDate());
		let maxDate = this._getDateString(max);
		this.setState({
			today,
			minDate,
			maxDate,
		});
	}
	
	_updateRef = (name, ref) => {
		this[name] = ref;
	}

	_onPressEvent = (projectId) => {
		let {profile} = this.state;
		this.props.navigation.push('ProjectDetail', {
			profile, projectId, type: 'edit',
			refreshAll: this._onRefresh.bind(this),
		});
	}

	_renderItem = (item) => {
		let {event} = item;
		let period = this._getEventTime(event.eventStartTime, event.eventEndTime);
		
		return (
			<View style = {s.item}>
			<TouchableWithoutFeedback
				onPress = {() => this._onPressEvent(item.projectId)}
			>
			<View style = {[s.event, {backgroundColor: '#fff'}]}>
			<View style = {[s.eventItem, {backgroundColor: '#fff'}]}>
			<View style = {[s.event, {backgroundColor: '#fff'}]}>
				<Text style = {[cs.smallText, s.eventMsg, {fontStyle: 'italic'}]}>
				{period}
				</Text>
				<Text style = {[cs.normalText, s.eventMsg]}>
				{event.eventName}
				</Text>
				<Text style = {[cs.normalText, s.eventMsg]}>
				{event.eventLocation}
				</Text>
            </View>
				<UserAvatar
					size = {60}
					name = {item.projectName}
					style = {s.avatar}
				/>
            </View>
			<View style = {[s.eventItem, {backgroundColor: '#fff'}]}>
				<Text style = {[cs.h5, s.eventMsg, {color: '#c0c0c0'}]}>
				{event.eventDescription}
				</Text>
			</View>

            </View>
			</TouchableWithoutFeedback>
			</View>
		);
	}

	_getEventTime (startTime, endTime) {
		let startDate = new Date(startTime);
		let endDate = new Date(endTime);
		let startArray = startDate.toString().split(' ');
		let endArray = endDate.toString().split(' ');
        return (startArray[4].slice(0, 5) + ' - ' + endArray[4].slice(0, 5));
    }
	
	_renderEmptyDate = () => {
		return (
			<View style = {s.emptyItem}>
				<View style = {s.empty}></View>
			</View>
		);
	}

	_loadItemsForMonth = (date) => {
		let {items} = this.state;
		//add 30 days events
		for (let i = -30; i < 30; i ++) {
			const tempDate = new Date(date.timestamp + i * 24 * 60 * 60 * 1000);
			const dateStr = this._getDateString(tempDate);
			items[dateStr] = [];
		}
		
		this._loadAllEvents(date);
		this.setState({items});
	}

	_loadAllEvents = (date) => {
		let {allProjects, profile} = this.state;
		if (!profile || !allProjects) {
			return;
		}
		let {userId} = profile;
		for (var key in allProjects) {
			let project = allProjects[key];
			for (var eventKey in project.events) {
				let event = project.events[eventKey];
				if (event.chosenId.includes(parseInt(userId))){
					switch (event.eventRepeat) {
					case 'none' : {
						let time = (new Date(event.eventStartTime).getTime());
						if (this._withinRange(time, date.timestamp, project)) {
							this._setEvents([time], project, event);
						}
					}
					break;
					case 'week' : {
						let times = [];
						for (let i = 0; i < 8; i ++) {
							let time = (new Date(event.eventStartTime).getTime()) + 
								i * 7 * 24 * 60 * 60 * 1000;
							if (this._withinRange(time, date.timestamp, project)){
								times.push(time);
							}
						}
						this._setEvents(times, project, event);
					}
					break;
					case 'day' : {
						let times = [];
						for (let i = -30; i < 30; i ++) {
							let time = (new Date(event.eventStartTime).getTime()) + 
								i * 24 * 60 * 60 * 1000;
							if (this._withinRange(time, date.timestamp, project)){
								times.push(time);
							}
						}
						this._setEvents(times, project, event);
					}}
				}
			}
		}
	} 

	_setEvents = (times, project, event) => {
		let {items} = this.state;
		let dateStr = null;
		for (var key in times) {
			let time = times[key];
			let date = new Date(time);
			date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
			let dateStr = this._getDateString(date);
			if (items.hasOwnProperty(dateStr)) {
				items[dateStr].push({
					projectName: project.projectName,
					projectId: project.projectId,
					event,
				});
			} else {
				items[dateStr] = [{
					projectName: project.projectName,
					projectId: project.projectId,
					event,
				}];
			}
		}
		//sort by events start time
		if (dateStr) {
			items[dateStr].sort((a, b) => {
				let eventStartTimeA = new Date(a.event.eventStartTime);
				let eventStartTimeB = new Date(b.event.eventStartTime)
				return (eventStartTimeA.getTime() - eventStartTimeB.getTime());
			});
		}
		this.setState({items});
	}

	_withinRange(time, timeStamp, project){
		let minTime = timeStamp - 30 * 24 * 60 * 60 * 1000;
		let maxTime = timeStamp + 30 * 24 * 60 * 60 * 1000;
		let projectMinTime = (new Date(project.projectStartDate).getTime());
		let projectMaxTime = (new Date(project.projectEndDate).getTime());

		return (time > minTime && time < maxTime && 
				time > projectMinTime && time < projectMaxTime);
	}

	_getDateString = (date) => {
		return date.toISOString().split('T')[0];
	}

	render() {
		let {isLoading} = this.state;
		if (isLoading) {
			return (
				<View style = {cs.container}>
					<ActivityIndicator size = 'large' animating = 'false'/>
				</View>
			);
		}
		let {isRefreshing, minDate, maxDate, today} = this.state;
		return(
			<View style = {cs.wholePage}>
			<Agenda
				ref = {this.agendaRef}
				items = {this.state.items}
				loadItemsForMonth = {this._loadItemsForMonth.bind(this)}
				selected= {today}
				minDate = {minDate}
				maxDate = {maxDate}
				renderItem = {this._renderItem.bind(this)}
				renderEmptyDate = {this._renderEmptyDate.bind(this)}
				rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
				refreshing={isRefreshing}
				onRefresh={this._onRefresh.bind(this)}
				theme={{
					agendaTodayColor: '#66a3ff',
				}}
			/>
			</View>
		);
	}
}

const s = StyleSheet.create({
	item: {
		backgroundColor: '#fff',
		flex: 1,
		padding: 10,
		marginRight: 10,
		marginTop: 17,
		borderRadius : 5,
	},
	emptyItem: {
		borderRadius : 5,
		flex: 1,
		padding: 10,
		marginRight: 10,
		marginTop: 17,
	},
	empty: {
		height: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e2e2e2',
	},
	eventItem: {
        width: '100%',
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        alignItems: 'center',
		justifyContent: 'space-between',
		paddingLeft: 3,
    },
    event: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
	},
	eventMsg: {
		color: 'black', 
		padding: 3,
	},
	avatar: {
		marginRight: 20,	
	}
})