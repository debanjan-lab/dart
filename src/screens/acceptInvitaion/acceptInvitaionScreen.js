import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import acceptInvitaionStyle from "./acceptInvitaionStyle";

import URL from "../../config/url";
import AsyncStorage from "@react-native-community/async-storage";
import HeaderCurve from "../includes/headercurve";
import CommonService from "../../services/common/commonService";
import httpService from "../../services/http/httpService";
import Loading from "react-native-loader-overlay";
import { ErrorTemplate } from "../../components/error/errorComponent";

let selectedId = 9;

import Language from "../../translations/index";

export default class AcceptInvitaionScreen extends Component {
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
      details: Object.create(null),
      apiExecute: false,
      reason: [],
      reasonId: 9,
      reasonTxt: "Other",
      otherReason: "",
      selectedLanguage: 'en'
    };
  }

  UNSAFE_componentWillMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    selectedId = 9;
    let selectedDetails = this.props.navigation.getParam("result");
    AsyncStorage.multiGet([
      "rememberToken",
      "circle_code",
      "first_name",
      "avatar_location",
      "user_id"
    ]).then(response => {
      this.setState(
        {
          rememberToken: response[0][1],
          cicle_code: response[1][1],
          first_name: response[2][1],
          avatar_location: {
            uri: URL.public_url + "storage/" + response[3][1]
          },
          user_id: response[4][1],
          details: selectedDetails,
          selectedLanguage: 'fr'
        },
        () => {
          this.getReason();
        }
      );
    });
  };

  onError(error) {
    this.setState({
      avatar_location: require("../../../assets/images/contact.png")
    });
  }

  getReason() {
    this.loading = Loading.show(CommonService.loaderObj);
    let payload = {
      url: "get-reason",
      data: {
        type: 1
      }
    };



    httpService
      .postHttpCall(payload)
      .then(res => {
        Loading.hide(this.loading);

        console.log("res11=============" + JSON.stringify(res))




        if (res.status !== undefined) {
          if (res.status == 100) {
            this.setState({ reason: res.result });
          } else {
            this.setState({ errorText: res.message ? Language[this.state.selectedLanguage]['status'][res.message] : '' });
          }
        } else {
          this.setState({
            errorText: httpService.appMessege.unknown_error,
            subMessage: httpService.appMessege.working_progress
          });
        }
        this.setState({ apiExecute: true });
      })
      .catch(err => {
        Loading.hide(this.loading);
        this.setState({ errorText: err.message ? Language[this.state.selectedLanguage]['status'][err.message] : '', apiExecute: true });
        if (err.status == 4) {
          this.setState({ subMessage: httpService.appMessege.internet_sub });
        }
      });
  }

  selectReason(id, txt) {
    selectedId = id;
    this.setState({ reasonId: id, reasonTxt: txt });
  }


  render() {
    const item = this.state.details;
    return (
      <ScrollView contentContainerStyle={{ backgroundColor: '#fff', flexGrow: 1 }}>
        <HeaderCurve
          //title={"Create Circle"}
          navigation={this.props.navigation}
          avatar_location={this.state.avatar_location}
          backButton={true}
          first_name={this.state.first_name}
          admin={item.is_admin}
          bellIcon={true}
        />

        {this.state.errorText != "" ? (
          <View style={{ alignItems: "center", marginTop: "50%" }}>
            <ErrorTemplate
              message={this.state.errorText}
              subMessage={this.state.subMessage}
            />
          </View>
        ) : (
            <View style={acceptInvitaionStyle.mainContent}>
              {this.state.apiExecute ? (
                <View>
                  <View style={acceptInvitaionStyle.headerText}>
                    <Text style={acceptInvitaionStyle.title}>
                      {Language[this.state.selectedLanguage]['dashboard_screen']['circle']}({item.circle_code})
                    {Language[this.state.selectedLanguage]['accept_invitation_screen']['accept_invitation']}
                    </Text>
                  </View>
                  <View style={acceptInvitaionStyle.rowView}>
                    <View style={acceptInvitaionStyle.rowViewLeftItem}>
                      <Text style={{ fontSize: 20 }}>
                        {Language[this.state.selectedLanguage]['create_circle_screen']['reason']}:
                      </Text>
                    </View>
                    <View style={acceptInvitaionStyle.rowViewRightItem}>
                      <View style={acceptInvitaionStyle.selectText}>
                        <View style={acceptInvitaionStyle.childRowView}>
                          <View
                            style={acceptInvitaionStyle.childRowViewLeftItem}
                          >
                            <Text numberOfLines={1}>
                              {this.state.reasonTxt}
                            </Text>
                          </View>
                          <View
                            style={acceptInvitaionStyle.childRowViewRightItem}
                          >
                            <Icon
                              name="arrow-down"
                              style={{ fontSize: 18, color: "#A9A9A9" }}
                            />
                          </View>
                        </View>
                      </View>
                      <View>
                        <View
                          style={[
                            acceptInvitaionStyle.unSelectText,
                            { marginTop: 10 }
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
                                    acceptInvitaionStyle.childRowView,
                                    acceptInvitaionStyle.borderBottom,
                                    reason_item.id == selectedId
                                      ? { backgroundColor: "#E7E7E7" }
                                      : {}
                                  ]}
                                >
                                  <View
                                    style={
                                      acceptInvitaionStyle.childRowViewLeftItem
                                    }
                                  >
                                    <Text>



                                      {Language[this.state.selectedLanguage]['circle_join_reason_list'][reason_item.reason_alias]}


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
                  <View style={acceptInvitaionStyle.otherResonView}>
                    {this.state.reasonId == 9 ? (
                      <View>
                        <Text style={{ fontSize: 20 }}>{Language[this.state.selectedLanguage]['accept_invitation_screen']['other_reason']}:</Text>
                        <View style={{ marginTop: 10 }}>
                          <TextInput
                            style={acceptInvitaionStyle.textInput}
                            multiline={true}
                            onChangeText={otherReason =>
                              this.setState({ otherReason })
                            }
                          />
                        </View>
                      </View>
                    ) : null}

                    <View style={acceptInvitaionStyle.paymentButtonView}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("bankDetailsPage", {
                            result: this.state.details,
                            reason_id: selectedId,
                            other_reason: this.state.otherReason,
                            navigate_from: "accept_screen"
                          })
                        }
                        disabled={
                          selectedId == 9 && this.state.otherReason == ""
                            ? true
                            : false
                        }
                        style={[
                          selectedId == 9 && this.state.otherReason == ""
                            ? { opacity: 0.8 }
                            : {},
                          acceptInvitaionStyle.paymentButton
                        ]}
                      >
                        <Text style={acceptInvitaionStyle.paymentText}>
                          {Language[this.state.selectedLanguage]['bank_details_screen']['pay_deposit']}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          )}
      </ScrollView>

    );
  }
}
