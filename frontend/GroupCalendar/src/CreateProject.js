'user strict';

import React, {Component} from 'react';
import {KeyboardAvoidingView, View, ScrollView, StyleSheet, ActivityIndicator,
    Text, Button} from 'react-native';
import cs from './common/CommonStyles';
import {TextField} from 'react-native-material-textfield';

export default class CreateProject extends Component {
    static navigationOptions = {
        title : 'Create Project'
    }

    constructor(props) {
        super(props);

        this.state = {
            project: {},
            errors: {},
            isLoading: true,
        };
        this._onFocus = this._onFocus.bind(this);
        this._onSubmit = this._onSubmit.bind(this);

        this._onSubmitProjectName = this._onSubmitProjectName.bind(this);
        this._onSubmitProjectDescription = this._onSubmitProjectDescription.bind(this);
        
        this.projectNameRef = this._updateRef.bind(this, 'projectName');
        this.projectDescriptionRef = this._updateRef.bind(this, 'projectDescription');

    }

    async componentDidMount() {
        let {navigation} = this.props;
        const profile = navigation.getParam('profile', null);
        if (profile) {
            this.setState({
                profile,
                isLoading: false,
            });
        } else {
            alert.alert('Something Bad Happened');
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

    _onSubmit(){

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
        let {errors} = this.state;
        let {projectName, projectDescription} = this.state.project;
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
                    onChangeText = {(text) => this.setState({
                        project: {projectName: text}
                    })}
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
                    onChangeText = {(text) => this.setState({
                        project: {projectDescription: text}
                    })}
                    onSubmitEditing = {this._onSubmitProjectDescription}
                    onFocus = {this._onFocus}
                    error = {errors.projectDescription}
                />
            </View>
            <View style = {s.button}>
                <Button
                    testID = 'createButton'
                    title = 'Submit'
                    color = '#66a3ff'
                    onPress = {this._onSubmit}
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
        marginLeft: '15%',
        width: '70%',
    },
    button: {
        padding: 10,
    }
});