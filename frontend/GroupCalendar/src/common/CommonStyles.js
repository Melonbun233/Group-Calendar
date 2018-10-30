'user strict';
//This is the common style sheets.

import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	wholePage: {
		width: '100%',
		height: '100%',
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	title: {
		fontSize: 60,
		fontWeight: 'bold',
		color: '#000000',
	},
	//all items are on the top on the same column
	flowTop: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
	},
	//all items are dropped to bottom on the same column
	flowBottom: {
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
	//all items are flowed to left on the same row
	flowLeft: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	//all items are flowed to right on the same row
	flowRight: {
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
	//basically just align item
	flowStart: {
		alignItems: 'flex-start',
	},
	//basically just align item
	flowEnd: {
		alignItems: 'flex-end',
	},
	//heading 1
	h1: {
		fontSize: 50,
		fontWeight: 'bold',
		color: '#000000',
	},
	//heading 2
	h2: {
		fontSize: 40,
		fontWeight: 'bold',
		color: '#000000',
	},
	//heading 3
	h3: {
		fontSize: 30,
		fontWeight: 'bold',
		color: '#000000',
	},
	h4: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#e6e6e6',
	},
	h5: {
		fontSize: 18,
		fontWeight: 'normal',
		color: '#808080',
	},
	//normal text
	normalText: {
		fontSize: 24,
		fontWeight: 'normal',
		color: '#000000',
	},
	//small
	smallText: {
		fontSize: 12,
		fontWeight: 'normal',
		color: '#b3b3b3',
	},
	//used for debug
	focus1: {
		backgroundColor: '#ff0000',
	},
	focus2: {
		backgroundColor: '#00ff00',
	},
	blue: {
		color: '#66a3ff',
	},
	black: {
		color: '#000000',
	},
	white: {
		color: '#ffffff',
	},
});

export const color = {
	blue: '#66a3ff',
	black: '#000000',
	white: '#ffffff',
}