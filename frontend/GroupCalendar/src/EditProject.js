//only used for editing project name
'user strict';

import React, {Component} from 'react';
import {Text, View, StyleSheet, Alert, Button, ScrollView, 
     ActivityIndicator} from 'react-native';
import Network from './common/GCNetwork';
import cs from './common/CommonStyles';
import {TextField} from 'react-native-material-textfield';
import validate from 'validate.js';
import {createProjectConstraints} from './common/validation';

export default class EditProject extends Component {
    static navigationOptions = {
		title: '',
    }
    
    constructor(props) {
        super(props);

        this.state = {
            isLoading : true,
            isUpdating: false,
            projectName: '',
            projectDescription: '',
            errors: {},
        }
        this._onSubmit = this._onSubmit.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onSubmitProjectName = this._onSubmitProjectName.bind(this);
        this._onSubmitProjectDescription = this._onSubmitProjectDescription.bind(this);

        this.projectNameRef = this._updateRef.bind(this, 'projectName');
        this.projectDescriptionRef = this._updateRef.bind(this, 'projectDescription');
    }

    componentDidMount() {
        let {navigation} = this.props;
        let project = navigation.getParam('project', null);
        let profile = navigation.getParam('profile', null);
        let refresh = navigation.getParam('refresh', null);

        if (project && profile && refresh) {
            this.setState({
                isLoading: false,
                project, profile, refresh,
                projectName: project.projectName,
                projectDescription: project.projectDescription
            })
        } else {
            Alert.alert('Something went wrong');
            navigation.goBack();
        }
    }

    _updateRef = (name, ref) => {
		this[name] = ref;
    }
    
    _onFocus = () => {
        let {errors} = this.state;
        for (let name in errors) {
            let ref = this[name];
            if(ref.isFocused()) {
                delete errors[name];
            }
        }
        this.setState({errors});
    }

    _onSubmitProjectName = () => {
        this.projectDescription.focus();
    }

    _onSubmitProjectDescription = () => {
        this.projectDescription.blur();
        this._onSubmit();
    }

    _onSubmit = async () => {
        let {projectName, projectDescription, errors} = this.state;
        this.setState({isUpdating: true});
        //validate
        let invalid = validate({
            projectName,
            projectDescription,
        }, createProjectConstraints, {fullMessages: false});

        if (invalid) {
            for (let key in invalid) {
                let val = invalid[key][0];
                errors[key] = val;
            }
            this.setState({
                isUpdating: false,
                errors
            });
            return;
        }
        let {project, profile} = this.state;
        try {
            let status = await Network.updateProject(project.projectId,
                profile.userId, {projectName, projectDescription});
            if (status == 200) {
                await this.state.refresh(false);
            } else {
                Alert.alert('Internet Error ', status.toString());
            }
        } catch (error) {
            Alert.alert('Something went wrong');
        }
        this.setState({isUpdating: false});
        this.props.navigation.goBack();
    }


    render() {
        let {isLoading, isUpdating} = this.state;
        if (isLoading) {
            return (
                <View style = {cs.container}>
                    <ActivityIndicator size = 'large'/>
                </View>
            );
        }
        let {projectName, projectDescription, errors} = this.state;
        return (
            <ScrollView
                style = {[s.scrollContainer]}
				keyboardShouldPersistTaps = 'never'
			>  
                <View style = {[s.contentContainer]}>
					<TextField
                        ref = {this.projectNameRef}
						testID = 'projectName'
						label = 'Project Name'
						value = {projectName}
						onChangeText = {(text) => this.setState({projectName: text})}
						autoCorrect = {false}
						autoCapitalize = 'words'
						secureTextEntry = {false}
                        labelHeight = {28}
                        returnKeyType = 'next'
                        onSubmitEditing = {this._onSubmitProjectName.bind(this)}
                        onFocus = {this._onFocus.bind(this)}
                        error = {errors.projectName}
					/>
				</View>
                <View style = {[s.contentContainer]}>
					<TextField
                        ref = {this.projectDescriptionRef}
						testID = 'projectDescription'
						label = 'Project Description'
						value = {projectDescription}
						onChangeText = {(text) => this.setState({projectDescription: text})}
						autoCorrect = {true}
						autoCapitalize = 'sentences'
						secureTextEntry = {false}
                        labelHeight = {28}
                        returnKeyType = 'done'
                        onSubmitEditing = {this._onSubmitProjectDescription.bind(this)}
                        onFocus = {this._onFocus.bind(this)}
                        error = {errors.projectDescription}
					/>
				</View>
                <Button
                    disabled = {isUpdating}
					onPress = {this._onSubmit.bind(this)}
					title = {isUpdating ? 'Submitting...' : 'Submit'}
                />
            </ScrollView>
        );
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
});