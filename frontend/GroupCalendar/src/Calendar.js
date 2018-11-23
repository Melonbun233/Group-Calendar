'use strict';
/**
 * This page constructs the calendar
 */

import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, Button, ActivityIndicator} from 'react-native';
import cs from './common/CommonStyles';
import {Agenda} from 'react-native-calendars';

export default class Calendar extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			isLoading: true,
			isRefreshin: false,
			items: {}
		};
		this.agendaRef = this._updateRef.bind(this, 'agenda');
	}

	componentDidMount = () => {
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
			isLoading : false
		});
	}
	_updateRef = (name, ref) => {
		this[name] = ref;
	}
	_renderItem = (item) => {
		return (
			<View style = {s.item}>
				<Text style = {[cs.h5, {color: '#fff'}]}>{item.text}</Text>
			</View>
		);
	}
	
	_renderEmptyDate = () => {
		return (
			<View style = {s.emptyItem}>
				<Text style = {cs.h5}>Empty</Text>
			</View>
		);
	}

	_renderEmptyData = () => {
		return (
			<View></View>
		);
	}

	_loadItemsForMonth = (day) => {
		let {items} = this.state;
		//Alert.alert(day);
		for (let i = -20; i < 20; i ++){
			const time = day.timestamp + i * 24 * 60 * 60 * 1000;
			const date = new Date(time);
			const dateStr = this._getDateString(date);
			items[dateStr] = [];
		}
		items['2018-11-22'] = [{text: 'Have a good dinner'}];
		items['2018-11-23'] = [{text: 'No good dinner'}];
		items['2018-11-25'] = [{text: 'Final'}];
		this.setState({
			items,
		});
	}

	//simply delete all items
	_onRefresh = () => {
		this.setState({isRefreshing: true});
		let {items} = this.state;
		items['2018-11-22'] = [{text: 'Have a good dinner'}];
		items['2018-11-23'] = [{text: 'No good dinner'}];
		items['2018-11-25'] = [{text: 'Final'}];
		this.setState({items, isRefreshing: false});
	}

	_getDateString = (date) => {
		return date.toISOString().split('T')[0];
	}

	render() {
		let {isLoading} = this.state;
		if (isLoading) {
			return (
				<View style = {cs.container}>
					<ActivityIndicator size = 'large' animation = 'false'/>
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
				renderEmptyData = {this._renderEmptyData.bind(this)}
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
		backgroundColor: '#66a3ff',
		flex: 1,
		borderRadius: 3,
		padding: 10,
		marginRight: 10,
		marginTop: 17
	},
	emptyItem: {
		backgroundColor: 'white',
		flex: 1,
		borderRadius: 3,
		padding: 10,
		marginRight: 10,
		marginTop: 17
	}
})