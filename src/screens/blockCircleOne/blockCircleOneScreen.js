import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import blockCircleOneStyle from "./blockCircleOneStyle";
import call from "react-native-phone-call";
import axios from "axios";
import URL from "../../config/url";
import AsyncStorage from "@react-native-community/async-storage";
import HeaderCurve from "../includes/headercurve";
import CommonService from "../../services/common/commonService";
import httpService from "../../services/http/httpService";
import Loading from "react-native-loader-overlay";
import { ErrorTemplate } from "../../components/error/errorComponent";
import onGoingCircleStyle from "../onGoingCircle/onGoingCircleStyle";
import { ToastMessage } from "../../components/ToastMessage";
var moment = require("moment");
import Language from "../../translations/index";

const ApiConfig = URL;

export default class BlockCercleOneScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      rememberToken: "",
      cicle_code: "",
      first_name: "",
      avatar_location: "",
      user_id: "",
      errorText: "",
      subMessage: "",
      details: Object.create(null),
      apiExecute: false,
      mobile_number: "",
      request_status: "",
      paybuttonVisible: false,
      btnLoader: false,
      reminderLoader: false,
      admin_mobile_code: "",
      selectedLanguage: "en",
    };
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    let selectedDetails = this.props.navigation.getParam("result");
    AsyncStorage.multiGet([
      "rememberToken",
      "circle_code",
      "first_name",
      "avatar_location",
      "user_id",
      "mobile_number",
    ]).then((response) => {
      console.log("block response", response);
      this.setState(
        {
          rememberToken: response[0][1],
          cicle_code: response[1][1],
          first_name: response[2][1],
          avatar_location: {
            uri: URL.public_url + "storage/" + response[3][1],
          },
          user_id: response[4][1],
          mobile_number: response[5][1],
          details: selectedDetails,
          selectedLanguage: "fr",
        },
        () => {
          this.getCircleDetailsByCirlceCode(
            selectedDetails.circle_code,
            response[0][1]
          );
        }
      );
    });
  };

  onError(error) {
    this.setState({
      avatar_location: require("../../../assets/images/contact.png"),
    });
  }

  getCircleDetailsByCirlceCode(circleCode, token) {
    this.loading = Loading.show(CommonService.loaderObj);
    let payload = {
      url: "ongoing-circle-details",
      data: {
        circle_code: circleCode,
      },
      authtoken: token,
    };

    httpService
      .postHttpCall(payload)
      .then((res) => {
        console.log("block details", res);
        this.setState({ admin_mobile_code: res.result.admin_mobile_code });
        Loading.hide(this.loading);
        if (res.status !== undefined) {
          if (res.status == 100) {
            let details = res.result;
            if (details.status == 2) {
              if (details.previous_round_payment_date !== undefined) {
                let currentDate = moment(new Date()).format("YYYY-MM-DD");
                let oldDate = CommonService.allInOneFormatDate(
                  details.previous_round_payment_date,
                  "/",
                  "-",
                  "reverse"
                );
                if (currentDate > oldDate) {
                  this.setState({ paybuttonVisible: true });
                } else {
                  this.setState({ paybuttonVisible: false });
                }
                if (details.previous_round_payment_date === "") {
                  this.setState({ paybuttonVisible: true });
                }
              }
              this.setState({ details: details });
            } else {
              this.setState({
                errorText: httpService.appMessege.circle_not_found,
                subMessage: httpService.appMessege.circle_sub_msg,
              });
            }
          } else {
            this.setState({
              errorText: res.message
                ? Language[this.state.selectedLanguage]["status"][res.message]
                : "",
            });
          }
        } else {
          this.setState({
            errorText: httpService.appMessege.unknown_error,
            subMessage: httpService.appMessege.working_progress,
          });
        }
        this.setState({ apiExecute: true });
      })
      .catch((err) => {
        Loading.hide(this.loading);
        this.setState({
          errorText: err.message
            ? Language[this.state.selectedLanguage]["status"][err.message]
            : "",
          apiExecute: true,
        });
        if (err.status == 4) {
          this.setState({ subMessage: httpService.appMessege.internet_sub });
        }
      });
  }

  getNumberOfDays(curDate, oldDate) {
    let oneDay = 24 * 60 * 60 * 1000;
    let cur_Date = new Date(curDate);
    let old_Date = new Date(oldDate);
    return (
      " " +
      Math.round(Math.abs((cur_Date.getTime() - old_Date.getTime()) / oneDay))
    );
  }

  makeCall(number) {
    console.log("call number", number);
    const args = {
      number: number,
      prompt: false,
    };
    call(args).catch(console.error);
  }

  //Terminate circle by admin
  onTerminateCircle = () => {
    Alert.alert(
      `${
        Language[this.state.selectedLanguage]["block_circle_screen"][
          "terminate_confirmation"
        ]
      }`,
      `${
        Language[this.state.selectedLanguage]["block_circle_screen"][
          "terminate_hint"
        ]
      } 
		${this.state.details.circle_code} ${
        Language[this.state.selectedLanguage]["dashboard_screen"]["circle"]
      } ?`,
      [
        {
          text: `${Language[this.state.selectedLanguage]["common"]["no"]}`,
          onPress: () => {},
        },
        {
          text: `${Language[this.state.selectedLanguage]["common"]["yes"]}`,
          onPress: () => this.terminateCircel(),
        },
      ]
    );
  };

  terminateCircel = () => {
    if (this.state.details.circle_code) {
      let obj = {
        circle_code: this.state.details.circle_code,
      };
      axios
        .post(ApiConfig.base_url + "circle-terminate", JSON.stringify(obj), {
          headers: {
            Authorization: "Bearer " + this.state.rememberToken,
          },
        })
        .then((res) => {
          ToastMessage(
            Language[this.state.selectedLanguage]["status"][res.data.message]
          );
          this.props.navigation.navigate("dashboardPage");
        })
        .catch((err) => {
          ToastMessage(
            Language[this.state.selectedLanguage]["status"][err.message]
          );
        });
    } else {
      //Alert.alert("", "Circle not match")
    }
  };

  onRequstToTerminate = () => {
    Alert.alert(
      `${
        Language[this.state.selectedLanguage]["block_circle_screen"][
          "terminate_confirmation"
        ]
      }`,
      `${
        Language[this.state.selectedLanguage]["block_circle_screen"][
          "terminate_hint"
        ]
      } ${this.state.details.circle_code} ${
        Language[this.state.selectedLanguage]["dashboard_screen"]["circle"]
      } ?`,
      [
        {
          text: `${Language[this.state.selectedLanguage]["common"]["no"]}`,
          onPress: () => (No = "no"),
        },
        {
          text: `${Language[this.state.selectedLanguage]["common"]["yes"]}`,
          onPress: () => this.requstToTerminate(),
        },
      ]
    );
  };

  requstToTerminate = () => {
    if (this.state.details.circle_code && this.state.mobile_number) {
      let obj = {
        circle_code: this.state.details.circle_code,
        mobile_number: this.state.mobile_number,
      };
      axios
        .post(
          ApiConfig.base_url + "circle-terminate-request",
          JSON.stringify(obj),
          {
            headers: {
              Authorization: "Bearer " + this.state.rememberToken,
            },
          }
        )
        .then((res) => {
          if (res.data.message)
            ToastMessage(
              Language[this.state.selectedLanguage]["status"][res.data.message]
            );

          this.props.navigation.navigate("dashboardPage");
        })
        .catch((err) => {
          if (err.message)
            ToastMessage(
              Language[this.state.selectedLanguage]["status"][err.message]
            );
        });
    } else {
      alert("Something wrong");
    }
  };

  onSendReminder = (userType, screen) => {
    const { details, rememberToken } = this.state;
    this.setState({ reminderLoader: true });
    if (details.circle_code && rememberToken) {
      let obj = {
        circle_code: details.circle_code,
        user_type: userType,
        screen: screen,
      };

      axios
        .post(ApiConfig.base_url + "send-reminder", JSON.stringify(obj), {
          headers: {
            Authorization: "Bearer " + rememberToken,
          },
        })
        .then((res) => {
          this.setState({ reminderLoader: false });
          console.log("res============" + JSON.stringify(res));

          ToastMessage(
            Language[this.state.selectedLanguage]["status"][res.data.message]
          );

          this.props.navigation.navigate("dashboardPage");
        })
        .catch((err) => {
          this.setState({ reminderLoader: false });
          console.log("err============" + JSON.stringify(err));

          ToastMessage(
            Language[this.state.selectedLanguage]["status"][err.message]
          );
        });
    } else {
      this.setState({ reminderLoader: false });
    }
  };
  render() {
    const item = this.state.details;
    console.log("block item", item);
    return (
      <ScrollView
        contentContainerStyle={{ backgroundColor: "#fff", flexGrow: 1 }}
      >
        <HeaderCurve
          navigation={this.props.navigation}
          avatar_location={this.state.avatar_location}
          backButton={true}
          first_name={this.state.first_name}
          admin={item.is_admin}
          bellIcon={true}
          props={this.props}
        />
        {this.state.errorText != "" ? (
          <View style={{ alignItems: "center", marginTop: "50%" }}>
            <ErrorTemplate
              message={this.state.errorText}
              subMessage={this.state.subMessage}
            />
          </View>
        ) : (
          <View style={blockCircleOneStyle.mainContent}>
            {this.state.apiExecute ? (
              <View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      flex: 5,
                      fontSize: 20,
                      fontWeight: "bold",
                      paddingBottom: 5,
                      paddingTop: 5,
                    }}
                  >
                    {
                      Language[this.state.selectedLanguage]["common"][
                        "circle_blocked"
                      ]
                    }
                  </Text>
                  <Text>N° {item.circle_code}</Text>
                </View>

                {/* //NEW PASTED */}
                <View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: "#ccc",
                      padding: 5,
                    }}
                  >
                    <View style={onGoingCircleStyle.rowView}>
                      <View style={onGoingCircleStyle.rowViewLeftItem}>
                        <Text style={onGoingCircleStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              "dashboard_screen"
                            ]["circle_admin"]
                          }
                          :
                        </Text>
                      </View>
                      <View
                        style={[
                          onGoingCircleStyle.rowViewRightItem,
                          { flexDirection: "row" },
                        ]}
                      >
                        <Text
                          style={[
                            onGoingCircleStyle.rowTextValue,
                            { marginRight: 10 },
                          ]}
                        >
                          {item.admin}
                        </Text>
                      </View>
                    </View>
                    <View style={onGoingCircleStyle.rowView}>
                      <View style={onGoingCircleStyle.rowViewLeftItem}>
                        <Text style={onGoingCircleStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              "create_circle_screen"
                            ]["target_achieve"]
                          }
                          :
                        </Text>
                      </View>
                      <View style={onGoingCircleStyle.rowViewRightItem}>
                        <Text style={onGoingCircleStyle.rowTextValue}>
                          €{item.target_achive}
                        </Text>
                      </View>
                    </View>
                    <View style={onGoingCircleStyle.rowView}>
                      <View style={onGoingCircleStyle.rowViewLeftItem}>
                        <Text style={onGoingCircleStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              "create_circle_screen"
                            ]["round_settlement"]
                          }
                          :
                        </Text>
                      </View>
                      <View style={onGoingCircleStyle.rowViewRightItem}>
                        <Text style={onGoingCircleStyle.rowTextValue}>
                          €{item.round_set}
                        </Text>
                      </View>
                    </View>

                    <View style={onGoingCircleStyle.rowView}>
                      <View style={onGoingCircleStyle.rowViewLeftItem}>
                        <Text style={onGoingCircleStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              "create_circle_screen"
                            ]["periodicity_of_round"]
                          }
                          :
                        </Text>
                      </View>

                      <View style={onGoingCircleStyle.rowViewRightItem}>
                        <Text style={onGoingCircleStyle.rowTextValue}>
                          {
                            Language[this.state.selectedLanguage][
                              "create_circle_screen"
                            ][item.p_round]
                          }
                        </Text>
                      </View>
                    </View>

                    <View style={onGoingCircleStyle.rowView}>
                      <View style={onGoingCircleStyle.rowViewLeftItem}>
                        <Text style={onGoingCircleStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              "create_circle_screen"
                            ]["start_date"]
                          }
                          :
                        </Text>
                      </View>
                      <View style={onGoingCircleStyle.rowViewRightItem}>
                        <Text style={onGoingCircleStyle.rowTextValue}>
                          {CommonService.formatDate(item.start_date)}
                        </Text>
                      </View>
                    </View>

                    <View style={onGoingCircleStyle.rowView}>
                      <View style={onGoingCircleStyle.rowViewLeftItem}>
                        <Text style={onGoingCircleStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              "circle_preview_screen"
                            ]["end_date"]
                          }
                          :
                        </Text>
                      </View>
                      <View style={onGoingCircleStyle.rowViewRightItem}>
                        <Text style={onGoingCircleStyle.rowTextValue}>
                          {CommonService.formatDate(item.end_date)}
                        </Text>
                      </View>
                    </View>
                    <View style={{ paddingTop: 20 }}>
                      <Text style={onGoingCircleStyle.rowText}>
                        {
                          Language[this.state.selectedLanguage][
                            "circle_preview_screen"
                          ]["circle_participants"]
                        }
                        :
                      </Text>
                      <View
                        style={[
                          onGoingCircleStyle.rowViewNew,
                          { paddingBottom: 20 },
                        ]}
                      >
                        {item.circleUsers !== undefined
                          ? item.circleUsers.map((user_item, user_index) => (
                              <View
                                key={user_index}
                                style={{ flexDirection: "row" }}
                              >
                                <View
                                  style={onGoingCircleStyle.nextRowViewLeftItem}
                                >
                                  <Text style={onGoingCircleStyle.rowTextValue}>
                                    {user_index + 1}.{user_item.username}(
                                    {user_item.mobile_country_code}
                                    {user_item.mobile_number})
                                  </Text>
                                </View>
                              </View>
                            ))
                          : null}
                      </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <View style={onGoingCircleStyle.rowViewLeftItem}>
                        <Text style={onGoingCircleStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage]["common"][
                              "progress"
                            ]
                          }
                          :
                        </Text>
                      </View>
                      <View style={onGoingCircleStyle.rowViewRightItem}>
                        {item.completed_round == item.estimate_round ? (
                          <Text style={onGoingCircleStyle.rowTextValue}>
                            {
                              Language[this.state.selectedLanguage]["common"][
                                "completed"
                              ]
                            }
                          </Text>
                        ) : item.completed_round > 1 ? (
                          <Text style={onGoingCircleStyle.rowTextValue}>
                            {item.completed_round +
                              " " +
                              Language[this.state.selectedLanguage][
                                "circle_completed_screen"
                              ]["round_over_out"] +
                              " " +
                              item.estimate_round}
                          </Text>
                        ) : item.completed_round < 2 ? (
                          <Text style={onGoingCircleStyle.rowTextValue}>
                            {item.completed_round +
                              " " +
                              Language[this.state.selectedLanguage][
                                "circle_completed_screen"
                              ]["round_over_out"] +
                              " " +
                              item.estimate_round}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", paddingTop: 3 }}>
                      <View style={onGoingCircleStyle.rowViewLeftItem}>
                        <Text style={onGoingCircleStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              "circle_preview_screen"
                            ]["end_date"]
                          }
                          :
                        </Text>
                      </View>
                      <View style={onGoingCircleStyle.rowViewRightItem}>
                        <Text style={onGoingCircleStyle.rowTextValue}>
                          {CommonService.formatDate(item.end_date)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={onGoingCircleStyle.tableContent}>
                    <ScrollView>
                      <View style={onGoingCircleStyle.tablePart}>
                        <Text style={onGoingCircleStyle.baseText}>
                          <Text
                            style={[
                              onGoingCircleStyle.tableText,
                              { fontWeight: "bold" },
                            ]}
                          >
                            {
                              Language[this.state.selectedLanguage]["common"][
                                "round"
                              ]
                            }{" "}
                            {item.current_round}-{" "}
                          </Text>
                          <Text
                            style={[
                              onGoingCircleStyle.tableText,
                              { color: "#000000", fontWeight: "bold" },
                            ]}
                            numberOfLines={1}
                          >
                            {
                              Language[this.state.selectedLanguage]["common"][
                                "overdue"
                              ]
                            }
                          </Text>
                        </Text>

                        <View>
                          {item.circleUsers.map((user_item, user_index) => (
                            <View
                              key={user_index}
                              style={onGoingCircleStyle.rowView}
                            >
                              <View style={onGoingCircleStyle.rowViewLeftItem}>
                                <Text style={onGoingCircleStyle.rowTextValue}>
                                  {user_item.username}
                                </Text>
                              </View>
                              <View style={onGoingCircleStyle.rowViewRightItem}>
                                {user_item.current_round_payment_status == 0 ? (
                                  <Text style={{ color: "#E15862" }}>
                                    {
                                      Language[this.state.selectedLanguage][
                                        "ongoing_circle_screen"
                                      ]["not_paid"]
                                    }
                                  </Text>
                                ) : user_item.current_round_payment_status ==
                                  3 ? (
                                  <Text style={{ color: "#E15862" }}>
                                    {
                                      Language[this.state.selectedLanguage][
                                        "common"
                                      ]["pending"]
                                    }
                                  </Text>
                                ) : user_item.current_round_payment_status ==
                                  1 ? (
                                  <Text style={{ color: "#23CB97" }}>
                                    {
                                      Language[this.state.selectedLanguage][
                                        "common"
                                      ]["paid"]
                                    }
                                  </Text>
                                ) : null}
                              </View>
                            </View>
                          ))}
                        </View>
                        <Text style={{ fontWeight: "bold" }}>
                          {
                            Language[this.state.selectedLanguage][
                              "ongoing_circle_screen"
                            ]["start_date"]
                          }{" "}
                          :{item.round_start_date}
                        </Text>
                        <Text style={{ fontWeight: "bold" }}>
                          {
                            Language[this.state.selectedLanguage][
                              "ongoing_circle_screen"
                            ]["end_date"]
                          }{" "}
                          :{item.round_end_date}
                        </Text>

                        <View
                          style={blockCircleOneStyle.tableContentPaymentHistory}
                        >
                          <ScrollView>
                            <View style={blockCircleOneStyle.tablePart}>
                              <Text style={blockCircleOneStyle.baseText}>
                                <Text style={blockCircleOneStyle.titleText}>
                                  {
                                    Language[this.state.selectedLanguage][
                                      "ongoing_circle_screen"
                                    ]["payment_due"]
                                  }
                                  {
                                    Language[this.state.selectedLanguage][
                                      "dashboard_screen"
                                    ]["blocked"]
                                  }
                                  :{" "}
                                  {this.getNumberOfDays(
                                    CommonService.getDateMonthFirst(),
                                    CommonService.formatDateMontFirst(
                                      item.current_round_payment_date
                                    )
                                  )}{" "}
                                  {
                                    Language[this.state.selectedLanguage][
                                      "block_circle_screen"
                                    ]["days_ago"]
                                  }
                                </Text>
                              </Text>
                              {item.circleUsers.map((user_item, user_index) => (
                                <View key={user_index}>
                                  {user_item.current_round_payment_status ==
                                  0 ? (
                                    <View style={blockCircleOneStyle.rowView}>
                                      <View
                                        style={
                                          blockCircleOneStyle.rowViewLeftItem
                                        }
                                      >
                                        <Text>{user_item.username}</Text>
                                      </View>
                                    </View>
                                  ) : null}
                                </View>
                              ))}
                            </View>
                          </ScrollView>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </View>
                {/* && item.login_user_current_round_payment_status == 0) */}
                {item.is_admin == 1 ? (
                  <View style={blockCircleOneStyle.paymentButtonView}>
                    <TouchableOpacity
                      style={blockCircleOneStyle.paymentButton}
                      onPress={() => this.onSendReminder(1, 2)}
                    >
                      <Text style={blockCircleOneStyle.paymentText}>
                        {
                          Language[this.state.selectedLanguage][
                            "block_circle_screen"
                          ]["send_payment_reminder"]
                        }
                      </Text>
                      {this.state.reminderLoader ? (
                        <View style={{ marginLeft: 10 }}>
                          <ActivityIndicator size="small" color={"#FFFFFF"} />
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  </View>
                ) : null}
                {item.login_user_current_round_payment_status === 0 &&
                this.state.paybuttonVisible ? ( //pay button visible
                  <View style={blockCircleOneStyle.paymentButtonView}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("bankDetailsPage", {
                          result: this.state.details,
                          navigate_from: "block_details",
                        })
                      }
                      style={blockCircleOneStyle.terminateButton}
                    >
                      <Text style={blockCircleOneStyle.paymentText}>
                        {
                          Language[this.state.selectedLanguage][
                            "bank_details_screen"
                          ]["pay_my_round"]
                        }
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {item.is_admin === 0 ? (
                  <View>
                    <View style={blockCircleOneStyle.paymentButtonView}>
                      <TouchableOpacity
                        onPress={() =>
                          this.makeCall(
                            (
                              this.state.admin_mobile_code + item.admin_mobile
                            ).toString()
                          )
                        }
                        style={blockCircleOneStyle.paymentButton}
                      >
                        <Text style={blockCircleOneStyle.paymentText}>
                          {
                            Language[this.state.selectedLanguage][
                              "block_circle_screen"
                            ]["call_the_admin"]
                          }
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={blockCircleOneStyle.paymentButtonView}>
                      <TouchableOpacity
                        style={blockCircleOneStyle.remiderButton}
                        onPress={() => this.onSendReminder(2, 2)}
                      >
                        <Text style={blockCircleOneStyle.remiderText}>
                          {
                            Language[this.state.selectedLanguage][
                              "invitation_circle_screen"
                            ]["send_reminder"]
                          }
                        </Text>
                        {this.state.reminderLoader ? (
                          <View style={{ marginLeft: 10 }}>
                            <ActivityIndicator size="small" color={"green"} />
                          </View>
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
                {item.round_complete
                  .map((user_round, round_index) => (
                    <View
                      key={round_index}
                      style={blockCircleOneStyle.roundRow}
                    >
                      <ScrollView>
                        <View style={blockCircleOneStyle.tablePart}>
                          <Text style={blockCircleOneStyle.baseText}>
                            <Text style={blockCircleOneStyle.titleText}>
                              {
                                Language[this.state.selectedLanguage]["common"][
                                  "round"
                                ]
                              }{" "}
                              {user_round.round}-{" "}
                            </Text>
                            <Text
                              style={[
                                blockCircleOneStyle.tableText,
                                { color: "#20CC94" },
                              ]}
                              numberOfLines={5}
                            >
                              {
                                Language[this.state.selectedLanguage]["common"][
                                  "completed"
                                ]
                              }
                            </Text>
                          </Text>
                          <View style={blockCircleOneStyle.rowView}>
                            <View style={blockCircleOneStyle.rowViewLeftItem}>
                              <Text>{user_round.reciever_msg}</Text>
                            </View>
                          </View>
                        </View>
                      </ScrollView>
                    </View>
                  ))
                  .reverse()}
                {item.is_admin === 0 && item.termination_request_sent === 0 ? (
                  <View style={blockCircleOneStyle.paymentButtonView}>
                    <TouchableOpacity
                      style={blockCircleOneStyle.terminateButton}
                      onPress={() => {
                        this.onRequstToTerminate();
                      }}
                    >
                      <Text style={blockCircleOneStyle.paymentText}>
                        {
                          Language[this.state.selectedLanguage][
                            "block_circle_screen"
                          ]["request_terminate"]
                        }
                      </Text>
                      {this.state.btnLoader ? (
                        <View style={{ marginLeft: 10 }}>
                          <ActivityIndicator size="small" color={"#FFFFFF"} />
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  </View>
                ) : null}
                {item.is_admin === 1 ? (
                  <View style={blockCircleOneStyle.paymentButtonView}>
                    <TouchableOpacity
                      style={blockCircleOneStyle.terminateButton}
                      onPress={() => this.onTerminateCircle()} // Terminate circle by admin
                    >
                      <Text style={blockCircleOneStyle.paymentText}>
                        {
                          Language[this.state.selectedLanguage][
                            "block_circle_screen"
                          ]["terminate"]
                        }
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    );
  }
}
