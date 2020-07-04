import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Keyboard,
  Alert,
  BackHandler,
} from "react-native";
import { ToastMessage } from "../../components/ToastMessage";
const width = Math.round(Dimensions.get("window").width);

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from "react-native-modal-datetime-picker";
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "rn-fetch-blob";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-community/async-storage";
const height = Math.round(Dimensions.get("window").height);

const statusBarBackgroundColor = "#1CCBE6";
const barStyle = "light-content";
import URL from "../../config/url";
import HeaderCurve from "../includes/headercurve";
import httpService from "../../services/http/httpService";

import Language from "../../translations/index";

export default class EditProfileScreen extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this._didFocusSubscription = props.navigation.addListener(
      "didFocus",
      (payload) =>
        BackHandler.addEventListener("hardwareBackPress", this.onGoBack)
    );
    this.state = {
      avatar: URL.public_url + "storage/avatars/default_avatar.png",
      idScan: null,
      loaderAvatar: false,
      loaderID: false,
      rememberToken: "",
      success: null,
      avatarFile: null,
      idScanFile: null,
      loader: false,
      email: null,
      phone: null,

      first_name: "",
      errorFirstName: false,
      last_name: "ddd",
      errorLastName: false,
      dob: "",
      selectedDate: new Date(),
      errorDob: false,
      errorMessage: "",
      password: "",
      confirmPassword: "",
      errorPassword: false,
      iban: "",
      ibanErr: false,
      mobile_country_code: "",
      eyeIcon: require("../../../assets/images/eye_cross.png"),
      isSecured: true,
      selectedLanguage: "en",
    };
  }

  componentWillMount() {
    ImagePicker.clean()
      .then(() => {
        console.log("removed all tmp images from tmp directory");
      })
      .catch((e) => {
        alert(e);
      });
  }

  componentDidMount() {
    this._bootstrapAsync();
    this._willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      (payload) =>
        BackHandler.removeEventListener("hardwareBackPress", this.onGoBack)
    );
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  onGoBack = () => {
    Alert.alert("Confirmation", "You will lose unsave data", [
      { text: "No", onPress: () => (No = "no") },
      { text: "OK", onPress: () => this.props.navigation.goBack() },
    ]);
    return true;
  };

  _bootstrapAsync = async () => {
    AsyncStorage.multiGet([
      "rememberToken",
      "email",
      "mobile_number",
      "dob",
      "first_name",
      "last_name",
      "iban",
      "avatar_location",
      "mobile_country_code",
    ]).then((response) => {
      this.setState({
        rememberToken: response[0][1],
        email: response[1][1],
        phone: response[2][1],
        dob: response[3][1],
        first_name: response[4][1],
        last_name: response[5][1],
        iban: response[6][1],
        avatar: URL.public_url + "storage/" + response[7][1],
        mobile_country_code: response[8][1],
        selectedLanguage: "fr",
      });
    });
  };

  showDateTimePicker = () => {
    this.setState({
      isDateTimePickerVisible: true,
    });
  };

  hideDateTimePicker = () => {
    this.setState({
      isDateTimePickerVisible: false,
    });
  };

  handleDatePicked = (date) => {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    this.setState({
      selectedDate: new Date(year, month - 1, day),
    });
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    var date = day + "/" + month + "/" + year;
    this.setState({
      dob: date,
      isDateTimePickerVisible: false,
    });
  };

  makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  _openImagePicker = () => {
    let thatRef = this.refs;
    let that = this;
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      mediaType: "photo",
      includeBase64: true,
    }).then((image) => {
      var type = image.mime.split("/")[1];
      this.setState({
        loaderAvatar: true,
      });
      RNFetchBlob.fetch(
        "POST",
        URL.base_url + "upload-file",
        {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + that.state.rememberToken,
        },
        [
          {
            name: "file_name",
            filename: this.makeid(15) + "." + type,
            type: image.mime,
            data: image.data,
          },
          { name: "flag", data: "1" },
        ]
      )
        .then((resp) => {
          let json = resp.json();
          if (json.status == 300) {
            that.setState(
              {
                success: false,
                loaderAvatar: false,
                avatar: URL.public_url + "avatar/default_avatar.png",
              },
              () => {
                //thatRef.toast.show(json.message, DURATION.LENGTH_LONG);

                ToastMessage(json.message);
              }
            );
          } else {
            this.setState({
              avatar: URL.public_url + "storage/" + json.message,
              loaderAvatar: false,
              avatarFile: json.message,
            });
          }
        })
        .catch((err) => {
          ToastMessage(err.message);
        });
    });
  };

  _openIDScanPicker = () => {
    let thatRef = this.refs;
    let that = this;

    ImagePicker.openPicker({
      mediaType: "photo",
      includeBase64: true,
    }).then((image) => {
      var type = image.mime.split("/")[1];
      this.setState({
        loaderID: true,
      });
      RNFetchBlob.fetch(
        "POST",
        URL.base_url + "upload-file",
        {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + that.state.rememberToken,
        },
        [
          {
            name: "file_name",
            filename: this.makeid(15) + "." + type,
            type: image.mime,
            data: image.data,
          },
          { name: "flag", data: "2" },
        ]
      )
        .then((resp) => {
          let json = resp.json();
          if (json.status == 300) {
            that.setState(
              {
                loaderID: false,
                success: false,
              },
              () => {
                //thatRef.toast.show(json.message, DURATION.LENGTH_LONG);
                ToastMessage(json.message);
              }
            );
          } else {
            this.setState({
              loaderID: false,
              idScanFile: json.message,
            });
          }
        })
        .catch((err) => {
          ToastMessage(err.message);
        });
    });
  };

  _doRegister = () => {
    Keyboard.dismiss();
    this.setState({
      errorFirstName: false,
      errorLastName: false,
      errorDob: false,
      errorPassword: false,
      errorMessage: "",
    });

    if (
      this.state.first_name == "" ||
      this.state.last_name == "" ||
      this.state.iban === "" ||
      this.state.dob == ""
    ) {
      if (this.state.first_name == "") {
        this.setState({
          errorFirstName: true,
          errorMessage: "Above fields are required",
        });
      }

      if (this.state.last_name == "") {
        this.setState({
          errorLastName: true,
          errorMessage: "Above fields are required",
        });
      }
      if (this.state.iban === "") {
        this.setState({
          // ibanErr: true,
          // errorMessage: "Above fields are required"
        });
      }

      if (this.state.dob == "") {
        this.setState({
          errorDob: true,
          errorMessage: "Above fields are required",
        });
      }
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        errorPassword: true,
        errorMessage: "Password and confirm-passwrod not match",
      });
    }

    setTimeout(
      function() {
        if (!this.state.errorMessage) {
          let thatRef = this.refs;
          let that = this;
          let thatNavigation = this.props.navigation;

          let obj = {
            url: "update-profile",
            data: {
              first_name: this.state.first_name,
              last_name: this.state.last_name,
              dob: this.state.dob,
              iban: this.state.iban,
              credit_card_no: this.state.credit_card_no,
              paypal_account: this.state.paypal_account,
              id_scan: this.state.idScanFile,
              avatar_location: this.state.avatarFile,
              password: this.state.password,
            },
            authtoken: this.state.rememberToken,
          };
          this.setState({
            loader: true,
          });

          httpService
            .postHttpCall(obj)
            .then((response) => {
              if (response.status == 300) {
                that.setState(
                  {
                    success: false,
                    loader: false,
                  },
                  () => {
                    that.setState({
                      errorMessage: response.message,
                    });
                  }
                );
              } else {
                AsyncStorage.clear();
                AsyncStorage.multiSet(
                  [
                    ["user_id", response.result.id.toString()],
                    ["rememberToken", that.state.rememberToken],
                    ["loggedIn", "success"],
                    ["first_name", response.result.first_name],
                    ["last_name", response.result.last_name],
                    ["email", response.result.email],
                    ["iban", response.result.iban],
                    ["dob", response.result.dob],
                    [
                      "mobile_country_code",
                      response.result.mobile_country_code,
                    ],
                    ["mobile_number", response.result.mobile_number.toString()],
                    ["avatar_location", response.result.avatar_location],
                  ],
                  function(error) {
                    that.setState({ loader: false });
                    setTimeout(() => {
                      thatNavigation.navigate("homeStack");
                    }, 1000);
                  }
                );
              }
            })
            .catch((err) => {
              that.setState({ errorMessage: err.message, loader: false });
            });
        }
      }.bind(this),
      500
    );
  };

  _doChangeView = () => {
    this.setState({
      isSecured: !this.state.isSecured,
    });
  };

  render() {
    const errorFirstName = this.state.errorFirstName
      ? styles.inputTextStyleRequired
      : styles.inputTextStyleActive;
    const errIban = this.state.ibanErr
      ? styles.inputTextStyleRequired
      : styles.inputTextStyleActive;

    const errorLastName = this.state.errorLastName
      ? styles.inputTextStyleRequired
      : styles.inputTextStyleActive;

    const errorDob = this.state.errorDob
      ? styles.inputTextStyleRequired
      : styles.inputTextStyleActive;
    const errorPassword = this.state.errorPassword
      ? styles.inputTextStyleRequired
      : styles.inputTextStyleActive;

    const eyeIcon = this.state.isSecured
      ? require("../../../assets/images/eye_cross.png")
      : require("../../../assets/images/eye.png");

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={barStyle}
        />

        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flex: 1,
              position: "relative",
            }}
          >
            <HeaderCurve
              title={
                Language[this.state.selectedLanguage]["profile_screen"][
                  "update_profile"
                ]
              }
              navigation={this.props.navigation}
              backButton={true}
              bellIcon={true}
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
                <View style={styles.avatarWrapper}>
                  <TouchableOpacity
                    style={styles.avatarImageWrapper}
                    onPress={() => this._openImagePicker()}
                  >
                    <Image
                      source={{
                        uri: this.state.avatar,
                      }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                      }}
                    />

                    {this.state.loaderAvatar ? (
                      <View style={styles.loadingCenter}>
                        <ActivityIndicator size="large" color={"#2ba685"} />
                      </View>
                    ) : null}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      top: hp("10%"),
                      left: wp("50%"),
                      position: "absolute",
                    }}
                    onPress={() => this._openImagePicker()}
                  >
                    <Image
                      style={{
                        width: 35,
                        height: 35,
                      }}
                      source={require("../../../assets/images/edit.png")}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.frmInputWrapper,
                    { flexDirection: "row", justifyContent: null },
                  ]}
                >
                  <Text style={[styles.frmLabel, { width: width / 2.5 }]}>
                    {
                      Language[this.state.selectedLanguage]["login_screen"][
                        "email"
                      ]
                    }
                  </Text>
                  <Text style={[styles.frmLabel, { color: "#000000" }]}>
                    {this.state.email}
                  </Text>
                </View>

                <View
                  style={[
                    styles.frmInputWrapper,
                    { flexDirection: "row", justifyContent: null },
                  ]}
                >
                  <Text style={[styles.frmLabel, { width: width / 2.5 }]}>
                    {
                      Language[this.state.selectedLanguage]["register_screen1"][
                        "phone"
                      ]
                    }
                  </Text>
                  <Text style={[styles.frmLabel, { color: "#000000" }]}>
                    {this.state.mobile_country_code}
                    {this.state.phone}
                  </Text>
                </View>

                <View style={styles.frmInputWrapper}>
                  <Text style={styles.frmLabel}>
                    {
                      Language[this.state.selectedLanguage]["register_screen2"][
                        "first_name"
                      ]
                    }
                  </Text>
                  <TextInput
                    style={errorFirstName}
                    value={this.state.first_name}
                    onChangeText={(first_name) => this.setState({ first_name })}
                  />
                </View>

                <View style={styles.frmInputWrapper}>
                  <Text style={styles.frmLabel}>
                    {
                      Language[this.state.selectedLanguage]["register_screen2"][
                        "last_name"
                      ]
                    }
                  </Text>
                  <TextInput
                    style={errorLastName}
                    value={this.state.last_name}
                    onChangeText={(last_name) => this.setState({ last_name })}
                  />
                </View>

                <View style={styles.frmInputWrapper}>
                  <Text style={styles.frmLabel}>
                    {
                      Language[this.state.selectedLanguage]["profile_screen"][
                        "iban"
                      ]
                    }
                  </Text>
                  <TextInput
                    style={errIban}
                    value={this.state.iban}
                    onChangeText={(iban) => this.setState({ iban })}
                  />
                </View>

                <View style={styles.frmInputWrapper}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.frmLabel}>
                      {
                        Language[this.state.selectedLanguage][
                          "register_screen2"
                        ]["date_of_birth"]
                      }
                    </Text>

                    <TouchableOpacity onPress={() => this.showDateTimePicker()}>
                      <Image
                        source={require("../../../assets/images/calendar.png")}
                        style={{
                          width: 25,
                          height: 25,
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={errorDob}
                    editable={false}
                    value={this.state.dob}
                  />

                  <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    datePickerModeAndroid={"spinner"}
                    date={this.state.selectedDate}
                  />
                </View>
                <View
                  style={[styles.frmInputWrapper, { position: "relative" }]}
                >
                  <Text style={styles.frmLabel}>
                    {
                      Language[this.state.selectedLanguage]["login_screen"][
                        "password"
                      ]
                    }
                  </Text>
                  <TextInput
                    style={[errorPassword, { paddingRight: 40 }]}
                    value={this.state.password}
                    secureTextEntry={this.state.isSecured}
                    onChangeText={(password) => this.setState({ password })}
                  />
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      left: width - 70,
                    }}
                    onPress={() => this._doChangeView()}
                  >
                    <Image
                      source={eyeIcon}
                      style={{
                        width: 25,
                        height: 25,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.frmInputWrapper}>
                  <Text style={styles.frmLabel}>
                    {
                      Language[this.state.selectedLanguage]["profile_screen"][
                        "confirm_password"
                      ]
                    }
                  </Text>
                  <TextInput
                    style={errorPassword}
                    value={this.state.confirmPassword}
                    secureTextEntry={true}
                    onChangeText={(confirmPassword) =>
                      this.setState({ confirmPassword })
                    }
                  />
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      fontSize: 16,
                    }}
                  >
                    {this.state.errorMessage}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => this._doRegister()}
                  style={styles.sendButtonBlock}
                  disabled={this.state.loader}
                >
                  <Text style={styles.sendButtonText}>
                    {
                      Language[this.state.selectedLanguage]["profile_screen"][
                        "update_now"
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
            </View>
          </View>
        </KeyboardAwareScrollView>
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
    width: 60,
  },

  containerHeaderText: {
    color: "#FFFFFF",
    fontSize: 20,
    right: 10,
  },

  containerImageBlock: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: height / 4,
    backgroundColor: "#C6F3F0",
  },

  forgotPasswordBlock: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  forgotPasswordText: {
    color: "#22e2ef",
    fontSize: 16,
  },

  inputTextStyleActive: {
    flex: 1,
    height: 25,
    borderBottomColor: "#1DC2E0",
    borderBottomWidth: 1,
    color: "#000000",
    fontSize: 18,
    paddingVertical: 0,
  },

  sendButtonBlock: {
    marginTop: 20,
    height: 50,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5AC6C6",
    elevation: 2,
    flexDirection: "row",
  },

  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: hp("40%"),
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
    fontSize: 18,
    fontWeight: "600",
  },
  headingLight: {
    color: "#FFFFFF",
    fontSize: hp("2.5%"),
    fontWeight: "200",
  },
  avatarWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  avatarImageWrapper: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderRadius: 55,
  },
  frmInputWrapper: {
    marginTop: 20,
    //flexDirection: 'row',
    //alignItems: 'center',
    justifyContent: "space-between",
  },
  frmLabel: {
    fontSize: 16,
    //paddingRight: 10,
    //paddingLeft: 10,
    color: "#909090",
  },
  inputTextStyleInactive: {
    flex: 1,
    //height: 30,
    borderBottomColor: "#cecece",
    borderBottomWidth: 1,
    color: "#000000",
    fontSize: hp("2.5%"),
    paddingVertical: 0,
    // paddingLeft: 10,
    //paddingRight: 10,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  idScan: {
    marginTop: 10,
    height: 40,
    width: wp("40%"),
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5ac6c6",
    elevation: 2,
    flexDirection: "row",
  },
  loading: {
    marginLeft: 10,
  },
  loadingCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  inputTextStyleRequired: {
    flex: 1,
    height: 25,
    borderBottomColor: "red", // required
    borderBottomWidth: 1,
    color: "#000000",
    fontSize: 18,
    paddingVertical: 0,
  },
});
