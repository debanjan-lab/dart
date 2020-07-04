import React, { Component } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { ToastMessage } from "./src/components/ToastMessage";

import AsyncStorage from "@react-native-community/async-storage";
import {
  SwitchStackAuthStack,
  SwitchStackAppStack,
} from "./src/config/route/switchStack";
import StatusBarComponent from "./src/components/statusBar/statusBarComponent";
import OneSignal from "react-native-onesignal";
let notificationDetails = "";
const prefix = "dart://";

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: null,
    };
    OneSignal.setLogLevel(6, 0);
    OneSignal.inFocusDisplaying(2);
    OneSignal.init("192b5885-9d77-4e2d-b5eb-d641e8e74bba", {
      kOSSettingsKeyAutoPrompt: true,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.addEventListener("ids", this.onIds);
  }

  async componentDidMount() {
    OneSignal.getPermissionSubscriptionState((status) => {
      if (status.notificationsEnabled) {
        OneSignal.addEventListener("ids", this.onIds);
      }
    });
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
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
    // OneSignal.addEventListener("opened", this.onOpened);
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
