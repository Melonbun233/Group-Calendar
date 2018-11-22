'user strict';

import React, {Component} from 'react';
import {Text, View, StyleSheet, Alert, Button, ScrollView, 
     ActivityIndicator} from 'react-native';
import Network from './common/GCNetwork';
import cs from './common/CommonStyles';
import Storage from './common/Storage';
import {TextField} from 'react-native-material-textfield';
import validate from 'validate.js';
import {changePwdConstraints} from './common/validation';

export default class ChangePwd extends Component {
    static navigationOptions = {
		title: 'Change Password',
    }
    
    constructor(props) {
        super(props);

        this.state = {
            isLoading : true,
            isUpdating: false,
            userNewPwd: '',
            userOldPwd: '',
            errors: {},
        }
        this._onSubmit = this._onSubmit.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onSubmitNewPwd = this._onSubmitNewPwd.bind(this);
        this._onSubmitOldPwd = this._onSubmitOldPwd.bind(this);

        this.userNewPwdRef = this._updateRef.bind(this, 'userNewPwd');
        this.userOldPwdRef = this._updateRef.bind(this, 'userOldPwd');
    }

    async componentDidMount() {
        try {
            let profile = await Storage.getProfile();
            let userId = profile.userId;
            let userEmail = profile.userEmail;
            this.setState({
                isLoading: false,
                userId,
                userEmail
            });
        } catch (error) {
            Alert.alert('Something went wrong');
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

    _onSubmitOldPwd = () => {
        this.userNewPwdRef.focus();
    }

    _onSubmitNewPwd = () => {
        this.userNewPwdRef.blur();
    }

    _onSubmit = async () => {
        let {userEmail, userNewPwd, userId, userOldPwd, errors} = this.state;
        this.setState({isUpdating: true});
        //validate
        let invalid = validate({
            userNewPwd,
            userOldPwd,
        }, changePwdConstraints, {fullMessages: false});

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
        try {
            let status = await Network.verifyUser(userEmail, userOldPwd);
            if (status == 200) {
                status = await Network.updatePwd(userId, userNewPwd);
                if (status == 200) {
                    Alert.alert('Success!');
                    this.props.navigation.goBack();
                } else {
                    Alert.alert('Invalid New Password');
                }
            } else {
                this.setState({errors: {userOldPwd: 'old password incorrect'}});
            }
        } catch (error) {
            Alert.alert('Something went wrong');
        }
        this.setState({isUpdating: false});
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
        let {userOldPwd, userNewPwd, errors} = this.state;
        return (
            <ScrollView
                style = {[s.scrollContainer]}
				keyboardShouldPersistTaps = 'never'
			>  
                <View style = {[s.contentContainer]}>
					<TextField
                        ref = {this.userOldPwdRef}
						testID = 'userOldPwd'
						label = 'Old Password'
						value = {userOldPwd}
						onChangeText = {(text) => this.setState({userOldPwd: text})}
						autoCorrect = {false}
						autoCapitalize = 'none'
						secureTextEntry = {true}
                        labelHeight = {28}
                        returnKeyType = 'next'
                        onSubmitEditing = {this._onSubmitOldPwd}
                        onFocus = {this._onFocus}
                        error = {errors.userOldPwd}
                        title = 'length should between 6 and 14'
					/>
				</View>
                <View style = {[s.contentContainer]}>
					<TextField
                        ref = {this.userNewPwdRef}
						testID = 'userNewPwd'
						label = 'New Password'
						value = {userNewPwd}
						onChangeText = {(text) => this.setState({userNewPwd: text})}
						autoCorrect = {false}
						autoCapitalize = 'none'
						secureTextEntry = {true}
                        labelHeight = {28}
                        returnKeyType = 'done'
                        onSubmitEditing = {this._onSubmitNewPwd}
                        onFocus = {this._onFocus}
                        error = {errors.userNewPwd}
                        title = 'length should between 6 and 14'
					/>
				</View>
                <Button
                    disabled = {isUpdating}
					onPress = {this._onSubmit}
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
})