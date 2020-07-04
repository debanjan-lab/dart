import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
const width = Math.round(Dimensions.get("window").width);
const height = Math.round(Dimensions.get("window").height);
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const statusBarBackgroundColor = "#1CCBE6";
const barStyle = "light-content";

console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={barStyle}
        />

        <View
          style={{
            position: "absolute",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            top: 20,
            flexDirection: "row",
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <TouchableOpacity
            style={styles.containerBackBlock}
            onPress={() => this._doRedirectLanding()}
          >
            <Image
              source={require("../../assets/images/arrow.png")}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this._doRedirectLanding()}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/images/avatar.png")}
              style={{
                width: hp("9%"),
                height: hp("9%"),
                borderWidth: 4,
                borderRadius: 40,
                borderColor: "#FFFFFF",
              }}
            />

            <Text style={styles.username}>Debanjan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.containerBackBlock}
            onPress={() => this._doRedirectLanding()}
          >
            <Image
              source={require("../../assets/images/notification.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ marginLeft: 20, marginRight: 20 }}>
          <TouchableOpacity
            onPress={() => this._doSubmit()}
            style={styles.sendButtonBlock}
          >
            <Text style={styles.sendButtonText}>Launch new Circle</Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              marginTop: hp("2%"),
              marginBottom: hp("2%"),
              height: hp("10%"),
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: wp("20%"),
                height: hp("10%"),
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "#21c995",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#21c995",
                elevation: 10,
              }}
            >
              <Text style={[styles.featureButtonText, { color: "#FFFFFF" }]}>
                Ongoing
              </Text>
            </View>

            <View
              style={{
                width: wp("20%"),
                height: hp("10%"),
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "#e3832f",
                alignItems: "center",
                justifyContent: "center",
                elevation: 10,
                backgroundColor: "#FFFFFF",
              }}
            >
              <Text style={[styles.featureButtonText, { color: "#e3832f" }]}>
                Wating
              </Text>
              <Text style={[styles.featureButtonText, { color: "#e3832f" }]}>
                Acceptance
              </Text>
            </View>

            <View
              style={{
                width: wp("20%"),
                height: hp("10%"),
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "#7792f9",
                alignItems: "center",
                justifyContent: "center",
                elevation: 10,
                backgroundColor: "#FFFFFF",
              }}
            >
              <Text style={[styles.featureButtonText, { color: "#7792f9" }]}>
                Blocked
              </Text>
            </View>

            <View
              style={{
                width: wp("20%"),
                height: hp("10%"),
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "#de4b5b",
                alignItems: "center",
                justifyContent: "center",
                elevation: 10,
                backgroundColor: "#FFFFFF",
              }}
            >
              <Text style={[styles.featureButtonText, { color: "#de4b5b" }]}>
                Sespended
              </Text>
            </View>
          </View>

          <View style={{ height: hp("52%") }}>
            <ScrollView>
              <View
                style={{
                  height: hp("15%"),
                  marginTop: hp("2%"),
                  borderBottomWidth: 2,
                  borderBottomColor: "#22c691",
                  borderLeftWidth: 2,
                  borderLeftColor: "#e2e2e2",
                  borderTopWidth: 2,
                  borderTopColor: "#e2e2e2",
                  borderRightWidth: 2,
                  borderRightColor: "#e2e2e2",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 5,
                }}
              />
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  containerBackBlock: {
    justifyContent: "center",
    bottom: 20,
  },
  username: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 2,
    fontWeight: "600",
  },
  featureButtonText: {
    color: "#21c995",
    fontSize: 14,
    //fontFamily: 'Roboto-Reguler'
  },
  containerHeaderBlock: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("2.5%"),
  },
  containerHeaderText: {
    color: "#2B2B2B",
    fontSize: hp("2.4%"),
    fontWeight: "500",
    //marginTop:hp('2%')
  },
  containerHeaderSubText: {
    color: "#4a4a4a",
    fontSize: hp("2.2%"),
    // fontFamily: 'Roboto-Reguler',
    marginTop: hp("1.2%"),
  },

  sendButtonBlock: {
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
    height: hp("6.5%"),
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5ac6c6",
    //shadowColor: 'rgba(0,0,0, .4)', // IOS
    //shadowOffset: { height: 1, width: 1 }, // IOS
    //shadowOpacity: 1, // IOS
    //shadowRadius: 1, //IOS
    //elevation: 5, // Android
    elevation: 2,
  },
  googleButtonBlock: {
    marginTop: hp("2%"),
    height: hp("6.2%"),
    borderColor: "#12c4cc",
    borderWidth: 1,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    elevation: 2,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: hp("2.5%"),
    // fontFamily: 'Roboto-Reguler'
  },
  googleButtonText: {
    color: "#12c4cc",
    fontSize: hp("2.5%"),
    // fontFamily: 'Roboto-Reguler'
  },
  createAccountText: {
    color: "#12c4cc",
    fontSize: hp("2.5%"),
    // fontFamily: 'Roboto-Reguler'
  },

  sendButtonBlockCreateAccount: {
    marginTop: hp("2%"),
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: hp("40%"),
    backgroundColor: "#C6F3F0",
  },
});
