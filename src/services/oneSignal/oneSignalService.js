import OneSignal from "react-native-onesignal";

class OneSignalService {
  oneSignalInitialized() {
    OneSignal.setLogLevel(6, 0);
    OneSignal.inFocusDisplaying(2);
    OneSignal.init("192b5885-9d77-4e2d-b5eb-d641e8e74bba", {
      kOSSettingsKeyAutoPrompt: true,
      kOSSettingsKeyInFocusDisplayOption: 2
    });
  }

  oneSignalAddLitener() {
    OneSignal.addEventListener("ids", this.onIds);
  }

  removeLitener() {
    OneSignal.removeEventListener("ids", this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  }

  async onIds(device) {
    try {
      await AsyncStorage.setItem("device_token", device.userId);
    } catch (error) {
      console.log(error);
    }
  }
}
export default new OneSignalService();
