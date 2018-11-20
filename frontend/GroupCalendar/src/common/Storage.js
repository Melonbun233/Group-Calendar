'user strict';

import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';

export default class Storage extends Component {

    static async getSignInByGoogle() {
        try{
            let ret = await AsyncStorage.getItem('signInByGoogle', null);
            return ret;
        } catch (error) {
            throw error;
        }
    }

    //get cookie object from async storage
    static async getCookie() {
        let ret = null;
        try {
            let cookie = await AsyncStorage.getItem('cookie', null);
            if (cookie) {
                ret = JSON.parse(cookie);
            }
            return ret;
        } catch (error) {
            throw error;
        }
    }

    //get profile project from async storage
    static async getProfile() {
        let ret = null;
        try {
            let profile = await AsyncStorage.getItem('profile');
            if (profile) {
                ret = JSON.parse(profile);
            }
            return ret;
        } catch(error) {
            throw error;
        }
    }

    static async getProject() {
        let ret = null;
        try {
            let project = await AsyncStorage.getItem('project');
            if (project) {
                ret = JSON.parse(project);
            }
            return ret;
        } catch (error) {
            throw error;
        }
    }

    static async setProject(project) {
        let ret = null;
        try {
            await AsyncStorage.setItem('project',
                JSON.stringify(project));
        } catch (error) {
            throw error;
        }
    }

    //set cookie object
    static async setCookie(cookie) {
        try {
            await AsyncStorage.setItem('cookie', 
                JSON.stringify(cookie));
        } catch (error) {
            throw error;
        }
    }

    //set profile object
    static async setProfile(profile) {
        try {
            await AsyncStorage.setItem('profile',
                JSON.stringify(profile));
        } catch (error) {
            throw error;
        }
    }

    static async setSignInByGoogle(flag) {
        try {
            await AsyncStorage.setItem('signInByGoogle',flag);
        } catch (error) {
            throw error;
        }
    }

    //clean all storages
    static async deleteAll() {
        try {
            await AsyncStorage.removeItem('cookie');
            await AsyncStorage.removeItem('profile');
            await AsyncStorage.removeItem('signInByGoogle');
        } catch (error) {
            throw error;
        }
    }
}