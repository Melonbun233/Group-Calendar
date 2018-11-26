'use strict'

import React, {Component} from 'react';
import {Alert, StyleSheet, ScrollView, View, ActivityIndicator, Text,
    Button, RefreshControl, TouchableWithoutFeedback, DatePickerIOS, FlatList,
    TouchableOpacity, AlertIOS} from 'react-native';
import cs from './common/CommonStyles';
import Network from './common/GCNetwork';
import SvgUri from 'react-native-svg-uri';
import SwipeOut from 'react-native-swipeout';
import validate from 'validate.js';
import {inviteUserByEmailConstraints} from './common/validation';


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
            extraData : false,
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

    _onRefresh = async (animation) => {
        let {project, profile, extraData} = this.state;
        if (animation) {
            this.setState({isRefreshing: true});
        }
        try {
            let projectResponse = await Network.fetchProject(project.projectId, profile.userId);
            let profileResponse = await Network.searchProfile(profile.userId);
            let ownerResponse = await Network.searchProfile(project.projectOwnerId);

            if (projectResponse.status == 200 && profileResponse.status == 200 &&
                ownerResponse.status == 200) {
                project = projectResponse.project;
                profile = profileResponse.profile;
                let ownerProfile = ownerResponse.profile;

                this.setState({
                    ownerProfile,
                    project,
                    profile,
                    tempProjectStartDate: project.projectStartDate,
                    tempProjectEndDate: project.projectEndDate,
                    extraData: !extraData,
                });
                await this._fetchMembers();
            } else {
                Alert.alert('Something went wrong');
            }
        } catch(error) {
            Alert.alert(error.toString());
        }
        if (animation) {
            this.setState({isRefreshing: false});
        }
    }

    _onProjectStartDateChange = (date) => {
        //let tempProjectEndDate 
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
                    let profile = response.profile;
                    members.push({profile});
                } else {
                    continue;
                }
            }
        }
        this.setState({members});
    }


    //get member flat list for rendering
    _renderMembers = () => {
        let {members, isOwner, extraData} = this.state;
        return (
            <View>
            {isOwner ? 
            <View style = {[s.button, s.borderBottom]}>
                <Button
                    title = 'Invite a new member'
                    onPress = {() => {
                        AlertIOS.prompt(
                            'Enter user\'s email',
                            'Enter user\'s email to invite',
                            [
                                {
                                    text: 'Cancel',
                                },
                                {
                                    text: 'OK',
                                    onPress: (email) => {
                                        this._onInviteMember(email);
                                    }
                                }
                            ],
                            'plain-text',
                            '',
                            'email-address',
                        );}}
                />
            </View> : null}
            <FlatList
                data = {members}
                renderItem = {this._renderSingleMember.bind(this)}
                keyExtractor = {(item) => item.profile.userId.toString()}
                extraData = {extraData}
            />
            </View>
        );
    }

    //get event flat list for rendering
    _renderEvents = () => {
        let {events} = this.state.project;
        let {isOwner, extraData} = this.state;
        return (
            <View>
            {isOwner ? 
            <View style = {[s.button, s.borderBottom]}>
                <Button
                    title = 'Create a new event'
                    onPress = {this._onCreateEvent.bind(this)}
                />
            </View> : null}
            {/* <View style = {[s.hint, s.borderBottom]}>
                <Text style = {cs.h5}>Tap to select a event you want to attend</Text>
            </View> */}
            <FlatList
                data = {events}
                renderItem = {this._renderSingleEvent.bind(this)}
                keyExtractor = {(item) => item.eventId.toString()}
                extraData = {extraData}
            />
            </View>
        );
    }

    _renderSingleMember = ({item}) => {
        let {profile} = item;
        let {userId} = this.state.profile;
        let {isOwner} = this.state;
        let button = isOwner ? [{
            backgroundColor: 'red',
            underlayColor: 'red',
            color: 'white',
            text: 'Remove',
            onPress: () => {
                AlertIOS.alert(
                    'Remove Member',
                    profile.userFirstname + ' ' + profile.userLastname,
                    [
                        {
                            text: 'Cancel',
                        },
                        {
                            text: 'Remove',
                            onPress: () => this._onDeleteMember(profile, userId),
                            style: 'destructive',
                        },
                    ],
                );
            }
        }] : [];
        return (
            <SwipeOut
                right = {button}
                autoClose = {true}
            >
            <View style = {[s.member, s.borderBottom]}>
                <Text style = {cs.normalText}>
                {profile.userFirstname + ' ' +  profile.userLastname}
                </Text>
            </View>
            </SwipeOut>
        );
    }

    _getEventTime (dateString) {
        let time = new Date(dateString);
        let array = time.toString().split(' ');
        return (array[0] + ' ' + array[4].slice(0, 5));
    }

    _renderSingleEvent = ({item}) => {
        let {userId} = this.state.profile;
        let {isOwner} = this.state;
        let button = isOwner ? [{
            backgroundColor: 'red',
            underlayColor: 'red',
            color: 'white',
            text: 'Delete',
            onPress: () => {
                AlertIOS.alert(
                    'Delete Event',
                    item.eventName,
                    [
                        {
                            text: 'Cancel',
                        },
                        {
                            text: 'Delete',
                            onPress: () => this._onDeleteEvent(item, userId),
                            style: 'destructive',
                        },
                    ],
                )}
        }] : [];

        let chosen = item.chosenId.includes(parseInt(userId));
        let bg = chosen ? '#66a3ff' : '#f2f2f2';
        let cl = chosen ? '#fff' : '#000';

        let startTime = this._getEventTime(item.eventStartTime);
        let endTime = this._getEventTime(item.eventEndTime);
        
        let avail = item.userLimit - item.chosenId.length;

        var repeat;
        switch (item.eventRepeat) {
            case 'week' : repeat = 'Weekly'
            break;
            case 'day' : repeat = 'Daily'
            break;
            case 'none' : repeat = 'Once'
        }
        return (
            <SwipeOut
                right = {button}
                style = {[s.borderBottom, s.borderTop]}
                autoClose = {true}
            >
            <TouchableOpacity
                onPress = {() => this._onVoteEvent(item, chosen, avail)}
            >
            <View style = {[s.event, {backgroundColor: bg}]}>
            <View style = {[s.eventItem, {backgroundColor: bg}]}>
                <Text style = {[cs.smallText, {color: cl}]}>{item.eventName}</Text>
                <Text style = {[cs.smallText, {color: cl}]}>{repeat}</Text>
            </View>
            <View style = {[s.eventItem, {backgroundColor: bg}]}>
                <Text style = {[cs.smallText, {color: cl}]}>Start Time:</Text>
                <Text style = {[cs.smallText, {color: cl}]}>{startTime}</Text>
            </View>
            <View style = {[s.eventItem, {backgroundColor: bg}]}>
                <Text style = {[cs.smallText, {color: cl}]}>End Time:</Text>
                <Text style = {[cs.smallText, {color: cl}]}>{endTime}</Text>
            </View>
            <View style = {[s.eventItem, {backgroundColor: bg}]}>
                <Text style = {[cs.smallText, {color: cl}]}>Availability: </Text>
                <Text style = {[cs.smallText, {color: cl}]}>{avail.toString()}</Text>
            </View>
            </View>
            </TouchableOpacity>
            </SwipeOut>
        );
    }

    _onInviteMember = async (email) => {
        let {project, profile} = this.state;
        //check email
        let invalid = validate({
            email: email
        }, inviteUserByEmailConstraints, {fullMessages: false});

        if (invalid) {
            Alert.alert('This is not a valid email address');
            return;
        }
        try {
            let status = await Network.inviteUser(project.projectId, profile.userId,
                email);
            if (status == 200) {
                Alert.alert('The invitation has been sent');
                await this._onRefresh(false);
            } else if (status < 500){
                Alert.alert('Cannot find the user');
            } else {
                Alert.alert('Internet Error ', status.toString());
            }
        } catch (error) {
            Alert.alert(error.toString());
        }
    }

    _onCreateEvent = () => {
        let {profile, project} = this.state;
        this.props.navigation.push('CreateEvent', {profile, project});
    }

    _onDeleteMember = async (member, userId) => {
        let {project} = this.state;
        let memberId = member.userId;
        try {
            let status = await Network.deleteMember(project.projectId, 
                memberId, userId);
            if (status == 200) {
                await this._onRefresh(false);
            } else {
                Alert.alert('Internet Error ' + status.toString());
            }
        } catch (error) {
            Alert.alert(error.toString());
        }
    }

    _onDeleteEvent = async (event, userId) => {
        let {project} = this.state;
        try {
            let status = await Network.deleteEvent(project.projectId, 
                event.eventId, userId);
            if (status == 200) {
               await this._onRefresh(false);
            } else {
                Alert.alert('Internet Error ' + status.toString());
            }
        } catch(error) {
            Alert.alert(error.toString());
        }
    }

    _onVoteEvent = async (event, chosen, avail) => {
        if (avail == 0) {
            Alert.alert('This event is full');
            return;
        }
        let {profile, project} = this.state;
        try {
            var status;
            //unvote from this event
            if (chosen) {
                status = await Network.dropEvent(project.projectId, 
                    event.eventId, profile.userId);
            } else {
                //vote for this event
                status = await Network.voteEvent(project.projectId,
                    event.eventId, profile.userId);
            }
            if (status == 200) {
                await this._onRefresh(false);
            } else {
                Alert.alert('Internet Error ' + status.toString());
            }
        } catch (error) {
            Alert.alert(error.toString());
        }
    }

    _onUpdateProject = async (update) => {
        let {project, profile} = this.state;
        try {
            let status = await Network.updateProject(
                project.projectId, profile.userId, update);
            if (status == 200) {
                await this._onRefresh();
            } else {
                Alert.alert('Internet Error ', status.toString());
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
					<ActivityIndicator size = 'large' animation = {false}/>
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
                        onRefresh = {() => this._onRefresh(true)}
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
    eventItem: {
        width: '100%',
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        paddingLeft: 30,
        paddingRight: 30,
    },
    event: {
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
    },
    hint: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 5,
    }
})