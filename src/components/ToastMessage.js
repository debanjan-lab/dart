/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";

import Toast from "react-native-simple-toast";

const ToastMessage = (text) => {
  Toast.showWithGravity(text, Toast.LONG, Toast.BOTTOM);
};
export { ToastMessage };
