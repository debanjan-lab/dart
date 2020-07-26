import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import refusalInvitationStyle from "./refusalInvitationStyle";

import URL from "../../config/url";
import AsyncStorage from "@react-native-community/async-storage";
import headerStyle from "../../assets/css/header/headerStyle";
import HeaderCurve from "../includes/headercurve";
import CommonService from "../../services/common/commonService";
import httpService from "../../services/http/httpService";

import { ErrorTemplate } from "../../components/error/errorComponent";
let selectedId = 8;

import Language from "../../translations/index";

export default class RefusalInvitationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rememberToken: "",
      cicle_code: "",
      first_name: "",
      avatar_location: "",
      user_id: "",
      errorText: "",
      subMessage: "",
      errRejectMsg: "",
      details: Object.create(null),
      apiExecute: false,
      reason: [],
      reasonId: selectedId,
      reasonTxt: "Other",
      otherReason: "",
      selectedLanguage: "en",
    };
  }

  UNSAFE_componentWillMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    selectedId = 8;
    let selectedDetails = this.props.navigation.getParam("result");
    AsyncStorage.multiGet([
      "rememberToken",
      "circle_code",
      "first_name",
      "avatar_location",
      "user_id",
    ]).then((response) => {
      this.setState(
        {
          rememberToken: response[0][1],
          cicle_code: response[1][1],
          first_name: response[2][1],
          avatar_location: {
            uri: URL.public_url + "storage/" + response[3][1],
          },
          user_id: response[4][1],
          details: selectedDetails,
          selectedLanguage: "fr",
        },
        () => {
          this.getReason();
        }
      );
    });
  };

  getReason() {

    let payload = {
      url: "get-reason",
      data: {
        type: 2,
      },
    };

    httpService
      .postHttpCall(payload)
      .then((res) => {

        if (res.status !== undefined) {
          if (res.status == 100) {
            this.setState({ reason: res.result });
          } else {
            this.setState({ errorText: res.message });
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

        this.setState({ errorText: err.message, apiExecute: true });
        if (err.status == 4) {
          this.setState({ subMessage: httpService.appMessege.internet_sub });
        }
      });
  }

  selectReason(id, txt) {
    selectedId = id;
    this.setState({ reasonId: id, reasonTxt: txt });
  }

  doReject() {
    let item = this.state.details;

    let payload = {
      url: "circle-request-reject",
      data: {
        circle_code: item.circle_code,
        join_status: 2,
        reason_id: this.state.reasonId,
        other_reason: this.state.otherReason,
        mobile_number: item.login_user_mobile,
      },

      authtoken: this.state.rememberToken,
    };
    httpService
      .postHttpCall(payload)
      .then((res) => {

        if (res.status !== undefined) {
          console.log("doReject()==" + JSON.stringify(res));
          if (res.status == 100) {
            CommonService.showConfirmAlert(
              res.message
                ? Language[this.state.selectedLanguage]["status"][res.message]
                : "",
              (response) => {
                if (response) {
                  this.props.navigation.push("dashboardPage");
                }
              }
            );
          } else {
            this.setState({
              errRejectMsg: res.message
                ? Language[this.state.selectedLanguage]["status"][res.message]
                : "",
            });
          }
        } else {
          this.setState({ errRejectMsg: httpService.appMessege.unknown_error });
        }
      })
      .catch((err) => {

        this.setState({
          errRejectMsg: err.message
            ? Language[this.state.selectedLanguage]["status"][err.message]
            : "",
        });
      });
  }

  onError(error) {
    this.setState({
      avatar_location: require("../../../assets/images/contact.png"),
    });
  }

  render() {
    const item = this.state.details;
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <HeaderCurve
          navigation={this.props.navigation}
          avatar_location={this.state.avatar_location}
          backButton={true}
          first_name={this.state.first_name}
          admin={item.is_admin}
          bellIcon={true}
        />

        <ScrollView contentContainerStyle={{ backgroundColor: '#fff', flexGrow: 1 }}>



          {this.state.errorText != "" ? (
            <View style={{ alignItems: "center", marginTop: "50%" }}>
              <ErrorTemplate
                message={this.state.errorText}
                subMessage={this.state.subMessage}
              />
            </View>
          ) : (
              <View style={refusalInvitationStyle.mainContent}>
                {this.state.apiExecute ? (
                  <View>
                    <View style={refusalInvitationStyle.headerText}>
                      <Text style={refusalInvitationStyle.title}>
                        {
                          Language[this.state.selectedLanguage][
                          "dashboard_screen"
                          ]["circle"]
                        }
                      ({item.circle_code})
                      {
                          Language[this.state.selectedLanguage][
                          "circle_refusal_screen"
                          ]["refusal"]
                        }
                      </Text>
                    </View>
                    <View style={refusalInvitationStyle.rowView}>
                      <View style={refusalInvitationStyle.rowViewLeftItem}>
                        <Text style={{ fontSize: 20 }}>
                          {
                            Language[this.state.selectedLanguage][
                            "circle_refusal_screen"
                            ]["reason_for_refusal"]
                          }
                        :
                      </Text>
                      </View>
                      <View style={refusalInvitationStyle.rowViewRightItem}>
                        <View style={refusalInvitationStyle.selectText}>
                          <View style={refusalInvitationStyle.childRowView}>
                            <View
                              style={refusalInvitationStyle.childRowViewLeftItem}
                            >
                              <Text numberOfLines={1}>
                                {this.state.reasonTxt}
                              </Text>
                            </View>
                            <View
                              style={refusalInvitationStyle.childRowViewRightItem}
                            >
                              {/* <Icon
                              name="arrow-down"
                              style={{ fontSize: 18, color: "#A9A9A9" }}
                            /> */}
                            </View>
                          </View>
                        </View>
                        <View>
                          <View
                            style={[
                              refusalInvitationStyle.unSelectText,
                              { marginTop: 10 },
                            ]}
                          >
                            {this.state.reason.map(
                              (reason_item, reason_index) => (
                                <TouchableOpacity
                                  key={reason_index}
                                  onPress={() => {
                                    this.selectReason(
                                      reason_item.id,
                                      reason_item.reason
                                    );
                                  }}
                                >
                                  <View
                                    style={[
                                      refusalInvitationStyle.childRowView,
                                      refusalInvitationStyle.borderBottom,
                                      reason_item.id == selectedId
                                        ? { backgroundColor: "#E7E7E7" }
                                        : {},
                                    ]}
                                  >
                                    <View
                                      style={
                                        refusalInvitationStyle.childRowViewLeftItem
                                      }
                                    >
                                      <Text numberOfLines={1}>
                                        {
                                          Language[this.state.selectedLanguage][
                                          "circle_join_reason_list"
                                          ][reason_item.reason_alias]
                                        }
                                      </Text>
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              )
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={refusalInvitationStyle.otherResonView}>
                      {this.state.reasonId == 8 ? (
                        <View>
                          <Text style={{ fontSize: 20 }}>
                            {
                              Language[this.state.selectedLanguage][
                              "accept_invitation_screen"
                              ]["other_reason"]
                            }
                          :
                        </Text>
                          <View style={{ marginTop: 10 }}>
                            <TextInput
                              style={refusalInvitationStyle.textInput}
                              multiline={true}
                              onChangeText={(otherReason) =>
                                this.setState({ otherReason })
                              }
                            />
                          </View>
                        </View>
                      ) : null}
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "red",
                            fontSize: 16,
                          }}
                        >
                          {this.state.errRejectMsg}
                        </Text>
                      </View>
                      <View style={refusalInvitationStyle.paymentButtonView}>
                        <TouchableOpacity
                          onPress={() => this.doReject()}
                          disabled={
                            selectedId == 8 && this.state.otherReason == ""
                              ? true
                              : false
                          }
                          style={[
                            selectedId == 8 && this.state.otherReason == ""
                              ? { opacity: 0.8 }
                              : {},
                            refusalInvitationStyle.paymentButton,
                          ]}
                        >
                          <Text style={refusalInvitationStyle.paymentText}>
                            {
                              Language[this.state.selectedLanguage]["common"][
                              "send"
                              ]
                            }
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : null}
              </View>
            )}

        </ScrollView>




      </View>
    );
  }
}
