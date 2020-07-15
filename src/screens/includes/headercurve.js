import React, { Component } from "react";
import {
  Platform,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Button,
  ImageBackground
} from "react-native";
let tabIndex = 0;


import DeviceInfo from 'react-native-device-info';


export default class HeaderCurve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }
  onPressBackPage = () => {
    // if (this.props.backAlert) {
    //   Alert.alert("Confirmation", "You will lose unsave data", [
    //     { text: "No", onPress: () => (No = "no") },
    //     { text: "OK", onPress: () => this.props.navigation.goBack() },
    //   ]);
    //   return true;
    // } else {
    //   this.props.navigation.goBack();
    // }
    // return true;

    this.props.navigation.goBack();
  };

  navigateTo(props, index, stack) {
    this.setState({
      isModalVisible: false,
    });
    props.navigation.navigate(stack);
    tabIndex = index;
  }

  render() {
    const { admin, first_name, props } = this.props;
    // let admin = {this.props.admin == 1 ? "(Admin)" : null}
    return (
      <View style={{ height: DeviceInfo.hasNotch() ? 160 : 120 }}>


        <ImageBackground
          source={require("../../../assets/images/header.png")}
          style={{ width: '100%', height: '100%' }}
        >


          <View style={{
            height: 60,

            top: DeviceInfo.hasNotch() ? 60 : 40,
            paddingLeft: 20,
            paddingRight: 20,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>

            {this.props.backButton ? (
              <TouchableOpacity
                onPress={() => this.onPressBackPage()}

              >
                <Image
                  source={require("../../../assets/images/arrow.png")}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </TouchableOpacity>
            ) :
              <View style={{ width: 30 }} />
            }



            {this.props.avatar_location ? (
              <View style={{ alignItems: 'center' }}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,

                  }}
                  source={this.props.avatar_location}
                />

                <Text
                  style={{
                    fontSize: 15,
                    color: "#FFFFFF",
                    fontWeight: "700",
                    marginTop: 5
                  }}
                >
                  {this.props.first_name}
                  {this.props.admin == 1 ? "(Admin)" : null}
                </Text>
              </View>
            ) : null}



            {this.props.title ? (
              <View>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {this.props.title}
                </Text>
              </View>
            ) : null}



            <View style={{ width: 30 }}>
              {this.props.bellIcon ? (
                this.props.searchIcon ? (


                  <TouchableOpacity
                    onPress={() => this.props.showSearchBar()}

                  >
                    <Image
                      source={require("../../../assets/images/search_white.png")}
                      style={{
                        width: 20,
                        height: 20,
                      }}
                    />
                  </TouchableOpacity>




                ) : null
              ) :
                null}

            </View>


          </View>

        </ImageBackground>

      </View>
    );
  }
}

