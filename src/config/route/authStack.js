import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from "../../screens/login/loginScreen";





const AuthStackNavigator = createStackNavigator({
    LoginScreen: {
        screen: LoginScreen,
    },


});

export default createAppContainer(AuthStackNavigator);
