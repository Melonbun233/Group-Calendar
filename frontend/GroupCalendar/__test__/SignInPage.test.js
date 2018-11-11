import React from 'react';
import SignInPage from '../src/SignInPage';
import {configure, shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { NativeModules } from 'react-native';

configure({ adapter: new Adapter() });
jest.mock('react-native-google-signin');


describe('SignInPage test', () => {

	test('renders SignInPage', () => {
		const tree = shallow(<SignInPage/>);
		expect(tree).toMatchSnapshot();
	});

	// test('click sign in buttons', () => {
	// 	const tree = shallow(<SignInPage />).dive()
	// 		.find('Ripple')
	// 		.first().props().onPress();

	// 	expect(tree).toMatchSnapshot();
	// });

	// test('click sign up buttons', () => {
	// 	const tree = shallow(<SignInPage />).dive()
	// 	find('Button')
	// 	.forEach((child) => {
	// 		child.props().onPress();
	// 	})
	// 	expect(tree).toMatchSnapshot();
	// });
});