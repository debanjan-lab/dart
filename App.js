import React, {Component} from 'react';
import {StyleSheet, View, StatusBar, ActivityIndicator} from 'react-native';
import OneSignal from 'react-native-onesignal'; // Import package from node modules

// 9748116201
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';

//AUTH
import StartScreen from './src/screens/start/startScreen';
import LoginScreen from './src/screens/login/loginScreen';
import ForgotPasswordScreen from './src/screens/forgotPassword/forgotPasswordScreen';
import RegisterOneScreen from './src/screens/registerOne/registerOneScreen';
import OtpVerifyScreen from './src/screens/otpVerify/otpVerifyScreen';
import RegisterTwoScreen from './src/screens/registerTwo/registerTwoScreen';

//APP
import DashboardScreen from './src/screens/dashboard/dashboardScreen';
import CompletedCircle from './src/screens/circle/completedCircle';
import CompletedCircleDetails from './src/screens/circle/completedCircleDetails';
import InvitationCercleTwoScreen from './src/screens/invitationCircleTwo/invitationCercleTwoScreen';

import RefusalInvitationScreen from './src/screens/refusalInvitation/refusalInvitationScreen';
import AcceptInvitaionScreen from './src/screens/acceptInvitaion/acceptInvitaionScreen';
import BankDetailsScreen from './src/screens/bankDetails/bankDetailsScreen';

import OnGoingCircleScreen from './src/screens/onGoingCircle/onGoingCircleScreen';

import BlockCircleOneScreen from './src/screens/blockCircleOne/blockCircleOneScreen';
import SuspendedSavingOneScreen from './src/screens/suspendedSavingOne/suspendedSavingOneScreen';
import EditProfileScreen from './src/screens/profile/editProfileScreen';

import CreateCircleScreen from './src/screens/circle/create';
import SearchParticipantsScreen from './src/screens/circle/search';
import PhoneContacsScreen from './src/screens/phoneContacs/phoneContacsScreen';

import CreateCirclePreviewScreen from './src/screens/circle/createpreview';
import ChangeOrderParticipantsScreen from './src/screens/circle/changeorder';

import MoreScreen from './src/screens/more';

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this._loadOneSignal();
  }

  _loadOneSignal() {
    //Remove this method to stop OneSignal Debugging
    OneSignal.setLogLevel(6, 0);

    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init('a7be7046-5ab6-447c-bc1e-0d95d1217191', {
      kOSSettingsKeyAutoPrompt: true,
    });
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    // OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds = (device) => {
    console.log('device', device);

    AsyncStorage.setItem('device_token', device.userId).then(() => {
      this._bootstrapAsync();
    });
  };

  _bootstrapAsync = async () => {
    const value = await AsyncStorage.getItem('rememberToken');

    setTimeout(() => {
      this.props.navigation.navigate(value ? 'App' : 'Auth');
    }, 1000);
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={'#1CCBE6'} size="large" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppStack = createStackNavigator(
  {
    dashboardPage: {
      screen: DashboardScreen,
    },
    completedCircle: {
      screen: CompletedCircle,
    },
    completedCircleDetails: {
      screen: CompletedCircleDetails,
    },
    rejectJoinPage: {
      screen: InvitationCercleTwoScreen,
    },

    refusalPage: {
      screen: RefusalInvitationScreen,
    },
    acceptInvitaionPage: {
      screen: AcceptInvitaionScreen,
    },

    bankDetailsPage: {
      screen: BankDetailsScreen,
    },

    ongingPage: {
      screen: OnGoingCircleScreen,
    },

    blockCircleOnePage: {
      screen: BlockCircleOneScreen,
    },

    suspendedScreen: {
      screen: SuspendedSavingOneScreen,
    },
    MoreScreen: {
      screen: MoreScreen,
    },
    EditProfileScreen: {
      screen: EditProfileScreen,
    },

    createCirclePage: {
      screen: CreateCircleScreen,
    },
    searchParticipantPage: {
      screen: SearchParticipantsScreen,
    },
    phoneContactPage: {
      screen: PhoneContacsScreen,
    },
    circlePreviewPage: {
      screen: CreateCirclePreviewScreen,
    },
    changeOrderPage: {
      screen: ChangeOrderParticipantsScreen,
    },
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
    initialRouteName: 'dashboardPage',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);
const AuthStack = createStackNavigator(
  {
    loginPage: {
      screen: LoginScreen,
    },
    forgotPasswordPage: {
      screen: ForgotPasswordScreen,
    },
    registerOnePage: {
      screen: RegisterOneScreen,
    },
    otpVerifyPage: {
      screen: OtpVerifyScreen,
    },
    RegisterTwoPage: {
      screen: RegisterTwoScreen,
    },
    StartPage: {
      screen: StartScreen,
    },
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
    initialRouteName: 'StartPage',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
