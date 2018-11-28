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
            validDate: true,
            showMore: false,
        }
    }

    componentDidMount = async () => {
        let {navigation} = this.props;
        const projectId = navigation.getParam('projectId', null);
        const profile = navigation.getParam('profile', null);
        const refreshAll = navigation.getParam('refreshAll', null);
        const type = navigation.getParam('type', null);
        var project;
        try {
            if (projectId && profile && refreshAll && type) {
                let projectResponse = await Network.fetchProject(projectId, profile.userId);
                if (projectResponse.status == 200) {
                    project = projectResponse.project;
                } else {
                    Alert.alert('Something went wrong');
                    this.props.navigation.goBack();
                }
                let response =  await Network.searchProfile(project.projectOwnerId);
                if (response.status == 200) {
                    this.setState({
                        ownerProfile: response.profile,
                        project,
                        profile,
                        tempProjectStartDate: project.projectStartDate,
                        tempProjectEndDate: project.projectEndDate,
                        refreshAll,
                        type
                    });
                    await this._fetchMembers();

                    let isOwner = profile.userId == project.projectOwnerId ? true : false;
                    this.setState({
                        isOwner,
                        isLoading: false,
                    })
                    return;
                }
            } else {
                Alert.alert('Something went wrong');
                this.props.navigation.goBack();
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
                await Network.fetchAllProjects(profile.userId);
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
        let {tempProjectStartDate, tempProjectEndDate} = this.state;
        let endDate = new Date(tempProjectEndDate);
        if (date.getTime() > endDate.getTime()) {
            Alert.alert('Start date should be earlier than end date');
            this.setState({tempProjectStartDate});
            return;
        }
        //let tempProjectEndDate 
        let dateString = date.toJSON();
        tempProjectStartDate = dateString;
        this.setState({tempProjectStartDate, validDate: true});
    }

    _onProjectEndDateChange = (date) => {
        let {tempProjectStartDate, tempProjectEndDate} = this.state;
        let startDate = new Date(tempProjectStartDate);
        if (date.getTime() < startDate.getTime()) {
            Alert.alert('End date should be later than start date');
            this.setState({tempProjectEndDate});
            return;
        }
        let dateString = date.toJSON();
        tempProjectEndDate = dateString;
        this.setState({tempProjectEndDate, validDate: true});
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
        let {members, isOwner, extraData, type} = this.state;
        return (
            <View>
            {isOwner && type !== 'view'? 
            <View style = {[s.button, s.borderBottom]}>
                <Button
                    testID = 'inviteMemberButton'
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
        let {isOwner, extraData, type} = this.state;

        //sort events based on starting time
        events.sort((a, b) => {
            let dateA = new Date(a.eventStartTime);
            let dateB = new Date(b.eventStartTime);
            return (dateA.getTime() - dateB.getTime());
        });

        return (
            <View>
            {isOwner && type !== 'view'? 
            <View style = {[s.button, s.borderBottom]}>
                <Button
                    testID = 'createEventButton'
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
            <TouchableWithoutFeedback
                testID = 'memberButton'
                onPress = {() => this.props.navigation.push('ProfileDetail', {
                    userId: profile.userId
                })}
            >
            <View style = {[s.member, s.borderBottom]}>
                <Text style = {cs.normalText}>
                {profile.userFirstname + ' ' +  profile.userLastname}
                </Text>
            </View>
            </TouchableWithoutFeedback>
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
        let {isOwner, type} = this.state;
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
                disabled = {!isOwner || type === 'view'}
            >
            <TouchableOpacity
                onPress = {() => this._onVoteEvent(item, chosen, avail)}
                disabled = {type === 'view'}
            >
            <View style = {[s.event, {backgroundColor: bg}]}>
            <View style = {[s.eventItem, {backgroundColor: bg}]}>
                <Text style = {[cs.smallText, {color: cl}]}>{item.eventName}</Text>
                <Text style = {[cs.smallText, {color: cl}]}>{repeat}</Text>
            </View>
            <View style = {[s.eventItem, {backgroundColor: bg}]}>
                <Text style = {[cs.smallText, {color: cl}]}>{item.eventDescription}</Text>
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
                <Text style = {[cs.smallText, {color: cl}]}>Location: </Text>
                <Text style = {[cs.smallText, {color: cl}]}>{item.eventLocation}</Text>
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
            } else if (status == 404){
                Alert.alert('Cannot find the user');
            } else if (status == 302){
                Alert.alert('You have already sent the invitation');
            } else {
                Alert.alert('Internet Error ', status.toString());
            }
        } catch (error) {
            Alert.alert(error.toString());
        }
    }

    _onCreateEvent = () => {
        let {profile, project} = this.state;
        this.props.navigation.push('CreateEvent', {
            profile, project, 
            refreshProject: this._onRefresh.bind(this),
        });
    }

    _onDeleteEvent = async (event, userId) => {
        let {project, extraData} = this.state;
        try {
            //for user experience, set state first
            for (var key in project.events) {
                let value = project.events[key];
                if (value.eventId == event.eventId) {
                    project.events.splice(key, 1);
                    this.setState({project, extraData: !extraData});
                    break;
                }
            }
            //actually delete the project
            let status = await Network.deleteEvent(project.projectId, 
                event.eventId, userId);
            if (status == 200) {
               await this._onRefresh(false);
               await this.state.refreshAll(false);
            } else {
                Alert.alert('Internet Error ' + status.toString());
            }
        } catch(error) {
            Alert.alert(error.toString());
        }
    }

    _onVoteEvent = async (event, chosen, avail) => {
        let {profile, project, extraData} = this.state;
        try {
            var status;
            //unvote from this event
            if (chosen) {
                //for user experience, update state first
                for (var key in project.events) {
                    let value = project.events[key];
                    if (event.eventId == value.eventId){
                        let filtered = event.chosenId.filter((e) => {
                            return e != profile.userId});
                        project.events[key].chosenId = filtered;
                        this.setState({project, extraData: !extraData});
                        break;
                    }
                }
                status = await Network.dropEvent(project.projectId, 
                    event.eventId, profile.userId);
            } else {
                //vote for this event
                if (avail == 0) {
                    Alert.alert('This event is full');
                    return;
                }
                //for user experience, update state first
                for (var key in project.events) {
                    let value = project.events[key];
                    if (event.eventId == value.eventId) {
                        project.events[key].chosenId.push(parseInt(profile.userId));
                        this.setState({project, extraData: !extraData});
                        break;
                    }
                }
                status = await Network.voteEvent(project.projectId,
                    event.eventId, profile.userId);
            }
            if (status == 202) {
                Alert.alert('The event is full');
            } else if (status != 200) {
                Alert.alert('Internet Error ' + status.toString());
            }
            await this._onRefresh(false);
            await this.state.refreshAll(false);
        } catch (error) {
            Alert.alert(error.toString());
        }
    }

    _onDeleteProject = async () => {
        let {project, profile} = this.state;
        try {
            let status = await Network.deleteProject(project.projectId, profile.userId);
            if (status == 200) {
                this.state.refreshAll(false);
                this.props.navigation.goBack();
            }
        } catch (error) {
            Alert.alert(error.toString());
        }
    }

    _onDeleteMember = async (member, userId) => {
        let {project, extraData} = this.state;
        let memberId = member.userId;
        try {
            //for user experience, set state first
            for (let key in project.memberId) {
                let value = project.memberId[key];
                if (value == memberId) {
                    project.memberId.splice(key, 1);
                    this.setState({project, extraData: !extraData});
                    break;
                }
            }
            //actually deleting the member
            let status = await Network.deleteMember(project.projectId, 
                memberId, userId);
            if (status != 200) {
                Alert.alert('Internet Error ' + status.toString());
            }
            await this._onRefresh(false);
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
                    testID = 'endDatePicker'
                    title = 'Submit'
                    onPress = {() => {
                        this._onUpdateProject({
                            projectEndDate: tempProjectEndDate,
                        });
                        this.setState({showEndDatePicker: false});
                    }}
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
                    testID = 'startDatePicker'
                    title = 'Submit'
                    onPress = {() => {
                        this._onUpdateProject({
                            projectStartDate: tempProjectStartDate,
                        });
                        this.setState({showStartDatePicker: false})
                    }}
                />
            </View>
            </View>
        );
    }

    _renderMore = () => {
        let {isOwner, type, profile} = this.state;
        return (
        <View>
        {isOwner && type !== 'view' ? 
            <View style = {s.button}>
                <Button
                    testID = 'deleteProjectButton'
                    title = 'Delete Project'
                    onPress = {() => {
                        AlertIOS.alert(
                            'Delete Project',
                            'Are you sure you want to delete this project?',
                            [
                                {
                                    text: 'Cancel',
                                },
                                {
                                    text: 'DELETE',
                                    onPress: () => this._onDeleteProject(),
                                    style: 'destructive',
                                },
                            ],
                        );
                    }}
                    color = 'red'
                />
            </View> : null}
            {!isOwner && type !== 'view' ? 
            <View style = {s.button}>
                <Button
                    title = 'Leave Project'
                    onPress = {() => {
                        AlertIOS.alert(
                            'Leave Project',
                            'Are you sure you want to leave this project?',
                            [
                                {
                                    text: 'Cancel',
                                },
                                {
                                    text: 'LEAVE',
                                    onPress: async () => {
                                        await this._onDeleteMember(profile, profile.userId);
                                        await this.state.refreshAll(false);
                                        this.props.navigation.goBack();
                                    },
                                    style: 'destructive',
                                },
                            ],
                        );
                    }}
                    color = 'red'
                />
            </View> : null}
            </View>
        );
    }

    render() {
        let {isLoading, isRefreshing} = this.state;
        if(isLoading) {
			return (
				<View style = {cs.container}>
					<ActivityIndicator size = 'large' animating = {false}/>
				</View>
			);
        }
        let {project, ownerProfile, showStartDatePicker, showMembers,
            showEndDatePicker, showEvents, isOwner, profile, type, showMore} = this.state;

        let projectStartDate = new Date(project.projectStartDate);
        let projectEndDate = new Date(project.projectEndDate);

        let startDatePicker = this._renderStartDatePicker();
        let endDatePicker = this._renderEndDatePicker();

        let members = showMembers ? this._renderMembers() : null;
        let membersArrow = showMembers ? arrowUp : arrowDown;
        let events = showEvents ? this._renderEvents() : null;
        let eventsArrow = showEvents ? arrowUp : arrowDown;
        let more = showMore ? this._renderMore() : null;
        let moreArrow = showMore ? arrowUp : arrowDown;

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
            <TouchableWithoutFeedback
                testID = 'projectNameButton'
                onPress = {() => this.props.navigation.push('EditProject', {
                    project, profile, refresh: this._onRefresh.bind(this),
                })}
                disabled = {!isOwner || type === 'view'}
            >
            <View style = {s.title}>
                <Text style = {cs.h2}>{project.projectName}</Text>
                <Text style = {[cs.h5, {paddingTop: 10}]}>{project.projectDescription}</Text>
            </View>
            </TouchableWithoutFeedback>
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
                disabled = {!isOwner || type === 'view'}
                testID = 'projectStartDateButton'
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
                testID = 'projectEndDateButton'
                onPress = {() => this.setState({
                    showEndDatePicker: ~showEndDatePicker
                })}
                disabled = {!isOwner || type === 'view'}
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
                testID = 'memberButton'
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
                testID = 'eventButton'
            >
                <View style = {[s.listContainer, s.borderBottom]}>
                <View style = {s.contentContainer}>
                    <Text style = {cs.normalText}>Events</Text>
                    {eventsArrow}
                </View>
                </View>
            </TouchableWithoutFeedback>
            {events}
            {/* More */}
            {type === 'view' ? null :
                <TouchableWithoutFeedback
                    onPress = {() => this.setState({
                        showMore: ~showMore
                    })}
                    testID = 'moreButton'
                >
                    <View style = {[s.listContainer, s.borderBottom]}>
                    <View style = {s.contentContainer}>
                        <Text style = {cs.normalText}>More</Text>
                        {moreArrow}
                    </View>
                    </View>
                </TouchableWithoutFeedback>
        
            }
            {more}
            
            <View style = {cs.empty}></View>
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
    button: {
		padding: 10,
		alignItems: 'center',
	},
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
    },
})