import {StyleSheet} from 'react-native';

const relaunchStyle = StyleSheet.create({
	thPadding:{
		paddingBottom:20, paddingTop:20
	},
	mainContent:{
		padding:20
	},
	headerText:{
		alignItems:'center'
	},
	title:{
		fontSize:20,
		fontWeight: 'bold'
	},
	rowView:{
		flexDirection: 'row',
		borderColor: '#ccc',
		borderBottomWidth: 0.5,
	},
	rowViewLeftItem:{
		flex: 5,
		alignSelf:'flex-start',
		paddingBottom:20,
		paddingTop:20,
	},
	rowViewRightItem:{
		flex: 0,
		alignSelf:'flex-end',
		paddingBottom:20,
		paddingTop:20
	},
	rowText:{
		fontSize:15,
		fontWeight: 'bold',
		color:'#494949'
	},
	rowTextValue:{
		color:'#4A4A4A'
	},
	thPadding:{
		paddingBottom:20, paddingTop:20
	},
	nextRowViewLeftItem:{
		width: '70%'
	},
	nextRowViewRightItem:{
		width: '10%',alignItems:'flex-end'
	},
	rowViewMiddleItem:{
		width: '20%',alignItems:'flex-start'
	},
	rowViewNew:{
		borderColor: '#ccc',
		borderBottomWidth: 0.5,
	},
	sendButtonView:{
		marginTop:10
	},
	sendButton:{
		width:'100%',
		borderRadius: 50,
		backgroundColor:'#5AC6C6',
		alignItems:'center',
		padding:14,
		// elevation:2,
		// shadowOffset: { width: 0, height: 0 },
		// shadowColor: "rgba(0,0,0,0.03)",
		// shadowOpacity: 0.5,
		// shadowRadius: 10,
	},
	sendButtonText:{
		color:'white',
		fontSize:18
	}
});

export default relaunchStyle;