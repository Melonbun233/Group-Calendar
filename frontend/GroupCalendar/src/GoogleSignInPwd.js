'user strict';

import React, {Component} from 'react';
import {View, StyleSheet, Alert, Button, ScrollView, 
     ActivityIndicator} from 'react-native';
import Network from './common/GCNetwork';
import cs from './common/CommonStyles';
import Storage from './common/Storage';
import {TextField} from 'react-native-material-textfield';
import validate from 'validate.js';
import {setGooglePwdConstraints} from './common/validation';

export default class GoogleSignInPwd extends Component {
    static navigationOptions = {
        title: 'Set up Password'
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isSubmitting: false,
            pwd: '',
            error: '',
        }

        this.pwdRef = this._updateRef.bind(this, 'pwd');
    }

    componentDidMount = async() => {
        try{
            let profile = await Storage.getProfile();
            let userId = profile.userId;
            this.setState({
                isLoading: false,
                userId
            });
        } catch(error) {
            Alert.alert('Something went wrong');
            await Storage.deleteAll();
            this.props.navigation.goBack();
        }
    }

    _updateRef(name, ref) {
        this[name] = ref;
    }

    _onFocus = () => {
        this.setState({error:''});
    }

    _onSubmitPwd = () => {
        this.pwd.blur();
    }

    _onSubmit = async () => {
        let {userId, pwd, error} = this.state;
        this.setState({isSubmitting: true});

        let invalid = validate({
            pwd: pwd
        }, setGooglePwdConstraints, {fullMessages: false});

        if (invalid) {
            for (let key in invalid) {
                let val = invalid[key][0];
                error = val;
            }
            this.setState({
                isSubmitting: false,
                error
            });
            return;
        }

        try {
            let status = await Network.updatePwd(userId, pwd);
            switch(status) {
                case 200: {
                    this.setState({isSubmitting: false});
                    await Storage.setSignInByGoogle('true');
                    this.props.navigation.navigate('Main');
                }
                break;
                default: {
                    Alert.alert('Internet Error ' + status.toString());
                }
            }
        } catch (error) {
            Alert.alert('Something went wrong');
            await Storage.deleteAll();
            this.props.navigation.goBack();
        }
        this.setState({isSubmitting: false});
    }

    render() {
        let {isLoading} = this.state;
        if (isLoading) {
            return (
                <View style = {cs.container}>
                    <ActivityIndicator size = 'large'/>
                </View>
            );
        }
        let {pwd, error, isSubmitting} = this.state;
        return(
            <ScrollView
                style = {[s.scrollContainer]}
				keyboardShouldPersistTaps = 'never'
			>
                <View style = {[s.contentContainer]}>
					<TextField
                        ref = {this.pwdRef}
						testID = 'userPwd'
						label = 'Password'
						value = {pwd}
						onChangeText = {(text) => this.setState({pwd: text})}
						autoCorrect = {false}
						autoCapitalize = 'none'
						secureTextEntry = {true}
                        labelHeight = {28}
                        returnKeyType = 'done'
                        onSubmitEditing = {this._onSubmitPwd.bind(this)}
                        onFocus = {this._onFocus.bind(this)}
                        error = {error}
                        title = 'length should between 6 and 14'
					/>
				</View>
                <Button
					disabled = {isSubmitting}
					onPress = {this._onSubmit.bind(this)}
					title = {isSubmitting ? 'Submitting...' : 'Submit'}
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