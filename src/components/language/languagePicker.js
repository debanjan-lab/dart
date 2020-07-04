import React, { Component } from "react";
import { Picker, Icon } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";

export default class LanguagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: "en"
    };
  }

  async onValueChange(value) {
    this.setState({
      selectedLanguage: value
    });
    await AsyncStorage.setItem("language", value);
  }
  render() {
    return (
      <Picker
        mode="dropdown"
        iosHeader="Select your SIM"
        iosIcon={<Icon name="arrow-down" />}
        style={{ width: 80 }}
        selectedValue={this.state.selected}
        onValueChange={this.onValueChange.bind(this)}
      >
        <Picker.Item label="English" value={`en`} />
        <Picker.Item label="Hindi" value={`hin`} />
        <Picker.Item label="Itali" value={`it`} />
      </Picker>
    );
  }
}
