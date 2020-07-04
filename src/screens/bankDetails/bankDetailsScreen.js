import React, { Component } from "react";
import { View, Text, TouchableOpacity, Picker } from "react-native";
import { Container, Content, Icon } from "native-base";
import bankDetailsStyle from "./bankDetailsStyle";
import moment from "moment";
import URL from "../../config/url";
const ApiConfig = URL;
import AsyncStorage from "@react-native-community/async-storage";
import HeaderCurve from "../includes/headercurve";
import CommonService from "../../services/common/commonService";
import httpService from "../../services/http/httpService";
import Loading from "react-native-loader-overlay";
import { ErrorTemplate } from "../../components/error/errorComponent";
import OnlinePaymentModal from "../../components/onlinePayment/onlinePayment";

let selectedId = 1;
import CreateCircle from "../../components/createCircle";
import Language from "../../translations/index";
export default class BankDetailsScreen extends Component {
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
      bankDetails: [],
      optionId: 1,
      optionTxt: "",
      reasonId: "",
      otherReason: "",
      errPaymentMsg: "",
      navigateFrom: "",
      randamCircleNum: "",
      selectedLanguage: "en",
      paymentTypes: [],
    };
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    let selectedDetails = this.props.navigation.getParam("result");

    console.log("selectedDetails===" + JSON.stringify(selectedDetails));
    AsyncStorage.multiGet([
      "rememberToken",
      "circle_code",
      "first_name",
      "avatar_location",
      "user_id",
      "mobile_country_code",
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
          reasonId: this.props.navigation.getParam("reason_id"),
          otherReason: this.props.navigation.getParam("other_reason"),
          navigateFrom: this.props.navigation.getParam("navigate_from"),
          mobile_country_code: response[5][1],
          selectedLanguage: "fr",
        },
        () => {
          this.setState({});
          this.getBankDetails();
          this.setState({
            paymentTypes: [
              Language[this.state.selectedLanguage]["bank_details_screen"][
                "offline"
              ],
              Language[this.state.selectedLanguage]["bank_details_screen"][
                "online"
              ],
            ],
            randamCircleNum:
              Language[this.state.selectedLanguage]["bank_details_screen"][
                "payment_circle"
              ] +
              " - " +
              Math.floor(Math.random() * 1000000) +
              1,
          });
        }
      );
    });
  };

  getBankDetails() {
    this.loading = Loading.show(CommonService.loaderObj);
    let payload = {
      url: "get-bank-details",
    };

    httpService
      .getHttpCall(payload)
      .then((res) => {
        Loading.hide(this.loading);
        if (res.status !== undefined) {
          if (res.status == 100) {
            this.setState({ bankDetails: res.result });
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

  selectOption(id, txt) {
    selectedId = id + 1;
    //alert(selectedId)

    this.setState({ optionId: selectedId, optionTxt: txt, errPaymentMsg: "" });
  }

  doPaymentDeposit() {
    let item = this.state.details;
    item["mobile_country_code"] = this.state.mobile_country_code;
    this.loading = Loading.show(CommonService.loaderObj);
    let payload = {
      url: "circle-request-accept",
      data: {
        circle_code: item.circle_code,
        trn_id: Math.floor(Math.random() * 44544324),
        trn_status: selectedId == 1 ? "3" : 1,
        amount: item.round_set,
        payment_date: CommonService.getDate(),
        login_mobile_number: item.login_user_mobile,
        join_status: selectedId == 1 ? "3" : 1,
        reason_id: this.state.reasonId,
        other_reason: this.state.otherReason,
        payment_mode: selectedId,
        payment_reason: this.state.randamCircleNum,
        circle_user_id: item.circle_user_id,
      },
      authtoken: this.state.rememberToken,
    };
    httpService
      .postHttpCall(payload)
      .then((res) => {
        Loading.hide(this.loading);
        if (res.status !== undefined) {
          if (res.status == 100) {
            if (
              payload.data.circle_user_id !== undefined ||
              payload.data.circle_user_id === 1
            ) {
              CreateCircle.create(
                item,
                this.state.rememberToken,
                this.props.navigation
              );
            } else {
              CommonService.showConfirmAlert(
                res.message
                  ? Language[this.state.selectedLanguage]["status"][res.message]
                  : "",
                (response) => {
                  if (response) {
                    this.props.navigation.navigate("dashboardPage");
                  }
                }
              );
            }
          } else {
            this.setState({
              errPaymentMsg: res.message
                ? Language[this.state.selectedLanguage]["status"][res.message]
                : "",
            });
          }
        } else {
          this.setState({
            errPaymentMsg: httpService.appMessege.unknown_error,
          });
        }
      })
      .catch((err) => {
        Loading.hide(this.loading);
        this.setState({
          errPaymentMsg: err.message
            ? Language[this.state.selectedLanguage]["status"][err.message]
            : "",
        });
      });
  }

  doPaymentRound() {
    let item = this.state.details;
    this.loading = Loading.show(CommonService.loaderObj);
    let payload = {
      url: "circle-payment",
      data: {
        circle_code: item.circle_code,
        round_no: item.current_round,
        trn_id: Math.floor(Math.random() * 44544324),
        trn_status: selectedId == 1 ? "3" : 1,
        amount: item.round_set,
        payment_date: CommonService.getDate(),
        payment_mode: selectedId,
        payment_reason: this.state.randamCircleNum,
      },
      authtoken: this.state.rememberToken,
    };
    httpService
      .postHttpCall(payload)
      .then((res) => {
        Loading.hide(this.loading);
        if (res.status !== undefined) {
          if (res.status == 100) {
            CommonService.showConfirmAlert(
              res.message
                ? Language[this.state.selectedLanguage]["status"][res.message]
                : "",
              (response) => {
                if (response) {
                  this.props.navigation.navigate("dashboardPage");
                }
              }
            );
          } else {
            this.setState({
              errPaymentMsg: res.message
                ? Language[this.state.selectedLanguage]["status"][res.message]
                : "",
            });
          }
        } else {
          this.setState({
            errPaymentMsg: httpService.appMessege.unknown_error,
          });
        }
      })
      .catch((err) => {
        Loading.hide(this.loading);
        this.setState({
          errPaymentMsg: err.message
            ? Language[this.state.selectedLanguage]["status"][err.message]
            : "",
        });
      });
  }

  doPayMyRound() {
    let item = this.state.details;
    this.loading = Loading.show(CommonService.loaderObj);
    let payload = {
      url: "block-circle-payment",
      data: {
        circle_code: item.circle_code,
        round_no: item.current_round,
        trn_id: Math.floor(Math.random() * 44544324),
        trn_status: selectedId == 1 ? "3" : 1,
        amount: item.round_set,
        payment_date: CommonService.getDate(),
        payment_mode: selectedId,
        payment_reason: this.state.randamCircleNum,
      },
      authtoken: this.state.rememberToken,
    };
    httpService
      .postHttpCall(payload)
      .then((res) => {
        Loading.hide(this.loading);
        if (res.status !== undefined) {
          if (res.status == 100) {
            CommonService.showConfirmAlert(
              res.message
                ? Language[this.state.selectedLanguage]["status"][res.message]
                : "",
              (response) => {
                if (response) {
                  this.props.navigation.navigate("dashboardPage");
                }
              }
            );
          } else {
            this.setState({
              errPaymentMsg: res.message
                ? Language[this.state.selectedLanguage]["status"][res.message]
                : "",
            });
          }
        } else {
          this.setState({
            errPaymentMsg: httpService.appMessege.unknown_error,
          });
        }
      })
      .catch((err) => {
        Loading.hide(this.loading);
        this.setState({
          errPaymentMsg: err.message
            ? Language[this.state.selectedLanguage]["status"][err.message]
            : "",
        });
      });
  }

  doPayMySuspend = () => {
    let item = this.state.details;
    this.loading = Loading.show(CommonService.loaderObj);
    let payload = {
      url: "circle-refund-payment",
      data: {
        circle_code: item.circle_code,
        trn_id: Math.floor(Math.random() * 44544324),
        trn_status: 3,
        amount: item.refund_amount,
        payment_date: moment(new Date()).format("DD/MM/YYYY"),
        payment_mode: 1,
        payment_reason: this.state.randamCircleNum,
      },
      authtoken: this.state.rememberToken,
    };
    httpService
      .postHttpCall(payload)
      .then((res) => {
        Loading.hide(this.loading);
        if (res.status !== undefined) {
          if (res.status == 100) {
            CommonService.showConfirmAlert(
              res.message
                ? Language[this.state.selectedLanguage]["status"][res.message]
                : "",
              (response) => {
                if (response) {
                  this.props.navigation.navigate("dashboardPage");
                }
              }
            );
          } else {
            this.setState({
              errPaymentMsg: res.message
                ? Language[this.state.selectedLanguage]["status"][res.message]
                : "",
            });
          }
        } else {
          this.setState({
            errPaymentMsg: httpService.appMessege.unknown_error,
          });
        }
      })
      .catch((err) => {
        Loading.hide(this.loading);
        this.setState({
          errPaymentMsg: err.message
            ? Language[this.state.selectedLanguage]["status"][err.message]
            : "",
        });
      });
  };

  onError(error) {
    this.setState({
      avatar_location: require("../../../assets/images/contact.png"),
    });
  }

  render() {
    const item = this.state.details;

    const paymentType = this.state.paymentTypes.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    return (
      <Container>
        <Content>
          <HeaderCurve
            navigation={this.props.navigation}
            avatar_location={this.state.avatar_location}
            backButton={true}
            first_name={this.state.first_name}
            admin={item.is_admin}
            bellIcon={true}
          />

          {this.state.errorText != "" ? (
            <View style={{ alignItems: "center" }}>
              <ErrorTemplate
                message={this.state.errorText}
                subMessage={this.state.subMessage}
              />
            </View>
          ) : (
            <View style={bankDetailsStyle.mainContent}>
              {this.state.apiExecute ? (
                <View>
                  <View style={bankDetailsStyle.headerText}>
                    <Text style={bankDetailsStyle.title}>
                      {
                        Language[this.state.selectedLanguage][
                          "bank_details_screen"
                        ]["bank_details"]
                      }
                    </Text>
                  </View>
                  <View style={bankDetailsStyle.headerText}>
                    <Text>
                      {
                        Language[this.state.selectedLanguage][
                          "dashboard_screen"
                        ]["circle"]
                      }{" "}
                      ({item.circle_code})
                    </Text>
                  </View>
                  <View style={bankDetailsStyle.rowView}>
                    <View style={[bankDetailsStyle.rowViewLeftItem]}>
                      <Text style={{ fontSize: 14 }}>
                        {
                          Language[this.state.selectedLanguage][
                            "bank_details_screen"
                          ]["payment_mode"]
                        }
                        :
                      </Text>
                    </View>
                    <View style={[bankDetailsStyle.rowViewRightItem]}>
                      <View>
                        <View style={bankDetailsStyle.unSelectText}>
                          <Picker
                            selectedValue={this.state.optionTxt}
                            style={{ height: 50, width: "100%", marginLeft: 5 }}
                            onValueChange={(type, index) => {
                              this.selectOption(index, type);
                            }}
                          >
                            {paymentType}
                          </Picker>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={bankDetailsStyle.otherResonView}>
                    {this.state.optionId === 1 ? (
                      <View>
                        <Text>
                          {" "}
                          {
                            Language[this.state.selectedLanguage]["common"][
                              "details"
                            ]
                          }
                        </Text>
                        <View
                          style={[
                            bankDetailsStyle.rowView,
                            { alignItems: "center" },
                          ]}
                        >
                          <View style={bankDetailsStyle.rowViewLeftItem}>
                            <Text style={bankDetailsStyle.rowText}>
                              {
                                Language[this.state.selectedLanguage][
                                  "bank_details_screen"
                                ]["account_number"]
                              }
                              :
                            </Text>
                          </View>
                          <View style={bankDetailsStyle.rowViewRightItem}>
                            <Text style={bankDetailsStyle.rowTextValue}>
                              {this.state.bankDetails[0].value}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            bankDetailsStyle.rowView,
                            { alignItems: "center" },
                          ]}
                        >
                          <View style={[bankDetailsStyle.rowViewLeftItem]}>
                            <Text style={bankDetailsStyle.rowText}>
                              {
                                Language[this.state.selectedLanguage][
                                  "bank_details_screen"
                                ]["payment_reason"]
                              }
                              :
                            </Text>
                          </View>
                          <View style={bankDetailsStyle.rowViewRightItem}>
                            <Text style={bankDetailsStyle.rowTextValue}>
                              {this.state.randamCircleNum}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            bankDetailsStyle.rowView,
                            { alignItems: "center" },
                          ]}
                        >
                          <View style={bankDetailsStyle.rowViewLeftItem}>
                            <Text style={bankDetailsStyle.rowText}>
                              {
                                Language[this.state.selectedLanguage][
                                  "bank_details_screen"
                                ]["bank_address"]
                              }
                              :
                            </Text>
                          </View>
                          <View style={bankDetailsStyle.rowViewRightItem}>
                            <Text style={bankDetailsStyle.rowTextValue}>
                              {this.state.bankDetails[2].value}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            bankDetailsStyle.rowView,
                            { alignItems: "center" },
                          ]}
                        >
                          <View style={bankDetailsStyle.rowViewLeftItem}>
                            <Text style={bankDetailsStyle.rowText}>
                              {
                                Language[this.state.selectedLanguage][
                                  "bank_details_screen"
                                ]["ifsc_code"]
                              }
                              :
                            </Text>
                          </View>
                          <View style={bankDetailsStyle.rowViewRightItem}>
                            <Text style={bankDetailsStyle.rowTextValue}>
                              {this.state.bankDetails[3].value}
                            </Text>
                          </View>
                        </View>

                        {this.state.navigateFrom == "accept_screen" ? (
                          <TouchableOpacity
                            onPress={() => this.doPaymentDeposit()}
                            disabled={selectedId == 2 ? true : false}
                            style={[
                              selectedId == 2 ? { opacity: 0.8 } : {},
                              bankDetailsStyle.paymentButton,
                            ]}
                          >
                            <Text style={bankDetailsStyle.paymentText}>
                              {" "}
                              {
                                Language[this.state.selectedLanguage][
                                  "bank_details_screen"
                                ]["pay_deposit"]
                              }
                            </Text>
                          </TouchableOpacity>
                        ) : this.state.navigateFrom == "on_going_details" ? (
                          <TouchableOpacity
                            onPress={() => this.doPaymentRound()}
                            disabled={selectedId == 2 ? true : false}
                            style={[
                              selectedId == 2 ? { opacity: 0.8 } : {},
                              bankDetailsStyle.paymentButton,
                            ]}
                          >
                            <Text style={bankDetailsStyle.paymentText}>
                              {
                                Language[this.state.selectedLanguage][
                                  "bank_details_screen"
                                ]["pay_your_round"]
                              }
                            </Text>
                          </TouchableOpacity>
                        ) : this.state.navigateFrom == "block_details" ? (
                          <TouchableOpacity
                            onPress={() => this.doPayMyRound()}
                            disabled={selectedId == 2 ? true : false}
                            style={[
                              selectedId == 2 ? { opacity: 0.8 } : {},
                              bankDetailsStyle.paymentButton,
                            ]}
                          >
                            <Text style={bankDetailsStyle.paymentText}>
                              {
                                Language[this.state.selectedLanguage][
                                  "bank_details_screen"
                                ]["pay_my_round"]
                              }
                            </Text>
                          </TouchableOpacity>
                        ) : this.state.navigateFrom === "suspend_details" ? (
                          <TouchableOpacity
                            onPress={() => this.doPayMySuspend()}
                            disabled={selectedId == 2 ? true : false}
                            style={[
                              selectedId == 2 ? { opacity: 0.8 } : {},
                              bankDetailsStyle.paymentButton,
                            ]}
                          >
                            <Text style={bankDetailsStyle.paymentText}>
                              {
                                Language[this.state.selectedLanguage][
                                  "bank_details_screen"
                                ]["suspend_pay"]
                              }
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    ) : (
                      <View>
                        {this.state.navigateFrom == "accept_screen" ? (
                          <OnlinePaymentModal
                            buttonText={
                              Language[this.state.selectedLanguage][
                                "bank_details_screen"
                              ]["pay_deposit"]
                            }
                            circle_code={this.state.details.circle_code}
                            amount={this.state.details.round_set}
                            mobileNo={this.state.details.login_user_mobile}
                            token={this.state.rememberToken}
                            navigation={this.props.navigation}
                            current_round={this.state.details.current_round}
                            item={item}
                          />
                        ) : this.state.navigateFrom == "on_going_details" ? (
                          <OnlinePaymentModal
                            buttonText={
                              Language[this.state.selectedLanguage][
                                "bank_details_screen"
                              ]["pay_your_round"]
                            }
                            circle_code={this.state.details.circle_code}
                            amount={this.state.details.round_set}
                            mobileNo={this.state.details.login_user_mobile}
                            token={this.state.rememberToken}
                            navigation={this.props.navigation}
                            current_round={this.state.details.current_round}
                          />
                        ) : this.state.navigateFrom == "block_details" ? (
                          <OnlinePaymentModal
                            buttonText={
                              Language[this.state.selectedLanguage][
                                "bank_details_screen"
                              ]["pay_my_round"]
                            }
                            circle_code={this.state.details.circle_code}
                            amount={this.state.details.round_set}
                            mobileNo={this.state.details.login_user_mobile}
                            token={this.state.rememberToken}
                            navigation={this.props.navigation}
                            current_round={this.state.details.current_round}
                          />
                        ) : this.state.navigateFrom === "suspend_details" ? (
                          <OnlinePaymentModal
                            buttonText={
                              Language[this.state.selectedLanguage][
                                "bank_details_screen"
                              ]["suspend_pay"]
                            }
                            circle_code={this.state.details.circle_code}
                            amount={item.refund_amount}
                            mobileNo={this.state.details.login_user_mobile}
                            token={this.state.rememberToken}
                            navigation={this.props.navigation}
                            //current_round = {this.state.details.current_round}
                          />
                        ) : null}
                      </View>
                    )}

                    <View style={bankDetailsStyle.paymentButtonView}>
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "red",
                            //fontFamily: 'Roboto-Reguler',
                            fontSize: 16,
                          }}
                        >
                          {this.state.errPaymentMsg}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          )}
        </Content>
      </Container>
    );
  }
}
