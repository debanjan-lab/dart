import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import SortableList from "react-native-sortable-list";

const statusBarBackgroundColor = "#1CCBE6";
const barStyle = "light-content";
import HeaderCurve from "../includes/headercurve";

import axios from "axios";

import URL from "../../config/url";
const ApiConfig = URL;
import Language from "../../translations/index";

export default class ChangeOrderParticipantsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participantList: [],
      loadingContent: true,
      newOrder: [],
      cicle_code: "",
      first_name: "",
      avatar_location: "",
      rememberToken: "",
      selectedLanguage: "en",
    };
  }

  componentDidMount() {
    this._bootstrapAsync();

    let participants = this.props.navigation.getParam("participants", {});
    this.setState({
      participantList: participants,
    });

    setTimeout(
      function () {
        this.setState({
          loadingContent: false,
        });
      }.bind(this),
      1000
    );
  }

  _bootstrapAsync = async () => {
    console.log("get user info");
    AsyncStorage.multiGet([
      "rememberToken",
      "circle_code",
      "first_name",
      "avatar_location",
    ]).then((response) => {
      console.log("re", response);
      this.setState({
        rememberToken: response[0][1],
        cicle_code: response[1][1],
        first_name: response[2][1],
        avatar_location: {
          uri: ApiConfig.public_url + "storage/" + response[3][1],
        },
        selectedLanguage: "fr",
      });
    });
  };

  _renderRow = ({ data, active }) => {
    return <Row data={data} active={active} />;
  };

  onRelease = (key, currentOrder) => {
    this.setState({
      newOrder: currentOrder,
    });
  };

  _doContinue = () => {
    let reorderList = "";
    let reorder = this.state.newOrder;
    let participantList = "";
    let newArray = [...this.state.participantList];

    if (reorder.length) {
      reorder.forEach((element) => {
        reorderList += element + ",";
        participantList += newArray[Number(element)].id + ",";
      });
    }

    reorderList = reorderList.replace(/,\s*$/, "");
    participantList = participantList.replace(/,\s*$/, "");
    setTimeout(
      function () {
        let obj = {
          circle_code: this.state.cicle_code,
          reorder: reorderList,
          plist: participantList,
        };

        this.setState({
          loader: true,
        });
        let that = this;

        axios
          .post(
            `${ApiConfig.base_url}reorder-circle-user`,
            JSON.stringify(obj),
            {
              headers: {
                Authorization: "Bearer " + that.state.rememberToken,
              },
            }
          )
          .then(function (response) {
            // alert('ok')
            that.props.navigation.navigate("circlePreviewPage", {
              participants: response.data.result,
            });
          })
          .catch(function (error) {
            // console.log("error", error.response)
            // alert('error')
          })
          .finally(function () {
            // alert('final')
            that.setState({
              loader: false,
            });
          });
      }.bind(this),
      500
    );
  };

  render() {
    //console.log("fnaem");
    //console.log("avatar_location", this.state.avatar_location);
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={barStyle}
        />
        <HeaderCurve
          backButton={true}
          navigation={this.props.navigation}
          avatar_location={this.state.avatar_location}
          first_name={this.state.first_name}
          bellIcon={false}
        />

        <ScrollView contentContainerStyle={{ backgroundColor: '#fff', flexGrow: 1 }}>


          <View
            style={{
              flex: 1,
              padding: 20
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text style={styles.headingText}>
                {
                  Language[this.state.selectedLanguage][
                  "circle_preview_screen"
                  ]["change_order"]
                }
              </Text>
            </View>

            {!this.state.loadingContent ? (
              <View style={{ flex: 1, marginTop: 20 }}>
                <SortableList
                  style={styles.list}
                  contentContainerStyle={styles.contentContainer}
                  data={this.state.participantList}
                  renderRow={this._renderRow}
                  //onChangeOrder={this.onRelease}
                  onReleaseRow={this.onRelease}
                />

                <TouchableOpacity
                  onPress={() => this._doContinue()}
                  style={styles.confirmButtonBlock}
                  disabled={this.state.loader}
                >
                  <Text style={styles.confirmButtonText}>
                    {
                      Language[this.state.selectedLanguage]["common"][
                      "confirm"
                      ]
                    }
                  </Text>

                  {this.state.loader ? (
                    <View style={styles.loading}>
                      <ActivityIndicator size="small" color={"#FFFFFF"} />
                    </View>
                  ) : null}
                </TouchableOpacity>
              </View>
            ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator />
                </View>
              )}
          </View>


        </ScrollView>


      </View>
    );
  }
}

class Row extends Component {
  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      ...Platform.select({
        ios: {
          transform: [
            {
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              }),
            },
          ],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 2],
          }),
        },

        android: {
          transform: [
            {
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              }),
            },
          ],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 2],
          }),
        },
      }),
    };

    this.state = {
      selectedLanguage: "en",
    };
  }

  componentDidMount() {
    this.setState({
      selectedLanguage: "fr",
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 1000,
        easing: Easing.bounce,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  render() {
    const { data, active } = this.props;
    console.log("================" + JSON.stringify(this.props));

    return (
      <Animated.View style={[styles.listWrapper, this._style]}>
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                color: "#000000",
                fontSize: 14,
              }}
            >
              {Language[this.state.selectedLanguage]["common"]["name"]} :
            </Text>
            <Text
              style={{
                color: "#000000",
                fontSize: 14,
              }}
            >
              {data.username}
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                color: "#000000",
                fontSize: 14,
              }}
            >
              {
                Language[this.state.selectedLanguage]["register_screen1"][
                "phone"
                ]
              }{" "}
              :
            </Text>

            <Text
              style={{
                color: "#000000",
                fontSize: 14,
              }}
            >
              {data.mobile_country_code}
              {data.mobile_number}
            </Text>
          </View>
        </View>
      </Animated.View>
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
    alignItems: "center",
    width: 30,
  },

  headerMenu: {
    flexDirection: "row",
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    top: hp("3%"),
  },

  avatarImageWrapper: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    top: 20,
  },

  headingText: {
    fontSize: 16,
    color: "#000000",
  },

  avatarName: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
    top: 20,
  },
  notificationBadge: {
    bottom: 30,
    left: 15,
    height: 20,
    width: 20,
    backgroundColor: "red",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  listWrapper: {
    height: 50,
    flexDirection: "row",
    padding: 10,
    borderRadius: 5,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#5ac6c6",
    marginLeft: 20,
    marginRight: 20,
  },
  confirmButtonBlock: {
    //marginTop: 50,
    height: 50,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5AC6C6",
    elevation: 2,
    flexDirection: "row",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  contentContainer: {
    flex: 1,
  },
  loading: {
    marginLeft: 10,
  },
});
