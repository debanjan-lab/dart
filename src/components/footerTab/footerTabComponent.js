import React, { Component } from "react";
import { Text, Image, View, TouchableOpacity } from "react-native";
import colorCode from "../../config/commonColor";
import Language from "../../translations/index";
let tabIndex = 0;

export default class FooterTabComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: "en",
    };
  }

  componentDidMount() {
    this.setState({
      selectedLanguage: "fr",
    });
  }

  navigateTo(props, index, stack) {
    props.navigation.navigate(stack);
    tabIndex = index;
  }

  render() {
    const { props } = this.props;
    return (
      <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colorCode.lightBlue }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity style={{ width: 100, alignItems: 'center' }} onPress={() => {
            this.navigateTo(props, 0, "homeStack");
          }}>

            {tabIndex == 0 ? (
              <Image
                source={require("../../../assets/images/home-active.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            ) : (
                <Image
                  source={require("../../../assets/images/home-inactive.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              )}

            <Text style={{ color: tabIndex == 0 ? "#fff" : "#eee" }}>
              {" "}
              {Language[this.state.selectedLanguage]["common"]["home"]}
            </Text>


          </TouchableOpacity>


        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity style={{ width: 100, alignItems: 'center' }} onPress={() => {
            this.navigateTo(props, 3, "moreStack");
          }}>

            {tabIndex == 3 ? (
              <Image
                source={require("../../../assets/images/more_active.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            ) : (
                <Image
                  source={require("../../../assets/images/more_inactive.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              )}

            <Text style={{ color: tabIndex == 0 ? "#fff" : "#eee" }}>
              {" "}
              {Language[this.state.selectedLanguage]["common"]["more"]}
            </Text>


          </TouchableOpacity>

        </View>


      </View>
    );
  }
}
