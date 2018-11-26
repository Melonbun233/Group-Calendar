'user strict';

import React, {Component} from 'react';
import {KeyboardAvoidingView, View, ScrollView, StyleSheet, ActivityIndicator,
    Text, Button, DatePickerIOS, TouchableWithoutFeedback, Alert} from 'react-native';
import cs from './common/CommonStyles';
import {TextField} from 'react-native-material-textfield';
import validate from 'validate.js';
import {createProjectConstraints} from './common/validation';
import Network from './common/GCNetwork';

export default class CreateProject extends Component {
    static navigationOptions = {
        title : 'Create a Project'
    }

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            isLoading: true,
            isSubmitting: false,
            showStartDatePicker: false,
            showEndDatePicker: false,
        };
        this._onFocus = this._onFocus.bind(this);
        this._onSubmit = this._onSubmit.bind(this);

        this._onSubmitProjectName = this._onSubmitProjectName.bind(this);
        this._onSubmitProjectDescription = this._onSubmitProjectDescription.bind(this);
        
        this.projectNameRef = this._updateRef.bind(this, 'projectName');
        this.projectDescriptionRef = this._updateRef.bind(this, 'projectDescription');

    }

    componentDidMount() {
        let {navigation} = this.props;
        const profile = navigation.getParam('profile', null);
        const refreshAll = navigation.getParam('refreshAll', null);
        if (profile && refreshAll) {
            let today = new Date();
            today = today.toJSON();
            let project = {
                projectStartDate: today,
                projectEndDate: today,
                projectName: '',
                projectDescription: '',
            }
            this.setState({
                refreshAll,
                project,
                profile,
                isLoading: false,
            });
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
            if(ref.isFocused()) {
                delete errors[name];
            }
        }

        this.setState({errors});
    }

    _onSubmitProjectName() {
        this.projectDescription.focus();
    }

    _onSubmitProjectDescription() {
        this.projectDescription.blur();
    }

    _validate() {
        let {projectName, projectDescription, projectStartDate, projectEndDate} 
            = this.state.project;
        let {errors} = this.state;
        //validate project name and description
        let invalid = validate({
            projectName, projectDescription
        }, createProjectConstraints, {fullMessages: false});

        if (invalid) {
            for (let key in invalid) {
                let val = invalid[key][0];
                errors[key] = val;
            }
            this.setState({errors});
            return false;
        }

        //check date
        let startDate = new Date(projectStartDate);
        let endDate = new Date(projectEndDate);
        if (startDate.getTime() > endDate.getTime()) {
            Alert.alert('Start date cannot be smaller than End date');
            return false;
        }
        return true;
    }

    async _onSubmit() {
        let {profile, project} = this.state;
        this.setState({isSubmitting: true});
        let valid = this._validate();
        try {
            if (valid) {
                let status = await Network.createProject(profile.userId, project);
                if (status == 200) {
                    this.state.refreshAll();
                    this.props.navigation.goBack();
                } else {
                    Alert.alert('Internet Error ' + status.toString());
                }
            }
        } catch (error) {
            Alert.alert(error.toString());
        }
        this.setState({isSubmitting: false});
    }

    _onProjectStartDateChange = (date) => {
        let {project} = this.state;
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        let dateString = date.toJSON();
        project.projectStartDate = dateString;
        this.setState({project});
    }

    _onProjectEndDateChange = (date) => {
        let {project} = this.state;
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        let dateString = date.toJSON();
        project.projectEndDate = dateString;
        this.setState({project});
    }

    _renderEndDatePicker = () => {
        let {project} = this.state;
        return (
            <View style = {[{backgroundColor: '#f2f2f2'}]}>
                <DatePickerIOS
                    date = {new Date(project.projectEndDate)}
                    onDateChange = {this._onProjectEndDateChange.bind(this)}
                    mode = 'date'
                />
            </View>
        );
    }

    _renderStartDatePicker = () => {
        let {project} = this.state;
        return (
            <View style = {[{backgroundColor: '#f2f2f2'}]}>
                <DatePickerIOS
                    date = {new Date(project.projectStartDate)}
                    onDateChange = {this._onProjectStartDateChange.bind(this)}
                    mode = 'date'
                /> 
            </View>
        );
    }

    render() {
        let {isLoading} = this.state;
        if (isLoading) {
            return (
                <View style = {cs.container}>
                    <ActivityIndicator size = 'large' animating = {false}/>
                </View>
            );
        }
        let {errors, showStartDatePicker, showEndDatePicker, project} = this.state;
        let {projectName, projectDescription} = 
            this.state.project;

        let startDatePicker = this._renderStartDatePicker();
        let endDatePicker = this._renderEndDatePicker();
        let projectStartDate = new Date(project.projectStartDate);
        let projectEndDate = new Date(project.projectEndDate);

        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset = {0}
                behavior = 'padding'
            >
            <ScrollView
                style = {s.scrollContainer}
            >
            <View style = {s.contentContainer}>
            {/* Project Name */}
                <TextField
                    ref = {this.projectNameRef}
                    label = 'Project Name'
                    value = {projectName}
                    autoCorrect = {false}
                    returnKeyType = 'next'
                    autoCapitalize = 'words'
                    labelHeight = {24}
                    onChangeText = {(text) => {
                        project.projectName = text;
                        this.setState({project});
                    }}
                    onSubmitEditing = {this._onSubmitProjectName}
                    onFocus = {this._onFocus}
                    error = {errors.projectName}
                />
            {/* project Description */}
                <TextField
                    ref = {this.projectDescriptionRef}
                    label = 'Project Description'
                    value = {projectDescription}
                    autoCorrect = {true}
                    returnKeyType = 'done'
                    autoCapitalize = 'sentences'
                    labelHeight = {24}
                    onChangeText = {(text) => {
                        project.projectDescription = text;
                        this.setState({project});
                    }}
                    onSubmitEditing = {this._onSubmitProjectDescription}
                    onFocus = {this._onFocus}
                    error = {errors.projectDescription}
                />
            </View>
            {/* start date */}
            <TouchableWithoutFeedback
                onPress = {() => this.setState({
                    showStartDatePicker: ~showStartDatePicker
                })}
            >
                <View style = {[s.listContainer, s.borderBottom]}>
                <View style = {s.dateContainer}>
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
                <View style = {s.dateContainer}>
                    <Text style = {cs.normalText}>End Date</Text>
                    <Text style = {cs.h5}>{projectEndDate.toDateString()}</Text>
                </View>
                </View>
            </TouchableWithoutFeedback>
            {showEndDatePicker ? endDatePicker : null}
            <View style = {s.button}>
                <Button
                    testID = 'createButton'
                    title = {this.state.isSubmitting ? 'Submitting...': 'Submit'}
                    color = '#66a3ff'
                    onPress = {this._onSubmit}
                    disabled = {this.state.isSubmitting}
                />
            </View>
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
        padding: 10,
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