import React from 'react';
import SignInPage from '../src/SignInPage';
import {shallow, render} from 'enzyme';
import sinon from 'sinon';

//mock navigation and spy on it
const navigation = {
	navigate : jest.fn(),
	push : sinon.spy(),
}

describe('SignInPage test', () => {
	const checkUserSignedInSpy = sinon.spy(SignInPage.prototype, 'checkUserSignedIn');
	const appSignInSpy = sinon.spy(SignInPage.prototype, '_onSignInButtonPressed');
	const googleSignInSpy = sinon.spy(SignInPage.prototype, '_onGoogleSignInPressed');
	const focusSpy = sinon.spy(SignInPage.prototype, '_onFocus');
	const submitEmailSpy = sinon.spy(SignInPage.prototype, '_onSubmitEmail');
	const submitPasswordSpy = sinon.spy(SignInPage.prototype, '_onSubmitPassword');
	var wrapper;

	beforeEach(() => {
		wrapper = shallow(<SignInPage 
			navigation = {navigation}
		/>, { lifecycleExperimental: true });

		wrapper.setState({isChecking: false,});
		wrapper.instance().password = {
			blur: jest.fn(),
			focus: jest.fn(),
		};
	});

	test('renders SignInPage', () => {
		expect(wrapper).toMatchSnapshot();
	});

	test('component did mount', () => {
		wrapper.instance().checkUserSignedIn();
		expect(checkUserSignedInSpy.callCount).toBe(1);
	});

	test('update ref', () => {
		wrapper.instance()._updateRef('test', 'testRef');
		expect(wrapper.instance().test).toBe('testRef');
	});

	test('change user email', () => {
		wrapper.find({testID: 'UserEmail'}).simulate('ChangeText', 'testEmail');
		expect(wrapper.instance().state.userEmail).toBe('testEmail');
	});

	test('change user password', () => {
		wrapper.find({testID: 'UserPwd'}).simulate('ChangeText', 'testPwd');
		expect(wrapper.instance().state.userPwd).toBe('testPwd');
	});
	
	test('focus text field', () => {
		wrapper.find('TextField')
			.forEach((child) => {
				child.simulate('Focus');
			})
		expect(focusSpy.callCount).toBe(2);
	})

	test('submit editing email', () => {
		wrapper.find({testID: 'UserEmail'}).simulate('SubmitEditing');
		expect(submitEmailSpy.callCount).toBe(1);
	});

	test('submit editing password', () => {
		wrapper.find({testID: 'UserPwd'}).simulate('SubmitEditing');
		expect(submitPasswordSpy.callCount).toBe(1);
		expect(appSignInSpy.callCount).toBe(1);
	});

	test('click App sign in buttons', () => {
		wrapper.find({testID: 'AppSignInButton'}).simulate("Press");
		expect(appSignInSpy.callCount).toBe(2);
	});

	test('click Google sign in buttons', () => {
		wrapper.find({testID: 'GoogleSignInButton'}).simulate("Press");
		expect(googleSignInSpy.callCount).toBe(1);
	});

	test('click sign up buttons', () => {
		wrapper.find({testID: 'SignUpButton'}).simulate("Press");
		expect(navigation.push.callCount).toBe(1);
	});
});