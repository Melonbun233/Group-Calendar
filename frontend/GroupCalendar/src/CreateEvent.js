'user strict';

import React, {Component} from 'react';
import {KeyboardAvoidingView, View, ScrollView, StyleSheet, ActivityIndicator,
    Text, Button, DatePickerIOS, TouchableWithoutFeedback, Alert, Picker} from 'react-native';
import cs from './common/CommonStyles';
import {TextField} from 'react-native-material-textfield';
import validate from 'validate.js';
import {createEventConstraints} from './common/validation';
import Network from './common/GCNetwork';

export default class CreateEvent extends Component {
    static navigationOptions = {
        title: 'Create a Event'
    }

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            isLoading: true,
            isSubmitting: false,
            showStartTimePicker: false,
            showEndTimePicker: false,
            showRepeatPicker: false,
            showLimitPicker: false,
        };

        this.eventNameRef = this._updateRef.bind(this, 'eventName');
        this.eventDescriptionRef = this._updateRef.bind(this, 'eventDescription');
        this.eventLocationRef = this._updateRef.bind(this, 'eventLocation');
    }
    
    componentDidMount() {
        let {navigation} = this.props;
        const profile = navigation.getParam('profile', null);
        const project = navigation.getParam('project', null);
        const refreshProject = navigation.getParam('refreshProject', null);

        let date = new Date();
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date = date.toJSON();
        if (profile && project && refreshProject) {
            let event = {
                eventStartTime: date,
                eventEndTime: date,
                eventName: '',
                eventDescription: '',
                eventLocation: '',
                eventRepeat: 'none',
                userLimit: 0,
            };
            this.setState({
                project,
                event,
                profile,
                isLoading: false,
                refreshProject,
            })
        } else {
            Alert.alert('Something went wrong');
            navigation.goBack();
        }
    }

    _updateRef(name, ref) {
        this[name] = ref;
    }

    _onFocus() {
        let {errors} = this.state;
        for (let name in errors) {
            let ref = this[name];
            if (ref.isFocused()) {
                delete errors[name];
            }
        }
        this.setState({errors});
    }

    _onSubmitEventName() {
        this.eventDescription.focus();
    }

    _onSubmitEventDescription() {
        this.eventLocation.focus();
    }

    _onSubmitEventLocation() {
        this.eventLocation.blur();
    }

    _validate() {
        let {eventName, eventDescription, eventStartTime, eventEndTime, eventLocation}
            = this.state.event;
        let {errors} = this.state;
        let invalid = validate ({
            eventName, eventDescription, eventLocation
        }, createEventConstraints, {fullMessages: false});

        if(invalid) {
            for (let key in invalid) {
                let val = invalid[key][0];
                errors[key] = val;
            }
            this.setState({errors});
            return false;
        }

        let startTime = new Date(eventStartTime);
        let endTime = new Date(eventEndTime);

        if (startTime.getTime() > endTime.getTime()){
            Alert.alert('Start time cannot be smaller than End time');
            return false;
        }

        if (endTime.getDate() != startTime.getDate() || 
            endTime.getFullYear() != startTime.getFullYear() ||
            endTime.getMonth() != startTime.getMonth()) {
            Alert.alert('Event can only be in one day');
            return false;
        }
        return true;
    }

    async _onSubmit() {
        let {profile, project, event} = this.state;
        this.setState({isSubmitting: true});
        let valid = this._validate();
        try {
            if (valid) {
                let status = await Network.createEvent(project.projectId, profile.userId, event);
                if (status == 200) {
                    this.state.refreshProject(false);
                    this.props.navigation.goBack();
                } else {
                    Alert.alert('Internet Error' + status.toString());
                }
            }
        } catch (error) {
            Alert.alert(error.toString());
        }
        this.setState({isSubmitting: false});
    }

    _onEventStartTimeChange = (date) => {
        let {event} = this.state;
        date.setSeconds(0);
        date.setMilliseconds(0);
        let dateString = date.toJSON();
        event.eventStartTime = dateString;
        this.setState({event});
    }

    _onEventEndTimeChange = (date) => {
        let {event} = this.state;
        date.setSeconds(0);
        date.setMilliseconds(0);
        let dateString = date.toJSON();
        event.eventEndTime = dateString;
        this.setState({event});
    }

    _renderEndTimePicker = () => {
        let {event} = this.state;
        return (
            <View style = {[{backgroundColor: '#f2f2f2'}]}>
                <DatePickerIOS
                    minuteInterval = {15}
                    date = {new Date(event.eventEndTime)}
                    onDateChange = {this._onEventEndTimeChange.bind(this)}
                />
            </View>
        );
    }

    _renderStartimePicker = () => {
        let {event} = this.state;
        return (
            <View style = {[{backgroundColor: '#f2f2f2'}]}>
                <DatePickerIOS
                    minuteInterval = {15}
                    date = {new Date(event.eventStartTime)}
                    onDateChange = {this._onEventStartTimeChange.bind(this)}
                />
            </View>
        );
    }

    _renderRepeatPicker = () => {
        let {event} = this.state;
        return (
            <View style = {[{backgroundColor: '#f2f2f2'}]}>
                <Picker 
						testID = 'repeatPicker'
						selectedValue = {event.eventRepeat}
						onValueChange = {(value) => {
                            event.eventRepeat = value;
                            this.setState({event}); 
                        }}
					>
					<Picker.Item label = 'Once' value = 'none'/>
					<Picker.Item label = 'Daily' value = 'day'/>
					<Picker.Item label = 'Weekly' value = 'week'/>
				</Picker>
            </View>
        );
    }

    _renderLimitPicker = () => {
        let {event} = this.state;
        let array = [];
        for (let i = 0; i < 101; i ++) {
            array.push({key: i});
        }

        let pickerItems = array.map(item => 
            (<Picker.Item 
                key = {item.key.toString()} 
                label = {item.key.toString()} 
                value = {item.key}
            />));

        return (
            <View style = {[{backgroundColor: '#f2f2f2'}]}>
                <Picker 
						testID = 'limitPicker'
						selectedValue = {event.userLimit}
						onValueChange = {(value) => {
                            event.userLimit = value;
                            this.setState({event}); 
                        }}
					>
					{pickerItems}
				</Picker>
            </View>
        );
    }

    _getEventRepeat(event) {
        switch(event) {
            case 'none' : return 'Once'
            case 'day' : return 'Daily'
            case 'week' : return 'Weekly'
        }
    }

    _getEventTime(date) {
        let array = date.toString().split(' ');
        let string = array[0] + ' ' + array[1] + ' ' + 
            array[2] + ' ' + array[4].slice(0, 5);
        return string;
    }

    render () {
        let {isLoading} = this.state;
        if (isLoading) {
            return (
                <View style = {cs.container}>
                    <ActivityIndicator size = 'large' animating = {false}/>
                </View>
            );
        }

        let {errors, showStartTimePicker, showEndTimePicker, showRepeatPicker, showLimitPicker, 
            event} = this.state;
        let {eventName, eventDescription, eventLocation, eventRepeat, userLimit} = event;

        let startTimePicker = this._renderStartimePicker();
        let endTimePicker = this._renderEndTimePicker();
        let repeatPicker = this._renderRepeatPicker();
        let limitPicker = this._renderLimitPicker();

        let eventStartTime = new Date(event.eventStartTime);
        let eventEndTime = new Date(event.eventEndTime);

        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset = {0}
                behavior = 'padding'
            >
            <ScrollView
                style = {s.scrollContainer}
            >
            <View style = {s.contentContainer}>
            {/* Event Name */}
                <TextField
                    ref = {this.eventNameRef}
                    label = 'Event Name'
                    value = {eventName}
                    autoCorrect = {false}
                    returnKeyType = 'next'
                    autoCapitalize = 'words'
                    labelHeight = {24}
                    onChangeText = {(text) => {
                        event.eventName = text;
                        this.setState({event});
                    }}
                    onSubmitEditing = {this._onSubmitEventName.bind(this)}
                    onFocus = {this._onFocus.bind(this)}
                    error = {errors.eventName}
                />
            {/* Event Description */}
                <TextField
                    ref = {this.eventDescriptionRef}
                    label = 'Event Description'
                    value = {eventDescription}
                    autoCorrect = {true}
                    returnKeyType = 'next'
                    autoCapitalize = 'sentences'
                    labelHeight = {24}
                    onChangeText = {(text) => {
                        event.eventDescription = text;
                        this.setState({event});
                    }}
                    onSubmitEditing = {this._onSubmitEventDescription.bind(this)}
                    onFocus = {this._onFocus.bind(this)}
                    error = {errors.eventDescription}
                />
            {/* Event Location */}
            <TextField
                    ref = {this.eventLocationRef}
                    label = 'Event Location'
                    value = {eventLocation}
                    autoCorrect = {false}
                    returnKeyType = 'done'
                    autoCapitalize = 'sentences'
                    labelHeight = {24}
                    onChangeText = {(text) => {
                        event.eventLocation = text;
                        this.setState({event});
                    }}
                    onSubmitEditing = {this._onSubmitEventLocation.bind(this)}
                    onFocus = {this._onFocus.bind(this)}
                    error = {errors.eventLocation}
                />
            </View>
            {/* start date */}
            <TouchableWithoutFeedback
                onPress = {() => this.setState({
                    showStartTimePicker: ~showStartTimePicker
                })}
            >
                <View style = {[s.listContainer, s.borderBottom]}>
                <View style = {s.dateContainer}>
                    <Text style = {cs.normalText}>Start Time</Text>
                    <Text style = {cs.h5}>{this._getEventTime(eventStartTime)}</Text>
                </View>
                </View>
            </TouchableWithoutFeedback>
            {showStartTimePicker ? startTimePicker : null}
            {/* end date */}
            <TouchableWithoutFeedback
                onPress = {() => this.setState({
                    showEndTimePicker: ~showEndTimePicker
                })}
            >
                <View style = {[s.listContainer, s.borderBottom]}>
                <View style = {s.dateContainer}>
                    <Text style = {cs.normalText}>End Time</Text>
                    <Text style = {cs.h5}>{this._getEventTime(eventEndTime)}</Text>
                </View>
                </View>
            </TouchableWithoutFeedback>
            {showEndTimePicker ? endTimePicker : null}
            {/* event repeat */}
            <TouchableWithoutFeedback
                onPress = {() => this.setState({
                    showRepeatPicker: ~showRepeatPicker
                })}
            >
                <View style = {[s.listContainer, s.borderBottom]}>
                <View style = {s.dateContainer}>
                    <Text style = {cs.normalText}>Repeat</Text>
                    <Text style = {cs.h5}>{this._getEventRepeat(eventRepeat)}</Text>
                </View>
                </View>
            </TouchableWithoutFeedback>
            {showRepeatPicker ? repeatPicker : null}
            {/* event limit */}
            <TouchableWithoutFeedback
                onPress = {() => this.setState({
                    showLimitPicker: ~showLimitPicker
                })}
            >
                <View style = {[s.listContainer, s.borderBottom]}>
                <View style = {s.dateContainer}>
                    <Text style = {cs.normalText}>Availability Limit</Text>
                    <Text style = {cs.h5}>{userLimit.toString()}</Text>
                </View>
                </View>
            </TouchableWithoutFeedback>
            {showLimitPicker ? limitPicker : null}
            <View style = {s.button}>
                <Button
                    testID = 'createButton'
                    title = {this.state.isSubmitting ? 'Submitting...': 'Submit'}
                    color = '#66a3ff'
                    onPress = {this._onSubmit.bind(this)}
                    disabled = {this.state.isSubmitting}
                />
            </View>
            <View style = {cs.empty}></View>
            </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}


const s = StyleSheet.create({
    scrollContainer: {
        backgroundColor: '#ffffff',
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        paddingTop: 10,
        marginLeft: '10%',
        width: '80%',
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        margin: 10,
    },
    listContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: '10%',
        width: '80%',
        flexDirection: 'column',
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: '#e6e6e6',
    },
});