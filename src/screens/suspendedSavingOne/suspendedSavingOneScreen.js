import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { ToastMessage } from "../../components/ToastMessage";

import suspendedSavingOneStyle from "./suspendedSavingOneStyle";
import HeaderCurve from "../includes/headercurve";
import headerStyle from "../../assets/css/header/headerStyle";
import axios from "axios";
import URL from "../../config/url";
import AsyncStorage from "@react-native-community/async-storage";
import CommonService from "../../services/common/commonService";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);
import Language from "../../translations/index";

const ApiConfig = URL;

export default class SuspendedSavingOneScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: "",
      userName: "",
      token: "",
      currency: "",
      payableBalance: "",
      avatar_location: "",
      btnLoader: false,
      selectedLanguage: "en",
    };
  }

  componentDidMount() {
    let item = this.props.navigation.getParam("result");
    AsyncStorage.multiGet([
      "rememberToken",
      "circle_code",
      "first_name",
      "avatar_location",
    ]).then((response) => {
      this.setState(
        {
          token: response[0][1],
          userName: response[2][1],
          selectedLanguage: "fr",
          avatar_location: {
            uri: URL.public_url + "storage/" + response[3][1],
          },
        },
        () => {
          this.onGetItemDetails(item.circle_code, this.state.token);
          this.onGetCurrency(this.state.token);
        }
      );
      console.log("avatar_location===" + this.state.avatar_location.uri);
    });
  }
  onGetItemDetails = (circle_code, token) => {
    console.log(ApiConfig.base_url + "ongoing-circle-details");
    console.log("circle_code", circle_code);
    console.log("token", token);
    if (circle_code) {
      let data = {
        circle_code: circle_code,
      };
      axios
        .post(
          ApiConfig.base_url + "ongoing-circle-details",
          JSON.stringify(data),
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          console.log("res", res.data);
          if (res.data) {
            this.setState({ item: res.data.result });
          }
        })
        .catch((err) => {
          console.log("err", err);

          ToastMessage(
            Language[this.state.selectedLanguage]["status"][err.message]
          );
        });
    }
  };

  onGetCurrency = (token) => {
    axios
      .get(ApiConfig.base_url + "get-currency", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((currencyData) => {
        this.setState({ currency: currencyData.data.result });
      })
      .catch((err) => {
        ToastMessage(
          Language[this.state.selectedLanguage]["status"][err.message]
        );
      });
  };

  onCircleReportOrIncident = (user_type) => {
    const { item, token } = this.state;
    this.setState({ btnLoader: true });
    if (item.circle_code && token) {
      let obj = {
        circle_code: item.circle_code,
        user_type: user_type,
      };
      //console.log("obj=======", obj);
      // console.log("api=======", ApiConfig.base_url + "circle-report");

      axios
        .post(ApiConfig.base_url + "circle-report", JSON.stringify(obj), {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          this.setState({ btnLoader: false });
          ToastMessage(
            Language[this.state.selectedLanguage]["status"][res.data.message]
          );

          this.props.navigation.navigate("suspendedScreen");
        })
        .catch((err) => {
          this.setState({ btnLoader: false });
          //console.log("err=======", err.response);
          ToastMessage(
            Language[this.state.selectedLanguage]["status"][err.message]
          );
        });
    } else {
      this.setState({ btnLoader: false });
    }
  };

  render() {
    const { item, currency, userName } = this.state;
    console.log("suspended item", item);
    return item ? (
      <ScrollView
        contentContainerStyle={{ backgroundColor: "#fff", flexGrow: 1 }}
      >
        <HeaderCurve
          navigation={this.props.navigation}
          avatar_location={this.state.avatar_location}
          backButton={true}
          first_name={userName}
          admin={item.is_admin}
          bellIcon={false}
          props={this.props}
        />

        <View style={[suspendedSavingOneStyle.mainContent]}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {
                Language[this.state.selectedLanguage]["common"][
                  "circle_dismantled"
                ]
              }
            </Text>
            <Text>N° {item.circle_code}</Text>
          </View>
          <View style={{ marginTop: 15 }}>
            <View style={suspendedSavingOneStyle.rowView}>
              <View style={suspendedSavingOneStyle.rowViewLeftItem}>
                <Text style={suspendedSavingOneStyle.rowText}>
                  {
                    Language[this.state.selectedLanguage][
                      "create_circle_screen"
                    ]["target_achieve"]
                  }
                  :
                </Text>
              </View>
              <View style={suspendedSavingOneStyle.rowViewRightItem}>
                <Text style={suspendedSavingOneStyle.rowTextValue}>
                  {currency.curr_code}
                  {item.target_achive}
                </Text>
              </View>
            </View>
            <View style={suspendedSavingOneStyle.rowView}>
              <View style={suspendedSavingOneStyle.rowViewLeftItem}>
                <Text style={suspendedSavingOneStyle.rowText}>
                  {
                    Language[this.state.selectedLanguage][
                      "create_circle_screen"
                    ]["round_settlement"]
                  }
                  :
                </Text>
              </View>
              <View style={suspendedSavingOneStyle.rowViewRightItem}>
                <Text style={suspendedSavingOneStyle.rowTextValue}>
                  {currency.curr_code}
                  {item.round_set}
                </Text>
              </View>
            </View>
            <View style={suspendedSavingOneStyle.rowView}>
              <View style={suspendedSavingOneStyle.rowViewLeftItem}>
                <Text style={suspendedSavingOneStyle.rowText}>
                  {
                    Language[this.state.selectedLanguage]["dashboard_screen"][
                      "circle"
                    ]
                  }
                  :
                </Text>
              </View>
              <View style={suspendedSavingOneStyle.rowViewRightItem}>
                <Text style={suspendedSavingOneStyle.rowTextValue}>
                  {
                    Language[this.state.selectedLanguage][
                      "create_circle_screen"
                    ][item.p_round]
                  }
                </Text>
              </View>
            </View>
            <View style={suspendedSavingOneStyle.rowView}>
              <View style={suspendedSavingOneStyle.rowViewLeftItem}>
                <Text style={suspendedSavingOneStyle.rowText}>
                  {
                    Language[this.state.selectedLanguage][
                      "create_circle_screen"
                    ]["start_date"]
                  }
                  :
                </Text>
              </View>
              <View style={suspendedSavingOneStyle.rowViewRightItem}>
                <Text style={suspendedSavingOneStyle.rowTextValue}>
                  {CommonService.formatDate(item.start_date)}
                </Text>
              </View>
            </View>
            <View style={suspendedSavingOneStyle.rowView}>
              <View style={suspendedSavingOneStyle.rowViewLeftItem}>
                <Text style={suspendedSavingOneStyle.rowText}>
                  {
                    Language[this.state.selectedLanguage][
                      "suspended_circle_screen"
                    ]["blocked_round"]
                  }
                  :
                </Text>
              </View>
              <View style={suspendedSavingOneStyle.rowViewRightItem}>
                <Text style={suspendedSavingOneStyle.rowTextValue}>
                  {item.current_round}
                </Text>
              </View>
            </View>
            <View style={{ paddingTop: 20 }}>
              <Text style={suspendedSavingOneStyle.rowText}>
                {
                  Language[this.state.selectedLanguage][
                    "suspended_circle_screen"
                  ]["balance_circle"]
                }
                :
              </Text>
              {item.circleUsers !== undefined ? (
                <View style={suspendedSavingOneStyle.tableContainer}>
                  {/* table header start */}
                  <View style={suspendedSavingOneStyle.thView}>
                    <View
                      style={[
                        suspendedSavingOneStyle.rowViewCommon,
                        { flex: 1, alignSelf: "stretch" },
                      ]}
                    >
                      <Text
                        style={[
                          suspendedSavingOneStyle.thText,
                          { color: "white" },
                        ]}
                      >
                        {
                          Language[this.state.selectedLanguage]["common"][
                            "name"
                          ]
                        }
                      </Text>
                    </View>
                    <View
                      style={[
                        { flex: 1, alignSelf: "stretch" },
                        suspendedSavingOneStyle.rowViewCommon,
                      ]}
                    >
                      <Text
                        style={[
                          suspendedSavingOneStyle.thText,
                          { color: "white" },
                        ]}
                      >
                        {
                          Language[this.state.selectedLanguage][
                            "suspended_circle_screen"
                          ]["round_status_payment"]
                        }
                      </Text>
                    </View>
                    <View
                      style={[
                        { flex: 1, alignSelf: "stretch" },
                        suspendedSavingOneStyle.rowViewCommon,
                      ]}
                    >
                      <Text
                        style={[
                          suspendedSavingOneStyle.thText,
                          { color: "white" },
                        ]}
                      >
                        {
                          Language[this.state.selectedLanguage]["common"][
                            "paid"
                          ]
                        }
                      </Text>
                    </View>
                    <View
                      style={[
                        { flex: 1, alignSelf: "stretch" },
                        suspendedSavingOneStyle.rowViewCommon,
                      ]}
                    >
                      <Text
                        style={[
                          suspendedSavingOneStyle.thText,
                          { color: "white" },
                        ]}
                      >
                        {
                          Language[this.state.selectedLanguage]["common"][
                            "collected"
                          ]
                        }
                      </Text>
                    </View>
                    <View
                      style={[
                        {
                          flex: 1,
                          alignSelf: "stretch",
                          paddingLeft: 5,
                          paddingRight: 5,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          suspendedSavingOneStyle.thText,
                          { color: "white" },
                        ]}
                      >
                        {
                          Language[this.state.selectedLanguage]["common"][
                            "balance"
                          ]
                        }
                        {"\n"}(
                        {
                          Language[this.state.selectedLanguage][
                            "suspended_circle_screen"
                          ]["excluding_deposit"]
                        }
                        )
                      </Text>
                    </View>
                  </View>
                  {/* table header end */}

                  {/* table row start */}
                  {item.circleUsers.map((user, index) => {
                    return (
                      <View style={suspendedSavingOneStyle.tdView} key={index}>
                        <View
                          style={[
                            suspendedSavingOneStyle.rowViewCommon,
                            { flex: 1, alignSelf: "stretch" },
                          ]}
                        >
                          <Text style={suspendedSavingOneStyle.thText}>
                            {user.username}
                          </Text>
                        </View>
                        <View
                          style={[
                            { flex: 1, alignSelf: "stretch" },
                            suspendedSavingOneStyle.rowViewCommon,
                          ]}
                        >
                          {user.current_round_payment_status === 1 ? (
                            <Text style={suspendedSavingOneStyle.thText}>
                              {
                                Language[this.state.selectedLanguage][
                                  "suspended_circle_screen"
                                ]["up_to_date"]
                              }
                            </Text>
                          ) : (
                            <Text style={suspendedSavingOneStyle.thTextNotPaid}>
                              {
                                Language[this.state.selectedLanguage][
                                  "ongoing_circle_screen"
                                ]["not_paid"]
                              }
                            </Text>
                          )}
                        </View>
                        <View
                          style={[
                            { flex: 1, alignSelf: "stretch" },
                            suspendedSavingOneStyle.rowViewCommon,
                          ]}
                        >
                          <Text style={suspendedSavingOneStyle.thText}>
                            {currency.curr_code}
                            {user.totalPaymentDetails}
                          </Text>
                        </View>
                        <View
                          style={[
                            { flex: 1, alignSelf: "stretch" },
                            suspendedSavingOneStyle.rowViewCommon,
                          ]}
                        >
                          <Text style={suspendedSavingOneStyle.thText}>
                            {currency.curr_code}
                            {user.withdrawDetails}
                          </Text>
                        </View>
                        <View
                          style={[
                            {
                              flex: 1,
                              alignSelf: "stretch",
                              paddingLeft: 5,
                              paddingRight: 5,
                            },
                          ]}
                        >
                          <Text style={suspendedSavingOneStyle.thText}>
                            {currency.curr_code} {user.balance}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}
              {item.receive_amount !== 0 ? (
                <View style={{ padding: 5, marginTop: 5 }}>
                  <Text style={suspendedSavingOneStyle.rowTextValue}>
                    {
                      Language[this.state.selectedLanguage][
                        "suspended_circle_screen"
                      ]["hint1"]
                    }{" "}
                    {item.receive_amount}
                    {
                      Language[this.state.selectedLanguage][
                        "suspended_circle_screen"
                      ]["hint2"]
                    }{" "}
                    {item.round_set}
                    {
                      Language[this.state.selectedLanguage][
                        "suspended_circle_screen"
                      ]["hint3"]
                    }
                    .
                  </Text>
                </View>
              ) : null}
            </View>
            {item.refund_amount !== undefined && item.refund_amount !== 0 ? (
              <View style={suspendedSavingOneStyle.sendButtonView}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("bankDetailsPage", {
                      result: item,
                      navigate_from: "suspend_details",
                    });
                  }}
                  style={{
                    width: "100%",
                    borderRadius: 50,
                    backgroundColor: "#ffffff",
                    alignItems: "center",
                    padding: 14,
                    borderColor: "#5AC6C6",
                    borderWidth: 1,
                  }}
                >
                  <Text style={suspendedSavingOneStyle.sendButtonText1}>
                    {Language[this.state.selectedLanguage]["common"]["pay"]}{" "}
                    {item.refund_amount}
                    {currency.curr_code}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={suspendedSavingOneStyle.sendButtonView}>
              {item.is_admin === 1 ? (
                <TouchableOpacity
                  style={suspendedSavingOneStyle.sendButton}
                  onPress={() => this.onCircleReportOrIncident(1)}
                >
                  <Text style={suspendedSavingOneStyle.sendButtonText}>
                    {
                      Language[this.state.selectedLanguage][
                        "suspended_circle_screen"
                      ]["report_incident"]
                    }
                  </Text>
                  {this.state.btnLoader ? (
                    <View style={{ marginLeft: 10 }}>
                      <ActivityIndicator size="small" color={"#FFFFFF"} />
                    </View>
                  ) : null}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={suspendedSavingOneStyle.sendButton}
                  onPress={() => this.onCircleReportOrIncident(2)}
                >
                  <Text style={suspendedSavingOneStyle.sendButtonText}>
                    {
                      Language[this.state.selectedLanguage][
                        "suspended_circle_screen"
                      ]["report_circle"]
                    }
                  </Text>
                  {this.state.btnLoader ? (
                    <View style={{ marginLeft: 10 }}>
                      <ActivityIndicator size="small" color={"#FFFFFF"} />
                    </View>
                  ) : null}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    ) : (
      <ScrollView
        contentContainerStyle={{ backgroundColor: "#fff", flexGrow: 1 }}
      >
        <HeaderCurve
          navigation={this.props.navigation}
          avatar_location={this.state.avatar_location}
          backButton={true}
          first_name={userName}
          admin={item.is_admin}
          bellIcon={false}
          props={this.props}
        />
        <View
          style={{
            flex: 1,
            height: screenHeight - 150,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#1CCBE6" />
        </View>
      </ScrollView>
    );
  }
}
