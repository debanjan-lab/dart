import navigationConfig from "./routingConfig";
import { createStackNavigator } from "react-navigation";

/**
 * Create stack as per requirement
 */
export const authStackNavigator = createStackNavigator(
  navigationConfig.Screen.authStackScreens,
  {
    headerMode: "none",
    initialRouteName: "StartPage"
  }
);

export const homeStackNavigator = createStackNavigator(
  navigationConfig.Screen.homeStackScreens,
  {
    headerMode: "none",
    initialRouteName: "dashboardPage"
  }
);

export const moreStackNavigator = createStackNavigator(
  navigationConfig.Screen.moreStackScreens,
  {
    headerMode: "none"
  }
);
