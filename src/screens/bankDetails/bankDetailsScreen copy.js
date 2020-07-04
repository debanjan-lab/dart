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

let selectedId = 0;
import CreateCircle from "../../components/createCircle";

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
      optionId: "",
      optionTxt: "",
      reasonId: "",
      otherReason: "",
      errPaymentMsg: "",
      navigateFrom: "",
      randamCircleNum: "",
    };
  }

  async componentDidMount() {
    selectedId = 0;
    this._bootstrapAsync();
    this.setState({
      randamCircleNum:
        "Payment circle - " + Math.floor(Math.random() * 1000000) + 1,
    });
  }

  _bootstrapAsync = async () => {
    let selectedDetails = this.props.navigation.getParam("result");
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
        },
        () => {
          this.getBankDetails();
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
        Loading.hide(this.loading);
        this.setState({ errorText: err.message, apiExecute: true });
        if (err.status == 4) {
          this.setState({ subMessage: httpService.appMessege.internet_sub });
        }
      });
  }

  selectOption(id, txt) {
    selectedId = id;
    this.setState({ optionId: id, optionTxt: txt });
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
              CommonService.showConfirmAlert(res.message, (response) => {
                if (response) {
                  this.props.navigation.navigate("dashboardPage");
                }
              });
            }
          } else {
            this.setState({ errPaymentMsg: res.message });
          }
        } else {
          this.setState({
            errPaymentMsg: httpService.appMessege.unknown_error,
          });
        }
      })
      .catch((err) => {
        Loading.hide(this.loading);
        this.setState({ errPaymentMsg: err.message });
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
            CommonService.showConfirmAlert(res.message, (response) => {
              if (response) {
                this.props.navigation.navigate("dashboardPage");
              }
            });
          } else {
            this.setState({ errPaymentMsg: res.message });
          }
        } else {
          this.setState({
            errPaymentMsg: httpService.appMessege.unknown_error,
          });
        }
      })
      .catch((err) => {
        Loading.hide(this.loading);
        this.setState({ errPaymentMsg: err.message });
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
            CommonService.showConfirmAlert(res.message, (response) => {
              if (response) {
                this.props.navigation.navigate("dashboardPage");
              }
            });
          } else {
            this.setState({ errPaymentMsg: res.message });
          }
        } else {
          this.setState({
            errPaymentMsg: httpService.appMessege.unknown_error,
          });
        }
      })
      .catch((err) => {
        Loading.hide(this.loading);
        this.setState({ errPaymentMsg: err.message });
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
            CommonService.showConfirmAlert(res.message, (response) => {
              if (response) {
                this.props.navigation.navigate("dashboardPage");
              }
            });
          } else {
            this.setState({ errPaymentMsg: res.message });
          }
        } else {
          this.setState({
            errPaymentMsg: httpService.appMessege.unknown_error,
          });
        }
      })
      .catch((err) => {
        Loading.hide(this.loading);
        this.setState({ errPaymentMsg: err.message });
      });
  };

  onError(error) {
    this.setState({
      avatar_location: require("../../../assets/images/contact.png"),
    });
  }

  render() {
    const item = this.state.details;
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
                    <Text style={bankDetailsStyle.title}>Bank Details</Text>
                  </View>
                  <View style={bankDetailsStyle.headerText}>
                    <Text>Circle({item.circle_code})</Text>
                  </View>
                  <View style={bankDetailsStyle.rowView}>
                    <View style={bankDetailsStyle.rowViewLeftItem}>
                      <Text style={{ fontSize: 18 }}>Payment mode:</Text>
                    </View>
                    <View style={bankDetailsStyle.rowViewRightItem}>
                      {/* <View style={bankDetailsStyle.selectText}>
											<View style={bankDetailsStyle.childRowView}>
												<View style={bankDetailsStyle.childRowViewLeftItem}>
													<Text numberOfLines={1}>{this.state.optionTxt}</Text>
												</View>
												<View style={bankDetailsStyle.childRowViewRightItem}>
													<Icon 
													name='arrow-down' 
													style={{ fontSize: 18,color:'#A9A9A9' }}
													/>
												</View>
											</View>
										</View> */}
                      <View>
                        <View style={bankDetailsStyle.unSelectText}>
                          {/* <TouchableOpacity onPress={()=>{this.selectOption(1,'Offline')}}>
													<View style={[bankDetailsStyle.childRowView,bankDetailsStyle.borderBottom,(selectedId == 1) ? {backgroundColor:'#E7E7E7'}:{}]}>
														<View style={bankDetailsStyle.childRowViewLeftItem}>
															<Text>Offline</Text>
														</View>
													</View>
												</TouchableOpacity>
												<TouchableOpacity onPress={()=>{this.selectOption(2,'Online')}}>
													<View style={[bankDetailsStyle.childRowView,bankDetailsStyle.borderBottom,(selectedId == 2) ? {backgroundColor:'#E7E7E7'}:{}]}>
														<View style={bankDetailsStyle.childRowViewLeftItem}>
															<Text>Online</Text>
														</View>
													</View>
												</TouchableOpacity> */}
                          <Picker
                            selectedValue={this.state.optionTxt}
                            style={{ height: 50, width: "100%", marginLeft: 5 }}
                            onValueChange={(type, index) => {
                              this.selectOption(
                                type === "Offline"
                                  ? 1
                                  : type === "Online"
                                  ? 2
                                  : null,
                                type
                              );
                            }}
                          >
                            <Picker.Item
                              label="Select payment type"
                              disabled={true}
                            />
                            <Picker.Item label="Offline" value="Offline" />
                            <Picker.Item label="Online" value="Online" />
                          </Picker>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={bankDetailsStyle.otherResonView}>
                    {selectedId === 1 ? (
                      <View>
                        <Text>Details</Text>
                        <View style={bankDetailsStyle.rowView}>
                          <View style={bankDetailsStyle.rowViewLeftItem}>
                            <Text style={bankDetailsStyle.rowText}>
                              Account No:
                            </Text>
                          </View>
                          <View style={bankDetailsStyle.rowViewRightItem}>
                            <Text style={bankDetailsStyle.rowTextValue}>
                              {this.state.bankDetails[0].value}
                            </Text>
                          </View>
                        </View>
                        <View style={bankDetailsStyle.rowView}>
                          <View style={bankDetailsStyle.rowViewLeftItem}>
                            <Text style={bankDetailsStyle.rowText}>
                              Payment Reason:
                            </Text>
                          </View>
                          <View style={bankDetailsStyle.rowViewRightItem}>
                            <Text style={bankDetailsStyle.rowTextValue}>
                              {this.state.randamCircleNum}
                            </Text>
                          </View>
                        </View>
                        <View style={bankDetailsStyle.rowView}>
                          <View style={bankDetailsStyle.rowViewLeftItem}>
                            <Text style={bankDetailsStyle.rowText}>
                              Bank Address:
                            </Text>
                          </View>
                          <View style={bankDetailsStyle.rowViewRightItem}>
                            <Text style={bankDetailsStyle.rowTextValue}>
                              {this.state.bankDetails[2].value}
                            </Text>
                          </View>
                        </View>
                        <View style={bankDetailsStyle.rowView}>
                          <View style={bankDetailsStyle.rowViewLeftItem}>
                            <Text style={bankDetailsStyle.rowText}>
                              IFSC Code:
                            </Text>
                          </View>
                          <View style={bankDetailsStyle.rowViewRightItem}>
                            <Text style={bankDetailsStyle.rowTextValue}>
                              {this.state.bankDetails[3].value}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ) : selectedId == 2 ? (
                      <View>
                        {this.state.navigateFrom == "accept_screen" ? (
                          <OnlinePaymentModal
                            buttonText={"Pay the Deposit"}
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
                            buttonText={"Pay your Round"}
                            circle_code={this.state.details.circle_code}
                            amount={this.state.details.round_set}
                            mobileNo={this.state.details.login_user_mobile}
                            token={this.state.rememberToken}
                            navigation={this.props.navigation}
                            current_round={this.state.details.current_round}
                          />
                        ) : this.state.navigateFrom == "block_details" ? (
                          <OnlinePaymentModal
                            buttonText={"Pay my Round"}
                            circle_code={this.state.details.circle_code}
                            amount={this.state.details.round_set}
                            mobileNo={this.state.details.login_user_mobile}
                            token={this.state.rememberToken}
                            navigation={this.props.navigation}
                            current_round={this.state.details.current_round}
                          />
                        ) : this.state.navigateFrom === "suspend_details" ? (
                          <OnlinePaymentModal
                            buttonText={"Suspend Pay"}
                            circle_code={this.state.details.circle_code}
                            amount={item.refund_amount}
                            mobileNo={this.state.details.login_user_mobile}
                            token={this.state.rememberToken}
                            navigation={this.props.navigation}
                            //current_round = {this.state.details.current_round}
                          />
                        ) : null}
                      </View>
                    ) : null}

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
                            fontSize: 16,
                          }}
                        >
                          {this.state.errPaymentMsg}
                        </Text>
                      </View>
                      {this.state.optionId === 1 ? (
                        this.state.navigateFrom == "accept_screen" ? (
                          <TouchableOpacity
                            onPress={() => this.doPaymentDeposit()}
                            disabled={selectedId == 2 ? true : false}
                            style={[
                              selectedId == 2 ? { opacity: 0.8 } : {},
                              bankDetailsStyle.paymentButton,
                            ]}
                          >
                            <Text style={bankDetailsStyle.paymentText}>
                              Pay the Deposit
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
                              Pay your Round
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
                              Pay my Round
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
                              Suspend Pay
                            </Text>
                          </TouchableOpacity>
                        ) : null
                      ) : null}
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
