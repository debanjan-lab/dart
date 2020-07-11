import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
  Keyboard,
  ScrollView
} from "react-native";
import { ToastMessage } from "../../components/ToastMessage";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationEvents } from "react-navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const width = Math.round(Dimensions.get("window").width);
const statusBarBackgroundColor = "#1CCBE6";
const barStyle = "light-content";
import HeaderCurve from "../includes/headercurve";
import URL from "../../config/url";
import axios from "axios";
const ApiConfig = URL;
import CommonService from "../../services/common/commonService";
import Loading from "react-native-loader-overlay";
import global from "../../services/global/globalService";

import Language from "../../translations/index";

export default class SearchParticipantsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
      countSelected: 0,

      loaderSearchPhone: false,
      loader: false,
      mobile: "",
      errorPhone: false,
      errorMessage: "",
      successMessage: "",
      loadContact: false,
      selectedLanguage: "en",
    };
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    let that = this;
    AsyncStorage.multiGet(["rememberToken", "circle_code"]).then((response) => {
      this.setState({
        rememberToken: response[0][1],
        cicle_code: response[1][1],
        selectedLanguage: "fr",
      });
    });
  };

  async goToContactPage() {
    global.update_contact_data = false;

    if (Platform.OS === 'ios') {
      this.props.navigation.navigate("phoneContactPage");
    } else {
      this.setState({ loadContact: true });

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({ loadContact: false });
          this.props.navigation.navigate("phoneContactPage");
        } else {

          this.setState({ loadContact: false });
        }
      } catch (err) {
        console.log("permission contact", err)
        this.setState({ loadContact: false });
      }
    }



  }
  __getContact() {
    let data = global.perticipant_info;
    this.setState({ countSelected: global.perticipant_info.length });
    if (data !== null || data !== undefined || data.length) {
      if (global.update_contact_data) {
        this._getContact(data);
      }
    }
  }

  _getContact(contact) {
    this.setState({ errorMessage: "", successMessage: "" });
    let that = this;
    let obj = {
      circle_code: this.state.cicle_code,
      user_info: contact,
      flag: 2,
    };
    this.loading = Loading.show(CommonService.loaderObj);

    console.log("api==" + ApiConfig.base_url + "create-circle-user");
    console.log("token==" + that.state.rememberToken);
    console.log("sending data to api==" + JSON.stringify(obj));
    //return false;

    //alert("payload=="+JSON.stringify(obj))

    axios
      .post(ApiConfig.base_url + "create-circle-user", JSON.stringify(obj), {
        headers: {
          Authorization: "Bearer " + that.state.rememberToken,
        },
      })
      .then((response) => {
        //alert("response=="+JSON.stringify(response))

        global.phone_data = null;
        global.update_contact_data = false;
        Loading.hide(that.loading);
        if (response.data.status == 300) {
          that.setState(
            {
              success: false,
            },
            () => {
              that.setState({
                errorMessage: response.data.message
                  ? Language[this.state.selectedLanguage]["status"][
                  response.data.message
                  ]
                  : "",
                participants: [],
              });
            }
          );
        } else {
          global.perticipant_info = [];
          contact.forEach((element) => {
            global.perticipant_info.push({
              username: element.username,
              mobile: element.mobile,
            });
          });

          that.setState(
            {
              success: true,
            },
            () => {
              that.setState({
                successMessage: response.data.message
                  ? Language[this.state.selectedLanguage]["status"][
                  response.data.message
                  ]
                  : "",
                participants: [],
                countSelected: global.perticipant_info.length,
              });
            }
          );
        }
      })
      .catch((error) => {
        alert("err==" + JSON.stringify(error));

        console.log("err", error);
      })
      .finally(() => {
        Loading.hide(that.loading);
      });
  }

  _doRedirectPrev = () => {
    this.props.navigation.navigate("CreateCircleScreen");
  };

  _doSelectParticipant = (code, phone, name) => {
    this.setState({
      errorPhone: false,
      errorMessage: "",
      successMessage: "",
    });

    let that = this;
    let obj = {
      circle_code: this.state.cicle_code,
      user_info: [{ mobile: code + phone, username: name }],
      flag: 1,
    };

    this.setState({
      loader: true,
    });

    //alert("payload==="+JSON.stringify(obj) );

    axios
      .post(ApiConfig.base_url + "create-circle-user", JSON.stringify(obj), {
        headers: {
          Authorization: "Bearer " + that.state.rememberToken,
        },
      })
      .then(function (response) {
        console.log("response===============" + JSON.stringify(response));
        //return false

        //alert("response==="+JSON.stringify(response))

        if (response.data.status == 300) {
          that.setState(
            {
              success: false,
            },
            () => {
              that.setState({
                errorMessage: response.data.message
                  ? Language[that.state.selectedLanguage]["status"][
                  response.data.message
                  ]
                  : "",
                participants: [],
                //countSelected: this.state.countSelected + 1
              });
            }
          );
        } else {
          global.perticipant_info.push({
            username: name,
            mobile: code + phone,
            code: code,
          });
          global.contacts_data.push({
            username: name,
            mobile: code + phone,
          });
          that.setState(
            {
              success: true,
            },
            () => {
              that.setState({
                successMessage: response.data.message
                  ? Language[that.state.selectedLanguage]["status"][
                  response.data.message
                  ]
                  : "",
                participants: [],
                countSelected: global.perticipant_info.length,
              });
            }
          );
        }
      })
      .catch(function (error) { })
      .finally(function () {
        that.setState({
          loader: false,
        });
      });
  };

  getUnique(arr, comp) {
    const unique = arr
      .map((e) => e[comp])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter((e) => arr[e])
      .map((e) => arr[e]);

    return unique;
  }

  _doSearch = () => {
    Keyboard.dismiss();
    this.setState({
      errorPhone: false,
      errorMessage: "",
      successMessage: "",
      participants: [],
    });

    if (this.state.mobile == "") {
      this.setState({
        errorPhone: true,
        errorMessage:
          Language[this.state.selectedLanguage]["common"]["empty_field"],
      });
    }

    setTimeout(
      function () {
        if (!this.state.errorMessage) {
          let that = this;
          let obj = {
            circle_code: this.state.cicle_code,
            mobile: this.state.mobile,
          };

          this.setState({
            loaderSearchPhone: true,
          });

          axios
            .post(ApiConfig.base_url + "searchByMobile", JSON.stringify(obj), {
              headers: {
                Authorization: "Bearer " + that.state.rememberToken,
              },
            })
            .then((response) => {
              if (response.data.status == 300) {
                that.setState(
                  {
                    success: false,
                  },
                  () => {
                    that.setState({
                      errorMessage: response.data.message
                        ? Language[this.state.selectedLanguage]["status"][
                        response.data.message
                        ]
                        : "",
                    });
                  }
                );
              } else {
                that.setState(
                  {
                    success: true,
                  },
                  () => {
                    that.setState({
                      errorMessage: "",
                      participants: [response.data.result],
                    });
                  }
                );
              }
            })
            .catch(function (error) { })
            .finally(function () {
              that.setState({
                loaderSearchPhone: false,
              });
            });
        }
      }.bind(this),
      500
    );
  };

  makeid(length) {
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  render() {
    const errorPhone = this.state.errorPhone
      ? styles.searchInputRequired
      : styles.searchInput;
    return (
      <ScrollView contentContainerStyle={{ backgroundColor: '#fff', flexGrow: 1 }}>
        <NavigationEvents onDidFocus={() => this.__getContact()} />
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={barStyle}
        />

        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps={"handled"}
        >
          <View
            style={{
              flex: 1,
              position: "relative",
            }}
          >
            <HeaderCurve
              title={
                Language[this.state.selectedLanguage]["search_screen"][
                "search_participants"
                ]
              }
              navigation={this.props.navigation}
              backButton={true}
            />
            <View
              style={{
                flex: 1,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flex: 1,
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <View style={styles.countBlock}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#FFFFFF",
                    }}
                  >
                    {
                      Language[this.state.selectedLanguage]["search_screen"][
                      "total_contact"
                      ]
                    }{" "}
                    : {this.state.countSelected.toString()}
                  </Text>
                </View>

                <View style={styles.searchBlock}>
                  <TextInput
                    style={errorPhone}
                    onChangeText={(mobile) => this.setState({ mobile })}
                    placeholder={
                      Language[this.state.selectedLanguage]["register_screen1"][
                      "phone"
                      ]
                    }
                    keyboardType={"number-pad"}
                    autoCapitalize="none"
                    returnKeyType="go"
                    onSubmitEditing={() => this._doSearch()}
                  />

                  {this.state.loaderSearchPhone ? (
                    <View
                      style={{
                        position: "absolute",
                        left: width - 100,
                      }}
                    >
                      <ActivityIndicator size="small" color={"#5ac6c6"} />
                    </View>
                  ) : (
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          left: width - 100,
                        }}
                        onPress={() => this._doSearch()}
                      >
                        <Image
                          source={require("../../../assets/images/search.png")}
                          style={{
                            width: 25,
                            height: 25,
                          }}
                        />
                      </TouchableOpacity>
                    )}

                  {this.state.loadContact ? (
                    <View
                      style={{
                        position: "absolute",
                        left: width - 57,
                      }}
                    >
                      <ActivityIndicator size="small" color={"#5ac6c6"} />
                    </View>
                  ) : (
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          left: width - 60,
                        }}
                        onPress={() => this.goToContactPage()}
                      >
                        <Image
                          source={require("../../../assets/images/phonebook.png")}
                          style={{
                            width: 25,
                            height: 25,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                </View>

                {this.state.errorMessage ? (
                  <View
                    style={{
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "red",
                        fontSize: 16,
                        textAlign: "center",
                        padding: 10,
                      }}
                    >
                      {this.state.errorMessage}
                    </Text>
                  </View>
                ) : null}

                {this.state.successMessage ? (
                  <View
                    style={{
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "green",
                        fontSize: 16,
                        textAlign: "center",
                        padding: 10,
                      }}
                    >
                      {this.state.successMessage}
                    </Text>
                  </View>
                ) : null}

                <View style={{ height: 200 }}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.key.toString()}
                    ListHeaderComponent={<View style={{ height: 10 }} />}
                    ListFooterComponent={<View style={{ height: 10 }} />}
                    data={this.state.participants}
                    extraData={this.state}
                    renderItem={({ item }) => (
                      <View style={styles.listWrapper}>
                        <View style={styles.avatarWrapper}>
                          <Image
                            style={{
                              width: 40,
                              height: 40,
                            }}
                            source={{
                              uri: ApiConfig.storage_url + item.avatar_location,
                            }}
                          />
                        </View>

                        <View
                          style={{
                            width: width - 230,
                            height: 80,
                            padding: 5,
                            justifyContent: "space-around",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              color: "#000000",
                            }}
                          >
                            {item.first_name} {item.last_name}
                          </Text>

                          <Text
                            style={{
                              fontSize: 14,
                              color: "#000000",
                            }}
                          >
                            {item.mobile_country_code} {item.mobile_number}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.operationWrapperActive}
                          onPress={() =>
                            this._doSelectParticipant(
                              item.mobile_country_code,
                              item.mobile_number,
                              item.first_name
                            )
                          }
                        >
                          <Text
                            style={{
                              fontWeight: "700",
                              color: "#FFFFFF",
                              fontSize: 14,
                            }}
                          >
                            {
                              Language[this.state.selectedLanguage]["common"][
                              "select"
                              ]
                            }
                          </Text>

                          {this.state.loader ? (
                            <View style={{ marginLeft: 10 }}>
                              <ActivityIndicator
                                size="small"
                                color={"#FFFFFF"}
                              />
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    )}
                    numColumns={1}
                  />
                </View>
              </View>
            </View>
            {this.state.countSelected ? (
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: "#5ac6c6",
                  borderRadius: 30,
                  height: 50,
                  width: 50,
                  position: "absolute",
                  bottom: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  right: 10,
                  zIndex: 1,
                }}
                onPress={() => this.props.navigation.goBack()}
              >
                <Text style={{ color: "#ffffff", fontSize: 14 }}>
                  {Language[this.state.selectedLanguage]["common"]["ok"]}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={{ marginTop: 20 }} />
        </KeyboardAwareScrollView>
      </ScrollView>
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
  headingBold: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  searchInput: {
    flex: 1,
    height: 40,
    borderBottomColor: "#1DC2E0",
    borderBottomWidth: 1,
    color: "#000000",
    fontSize: 16,
    paddingVertical: 0,
    //width: width - 100
    marginRight: width / 5,
  },
  searchInputRequired: {
    flex: 1,
    height: 40,
    borderBottomColor: "red",
    borderBottomWidth: 1,
    color: "#000000",
    fontSize: 16,
    paddingVertical: 0,
    marginRight: width / 5,
  },

  listWrapper: {
    height: 80,
    flexDirection: "row",
    padding: 10,
    borderRadius: 5,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
  },
  avatarWrapper: {
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#dcdcdc",
    borderWidth: 1,
  },
  operationWrapperActive: {
    height: 40,
    width: 100,
    backgroundColor: "#5ac6c6",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  countBlock: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: 40,
    backgroundColor: "#5ac6c6",
    borderRadius: 10,
  },
  searchBlock: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: 40,
    flexDirection: "row",
  },
});
