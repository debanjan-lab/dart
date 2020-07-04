import {
  authStackNavigator,
  homeStackNavigator,
  moreStackNavigator
} from "./stack";
import { createSwitchNavigator } from "react-navigation";

/**
 * This is the main stacks
 */

const STACKS = {
  authStack: {
    screen: authStackNavigator
  },
  homeStack: {
    screen: homeStackNavigator
  },
  moreStack: {
    screen: moreStackNavigator
  }
};
export const SwitchStackAuthStack = createSwitchNavigator(STACKS, {
  initialRouteName: "authStack"
});
export const SwitchStackAppStack = createSwitchNavigator(STACKS, {
  initialRouteName: "homeStack"
});
