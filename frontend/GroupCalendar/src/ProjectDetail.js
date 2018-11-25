'use strict'

import React, {Component} from 'react';
import {Alert, StyleSheet, ScrollView, View, ActivityIndicator, Text,
    Button, RefreshControl, TouchableWithoutFeedback, DatePickerIOS, FlatList
    } from 'react-native';
import cs from './common/CommonStyles';
import Network from './common/GCNetwork';
import SvgUri from 'react-native-svg-uri';
import SwipeOut from 'react-native-swipeout';

export default class ProjectDeatail extends Component {
    static navigationOptions = {
        title: 'Project Details'
    }

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isRefreshing: false,
            showStartDatePicker: false,
            showEndDatePicker: false,
            showMembers: false,
        }
    }

    componentDidMount = async () => {
        let {navigation} = this.props;
        const project = navigation.getParam('project', null);
        const profile = navigation.getParam('profile', null);

        try {
            if (project && profile) {
                let response =  await Network.searchProfile(project.projectOwnerId);
                if (response.status == 200) {
                    this.setState({
                        ownerProfile: response.profile,
                        project,
                        profile,
                        tempProjectStartDate: project.projectStartDate,
                        tempProjectEndDate: project.projectEndDate,
                    });
                    await this._fetchMembers();

                    let isOwner = profile.userId == project.projectOwnerId ? true : false;
                    this.setState({
                        isOwner,
                        isLoading: false,
                    })
                    return;
                }
            }
        } catch (error) {
            Alert.alert(error.toString());
        }
        navigation.goBack();
    }

    _onRefresh = async () => {
        let {project, profile} = this.state;
        this.setState({isRefreshing: true});
        try {
            let projectResponse = await Network.fetchProject(project.projectId, profile.userId);
            let profileResponse = await Network.searchProfile(profile.userId);
            let ownerResponse = await Network.searchProfile(project.projectOwnerId);
            if (projectResponse.status == 200 && profileResponse.status == 200 &&
                ownerResponse.status == 200) {
                this.setState({
                    ownerProfile: ownerResponse.profile,
                    project: projectResponse.project,
                    profile: profileResponse.profile,
                    tempProjectStartDate: project.projectStartDate,
                    tempProjectEndDate: project.projectEndDate,
                });
                await this._fetchMembers();
            } else {
                Alert.alert('Something went wrong');
            }
        } catch(error) {
            Alert.alert(error.toString());
        }
        this.setState({isRefreshing: false});
    }

    _onProjectStartDateChange = (date) => {
        let dateString = date.toJSON();
        let tempProjectStartDate = dateString;
        this.setState({tempProjectStartDate});
    }

    _onProjectEndDateChange = (date) => {
        let dateString = date.toJSON();
        let tempProjectEndDate = dateString;
        this.setState({tempProjectEndDate});
    }

    //fetch members and set state
    _fetchMembers = async () => {
        let {memberId} = this.state.project;
        let members = [];
        if (memberId) {
            for (let i = 0; i < memberId.length; i ++) {
                let response = await Network.searchProfile(memberId[i]);
                if (response.status == 200) {
                    members.push({profile: response.profile});
                } else {
                    continue;
                }
            }
        }
        this.setState({members});
    }


    //get member flat list for rendering
    _renderMembers = () => {
        let {members, isOwner} = this.state;
        return (
            <View>
            {isOwner ? 
            <View style = {[s.button, s.borderBottom]}>
                <Button
                    title = 'Invite a new member'
                    onPress = {this._onInviteMember.bind(this)}
                />
            </View> : null}
            <FlatList
                data = {members}
                renderItem = {this._renderSingleMember.bind(this)}
                keyExtractor = {(item) => item.profile.userId.toString()}
            />
            </View>
        );
    }

    //get event flat list for rendering
    _renderEvents = () => {
        let {events} = this.state.project;
        let {isOwner} = this.state;
        return (
            <View>
            {isOwner ? 
            <View style = {[s.button, s.borderBottom]}>
                <Button
                    title = 'Create a new event'
                    onPress = {this._onCreateEvent.bind(this)}
                />
            </View> : null}
            <FlatList
                data = {events}
                renderItem = {this._renderSingleEvent.bind(this)}
                keyExtractor = {(item) => item.eventId.toString()}
            />
            </View>
        );
    }

    _renderSingleMember = ({item}) => {
        let {profile} = item;
        let {userId} = this.state.profile;
        return (
            <SwipeOut
                right = {[{
                    backgroundColor: 'red',
                    underlayColor: 'red',
                    color: 'white',
                    text: 'Delete',
                    onPress: function(){this._onDeleteMember(profile.userId, userId)}
                }]}
            >
            <View style = {[s.member, s.borderBottom]}>
                <Text style = {cs.h5}>
                {profile.userFirstname + ' ' +  profile.userLastname}
                </Text>
            </View>
            </SwipeOut>
        );
    }

    _renderSingleEvent = ({item}) => {
        let {userId} = this.state.profile;
        return (
            <SwipeOut
                right = {[{
                    backgroundColor: 'red',
                    underlayColor: 'red',
                    color: 'white',
                    text: 'Delete',
                    onPress: function(){() => this._onDeleteEvent(item.eventId, userId)}
                }]}
            >
            <View style = {[s.member, s.borderBottom]}>
                <Text style = {cs.h5}>
                {item.eventName}
                </Text>
            </View>
            </SwipeOut>
        );
    }

    _onInviteMember = () => {

    }

    _onCreateEvent = () => {

    }

    _onDeleteMember = async (memberId, userId) => {

    }

    _onDeleteEvent = async (eventId, userId) => {

    }

    _onUpdateProject = async (update) => {
        let {project, profile} = this.state;
        try {
            let status = await Network.updateProject(
                project.projectId, profile.userId, update);
            if (status == 200) {
                await this._onRefresh();
            } else {
                Alert.alert('Error updating');
            }
        } catch (error) {
            Alert.alert(error.toString());
        }
    }

    _renderEndDatePicker = () => {
        let {tempProjectEndDate} = this.state;
        return (
            <View>
            <View style = {[{backgroundColor: '#f2f2f2'}]}>
                <DatePickerIOS
                    date = {new Date(tempProjectEndDate)}
                    onDateChange = {this._onProjectEndDateChange.bind(this)}
                    mode = 'date'
                />
            </View>
            <View style = {[s.button, s.borderTop, s.borderBottom]}>
                <Button
                    title = 'Submit'
                    onPress = {() => this._onUpdateProject({
                        update:{
                            projectEndDate: tempProjectEndDate,
                        }
                    })}
                />
            </View>
            </View>
        );
    }

    _renderStartDatePicker = () => {
        let {tempProjectStartDate} = this.state;
        return (
            <View>
            <View style = {[{backgroundColor: '#f2f2f2'}]}>
                <DatePickerIOS
                    date = {new Date(tempProjectStartDate)}
                    onDateChange = {this._onProjectStartDateChange.bind(this)}
                    mode = 'date'
                />  
            </View>
            <View style = {[s.button, s.borderTop, s.borderBottom]}>
                <Button
                    title = 'Submit'
                    onPress = {() => this._onUpdateProject({
                        update:{
                            projectStartDate: tempProjectStartDate,
                        }
                    })}
                />
            </View>
            </View>
        );
    }

    render() {
        let {isLoading, isRefreshing} = this.state;
        if(isLoading) {
			return (
				<View style = {cs.container}>
					<ActivityIndicator size = 'large'/>
				</View>
			);
        }
        let {project, ownerProfile, showStartDatePicker, showMembers,
            showEndDatePicker, showEvents} = this.state;

        let projectStartDate = new Date(project.projectStartDate);
        let projectEndDate = new Date(project.projectEndDate);

        let startDatePicker = this._renderStartDatePicker();
        let endDatePicker = this._renderEndDatePicker();

        let members = showMembers ? this._renderMembers() : null;
        let membersArrow = showMembers ? arrowUp : arrowDown;
        let events = showEvents ? this._renderEvents() : null;
        let eventsArrow = showEvents ? arrowUp : arrowDown;

        return (
            <ScrollView
				style = {[s.scrollContainer]}
                keyboardShouldPersistTaps = 'never'
                refreshControl = {
                    <RefreshControl
                        onRefresh = {this._onRefresh.bind(this)}
                        refreshing = {isRefreshing}
                    />}
			>
            <View style = {s.title}>
                <Text style = {cs.h2}>{project.projectName}</Text>
                <Text style = {[cs.h5, {paddingTop: 10}]}>{project.projectDescription}</Text>
            </View>
            {/* project owner */}
            <TouchableWithoutFeedback>
            <View style = {[s.listContainer, s.borderBottom]}>
                <View style = {[s.contentContainer]}>
                    <Text style = {cs.normalText}>
                    Project Owner
                    </Text>
                    <Text style = {cs.h5}>
                    {ownerProfile.userFirstname + ' '+ ownerProfile.userLastname}
                    </Text>
                </View>
            </View>
            </TouchableWithoutFeedback>
            {/* start date */}
            <TouchableWithoutFeedback
                onPress = {() => this.setState({
                    showStartDatePicker: ~showStartDatePicker
                })}
            >
                <View style = {[s.listContainer, s.borderBottom]}>
                <View style = {s.contentContainer}>
                    <Text style = {cs.normalText}>Start Date</Text>
                    <Text style = {cs.h5}>{projectStartDate.toDateString()}</Text>
                </View>
                </View>
            </TouchableWithoutFeedback>
            {showStartDatePicker ? startDatePicker : null}
            {/* end date */}
            <TouchableWithoutFeedback
                onPress = {() => this.setState({
                    showEndDatePicker: ~showEndDatePicker
                })}
            >
                <View style = {[s.listContainer, s.borderBottom]}>
                <View style = {s.contentContainer}>
                    <Text style = {cs.normalText}>End Date</Text>
                    <Text style = {cs.h5}>{projectEndDate.toDateString()}</Text>
                </View>
                </View>
            </TouchableWithoutFeedback>
            {showEndDatePicker ? endDatePicker : null}
            {/* Members */}
            <TouchableWithoutFeedback
                onPress = {() => this.setState({
                    showMembers: ~showMembers
                })}
            >
                <View style = {[s.listContainer, s.borderBottom]}>
                <View style = {s.contentContainer}>
                    <Text style = {cs.normalText}>Members</Text>
                    {membersArrow}
                </View>
                </View>
            </TouchableWithoutFeedback>
            {members}
            {/* Event */}
            <TouchableWithoutFeedback
                onPress = {() => this.setState({
                    showEvents: ~showEvents
                })}
            >
                <View style = {[s.listContainer, s.borderBottom]}>
                <View style = {s.contentContainer}>
                    <Text style = {cs.normalText}>Events</Text>
                    {eventsArrow}
                </View>
                </View>
            </TouchableWithoutFeedback>
            {events}
            </ScrollView>
        )
    }

}

const arrowDown = (
    <SvgUri width = {24} height = {24} source = {require('../img/show.svg')}/>
);

const arrowUp = (
    <SvgUri width = {24} height = {24} source = {require('../img/hide.svg')}/>
);

const s = StyleSheet.create({
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: '#e6e6e6',
    },
	contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    listContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 20,
        marginLeft: '5%',
        width: '95%',
        flexDirection: 'column',
    },
	scrollContainer:{
		backgroundColor: '#ffffff',
		width: '100%',
		height: '100%',
    },
    title: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
    },
    member: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
    },
    button: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
    }
})