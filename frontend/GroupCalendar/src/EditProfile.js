'user strict';

import React, {Component} from 'react';
import {Text, View, StyleSheet, Alert, Button, ScrollView, DatePickerIOS,
	FlatList, ActivityIndicator} from 'react-native';
import Network from './common/GCNetwork';
import cs from './common/CommonStyles';
import {TextField} from 'react-native-material-textfield';


const configMap = {
		userLastname : {
			label: 'Last Name',
			autoCapitalize: 'words',
			secureTextEntry: false,
		},
		userFirstname : {
			label: 'First Name', 
			autoCapitalize: 'words',
			secureTextEntry: false,
		},
		userDescription: {
			label: 'What\'s Up',
			autoCapitalize: 'sentences',
			secureTextEntry: false,
		}
};

export default class EditProfile extends Component {
	static navigationOptions = {
		title: 'Edit Profile',
	}

	constructor(props) {
		super(props);

		this.state = {
			isLoading : true,
		};
		this._onChangeDate = this._onChangeDate.bind(this);
		this._onChangeText = this._onChangeText.bind(this);
	}

	componentDidMount() {
		let {navigation} = this.props;
		const editInfo = navigation.getParam('editInfo', null);
		const cookie = navigation.getParam('cookie', null);
		var items = [];
		if (editInfo && cookie) {
			//get all keys
			for (key in editInfo) {
				if (!editInfo.hasOwnProperty(key)) {
					continue;
				}
				var info = editInfo[key];
				items.push({key: key, info: info});
			}

			this.setState({
				isLoading : false,
				isUpdating: false,
				data: items,
				cookie,
			});
		} else {
			Alert.alert('Something Bad Happened');
			navigation.goBack();
		}
	}
	_renderItem = ({item}) => {
		switch (item.key) {
			case 'userBirth' : {
				let date = new Date(item.info);
				return (
					<View style = {s.contentContainer}>
					<DatePickerIOS
						date = {date}
						onDateChange = {this._onChangeDate}
						mode = 'date'
					/>
					</View>
				);
			}
			default: {
				let config = configMap[item.key];
				return (
					<View style = {[s.contentContainer]}>
					<TextField
						label = {config.label}
						value = {item.info}
						onChangeText = {(text) => this._onChangeText(item.key, text)}
						autoCorrect = {false}
						autoCapitalize = {config.autoCapitalize}
						secureTextEntry = {config.secureTextEntry}
						labelHeight = {28}
					/>
					</View>
				);
			}
		}
	}

	_onChangeDate(date) {
		let {data} = this.state;
		data['userBirth'] = date.toJSON;
		this.setState({data});
	}

	_onChangeText = (key, text) => {
		let {data} = this.state;
		for (key in data) {
			if (key === key) {
				data[key] = text;
				break;
			}
		}
		this.setState({data});
	}

	_onSubmit = async () => {
		let {data, cookie} = this.state;

		this.setState({isUpdating: true});
		let res = await Network.updateProfile(data[0], cookie);
		switch(res.status) {
			case 200: {
				Alert.alert('Success!');
				this.props.navigation.goBack();
			}
			break;
			case 400: 
			case 404: {
				Alert.alert('Invalid User Info');
			}
			break;
			default: Alert.alert('HTTP ERROR', JSON.stringify(res.error));
		}
		this.setState({isUpdating: false});
	}

	render() {
		let {isLoading, isUpdating} = this.state;
		if(isLoading) {
			return (
				<View style = {cs.container}>
					<ActivityIndicator size = 'large' animating = {false}/>
				</View>
			);
		}
		let {data} = this.state;
		return (
			<ScrollView
				style = {[s.scrollContainer]}
				keyboardShouldPersistTaps = 'never'
			>
				<FlatList 
					data = {data}
					renderItem = {this._renderItem}
				/>
				<Button
					disabled = {isLoading}
					onPress = {this._onSubmit}
					title = 'Submit'
				/>
			</ScrollView>
		)
	}
}

const s = StyleSheet.create({
	contentContainer: {
		marginLeft: '10%',
		width: '80%',
		flex: 1,
	},
	scrollContainer:{
		backgroundColor: '#ffffff',
		width: '100%',
		height: '100%',
	}
})