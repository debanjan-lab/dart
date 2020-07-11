import React, { Component } from "react";
import {
  Platform,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
let tabIndex = 0;

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
      <View>
        {/* start back Button */}
        {this.props.backButton ? (
          <TouchableOpacity
            style={{
              position: "absolute",
              zIndex: 1,
              top: 15,
              left: 10,
            }}
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
        ) : null}
        {/* end back Button */}

        {/* <Modal
          isVisible={this.state.isModalVisible}
          animationInTiming={200}
          animationOutTiming={200}
          //deviceHeight={250}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
          onSwipeComplete={() => this.setState({ isModalVisible: false })}
          onBackButtonPress={() => this.setState({ isModalVisible: false })}
        >
          <View
            style={{
              flex: 1,
              marginTop: 35,
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => {
                this.navigateTo(props, 0, "homeStack");
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 22 }}> Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => {
                this.navigateTo(props, 3, "moreStack");
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 22 }}> More</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => this.navigateTo()}
            >
              <Text style={{ color: "#ffffff", fontSize: 20 }}> Logout</Text>
            </TouchableOpacity> */}
        {/* </View> */}
        {/* </Modal>  */}

        {/* start avatar image */}
        {this.props.avatar_location ? (
          <View
            // onPress={() => this.setState({ isModalVisible: true })}
            style={{
              zIndex: 1,
              position: "absolute",
              //backgroundColor: "pink",
              alignSelf: "center",
              top: 5,
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "pink",
                alignSelf: "center",
              }}
              source={this.props.avatar_location}
            />

            <Text
              style={{
                fontSize: 16,
                color: "#FFFFFF",
                fontWeight: "700",
              }}
            >
              {this.props.first_name}
              {this.props.admin == 1 ? "(Admin)" : null}
            </Text>
          </View>
        ) : null}
        {/* end avatar image */}

        {/* start notification button */}
        {this.props.bellIcon ? (
          this.props.searchIcon ? (
            <TouchableOpacity
              onPress={() => this.props.showSearchBar()}
              style={{
                position: "absolute",
                zIndex: 1,
                right: 10,
                top: 18,
              }}
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
        ) : //  (
          //   <TouchableOpacity
          //     style={{
          //       position: "absolute",
          //       zIndex: 1,
          //       right: 10,
          //       top: 18,
          //       flexDirection: "row"
          //     }}
          //   >
          //     <Image
          //       style={{
          //         width: 20,
          //         height: 20,
          //         alignSelf: "flex-end"
          //       }}
          //       source={require("../../../assets/images/notification.png")}
          //     />
          //     <View
          //       style={{
          //         position: "relative",
          //         top: -10,
          //         right: 5,
          //         height: 20,
          //         width: 20,
          //         backgroundColor: "red",
          //         borderRadius: 10,
          //         alignItems: "center",
          //         justifyContent: "center"
          //       }}
          //     >
          //       <Text
          //         style={{
          //           color: "#FFFFFF",
          //           fontFamily: "Roboto-Bold",
          //           fontSize: 14
          //         }}
          //       >
          //         99
          //       </Text>
          //     </View>
          //   </TouchableOpacity>
          // )
          null}
        {/* end notification button */}
        {/* start title text */}
        {this.props.title ? (
          <Text
            style={{
              alignSelf: "center",
              zIndex: 1,
              position: "absolute",
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "600",
              top: 15,
            }}
          >
            {this.props.title}
          </Text>
        ) : null}
        {/* end title text */}
        {/* start main curve image */}
        <Image
          style={{ bottom: "1%", height: 80, width: "100%" }}
          source={require("../../../assets/images/header.png")}
        />
        {/* end main curve image */}
      </View>
    );
  }
}

