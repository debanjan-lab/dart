
import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import colorCode from '../../config/commonColor';
const statusBarBackgroundColor = colorCode.lightBlue;
const barStyle = 'light-content';

export default class StatusBarComponent extends Component {

	constructor(props){
		super(props);
	}

	render(){
		return(
			<StatusBar
				backgroundColor={statusBarBackgroundColor}
				barStyle={barStyle}
			/>
		);
	}
}