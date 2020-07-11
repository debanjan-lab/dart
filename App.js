import React, { Component } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { ToastMessage } from "./src/components/ToastMessage";

import OneSignal from 'react-native-onesignal';


import AsyncStorage from "@react-native-community/async-storage";
import {
  SwitchStackAuthStack,
  SwitchStackAppStack,
} from "./src/config/route/switchStack";
import StatusBarComponent from "./src/components/statusBar/statusBarComponent";
let notificationDetails = "";
const prefix = "dart://";

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: null,
    };


    OneSignal.setLogLevel(6, 0);

    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init("a7be7046-5ab6-447c-bc1e-0d95d1217191", { kOSSettingsKeyAutoPrompt: false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption: 2 });
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    //OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

  }

  async componentDidMount() {

  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log("Notification open: ", openResult);
  }

  async onIds(device) {
    console.log("token d", device.userId);
    try {
      await AsyncStorage.setItem("device_token", device.userId);
    } catch (error) {
      ToastMessage(error);
    }
  }

  componentWillMount() {
    this.checkLogin();
  }

  checkLogin = async () => {
    const value = await AsyncStorage.getItem("loggedIn");
    if (notificationDetails != "") {
      await AsyncStorage.setItem("notification_data", notificationDetails);
    }
    if (value != null) {
      this.setState({ isLogin: true });
    } else {
      this.setState({ isLogin: false });
    }
  };

  render() {
    if (this.state.isLogin != null) {
      return this.state.isLogin ? (
        <SwitchStackAppStack />
      ) : (
          <SwitchStackAuthStack />
        );
    } else {
      return (
        <View style={styles.container}>
          <StatusBarComponent />
          <Text style={[styles.welcome, { opacity: 0 }]}>Loading DART</Text>
        </View>
      );
    }
  }
}
const App = () => <AppContainer uriPrefix={prefix} />;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
});
export default App;
