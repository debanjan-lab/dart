import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.curveHeaderBlock}>
        {this.props.has_avatar ? (
          <TouchableOpacity
            style={styles.containerBackBlock}
            onPress={() => this._doRedirectLanding()}
          >
            <Image
              source={require("../../../assets/images/arrow.png")}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={styles.containerBackBlock}
            onPress={() => this._doRedirectLanding()}
          />
        )}

        {this.props.has_back_key ? (
          <TouchableOpacity onPress={() => this._doRedirectLanding()}>
            <Image
              source={require("../../../assets/images/arrow.png")}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </TouchableOpacity>
        ) : null}

        <View
          style={{ justifyContent: "center", alignItems: "center", top: 10 }}
        >
          {this.props.has_avatar ? (
            <View>
              <Image
                source={require("../../../assets/images/avatar.png")}
                style={{
                  width: hp("7%"),
                  height: hp("7%"),
                  borderWidth: 2,
                  borderRadius: 40,
                  borderColor: "#FFFFFF",
                }}
              />
              <Text style={styles.username}>Debanjan</Text>
            </View>
          ) : this.props.screen == "login2" ? (
            <Text style={styles.headingBold}>
              Login <Text style={styles.headingLight}>to Your</Text> Account
            </Text>
          ) : null}
        </View>

        {this.props.has_avatar ? (
          <TouchableOpacity
            style={styles.containerBackBlock}
            onPress={() => this._doRedirectLanding()}
          >
            <Image
              source={require("../../../assets/images/notification.png")}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={styles.containerBackBlock}
            onPress={() => this._doRedirectLanding()}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  curveHeaderBlock: {
    position: "absolute",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    top: 20,
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
  },

  containerBackBlock: {
    justifyContent: "center",
    bottom: 20,
  },
  username: {
    color: "#FFFFFF",
    fontSize: hp("2%"),
    fontWeight: "600",
  },
  userNameWidthoutAvatar: {
    color: "#FFFFFF",
    fontSize: hp("3%"),
    fontWeight: "600",
    marginTop: 30,
  },
  headingBold: {
    color: "#FFFFFF",
    fontSize: hp("2.5%"),
    fontWeight: "600",
  },
  headingLight: {
    color: "#FFFFFF",
    fontSize: hp("2.5%"),
    fontWeight: "200",
  },
});
