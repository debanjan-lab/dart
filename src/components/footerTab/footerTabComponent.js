import React, { Component } from "react";
import { Text, Image } from "react-native";
import { Footer, FooterTab, Button, Icon } from "native-base";
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
      <Footer>
        <FooterTab style={{ backgroundColor: colorCode.lightBlue }}>
          <Button
            style={tabIndex == 0 ? { opacity: 1 } : { opacity: 0.5 }}
            onPress={() => {
              this.navigateTo(props, 0, "homeStack");
            }}
          >
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
          </Button>

          <Button
            style={tabIndex == 3 ? { opacity: 1 } : { opacity: 0.5 }}
            onPress={() => {
              this.navigateTo(props, 3, "moreStack");
            }}
          >
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
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}
