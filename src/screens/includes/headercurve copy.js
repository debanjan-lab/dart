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


<ImageBackground
  source={require("../../../assets/images/header.png")}
  style={{width: '100%', height: '100%'}}
> 
  
</ImageBackground>



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
       


        {this.props.avatar_location ? (
          <View
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
        ) :
          null}
       
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
       
        <Image
          style={{ bottom: "1%", height: 200, width: "100%" }}
          source={require("../../../assets/images/header.png")}
          resizeMode={'cover'}
        />
      
      </View>
    );
  }
}

