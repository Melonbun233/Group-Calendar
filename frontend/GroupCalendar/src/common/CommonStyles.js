'user strict';
//This is the common style sheets.

import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
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
		alignItems: 'center',
	},
	//all items are dropped to bottom on the same column
	flowBottom: {
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	//all items are flowed to left on the same row
	flowLeft: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	//all items are flowed to right on the same row
	flowRight: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
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
})