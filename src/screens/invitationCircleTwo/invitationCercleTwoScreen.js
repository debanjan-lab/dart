import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {ToastMessage} from '../../components/ToastMessage';
import invitationCercleTwoStyle from './invitationCercleTwoStyle';
import HeaderCurve from '../includes/headercurve';
import URL from '../../config/url';
import AsyncStorage from '@react-native-community/async-storage';
import CommonService from '../../services/common/commonService';
import httpService from '../../services/http/httpService';
var moment = require('moment');
import {ErrorTemplate} from '../../components/error/errorComponent';
let flag = false;
var buttons = false;
import axios from 'axios';
import Language from '../../translations/index';

import API from '../../config/url';

const API_URL = API.base_url;
export default class InvitationCercleTwoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rememberToken: '',
      cicle_code: '',
      first_name: '',
      avatar_location: '',
      user_id: '',
      errorText: '',
      subMessage: '',
      details: Object.create(null),
      apiExecute: false,
      visiblityButton: true,
      btnLoader: false,
      selectedLanguage: 'en',
    };
  }

  componentDidMount() {
    this.checkWaitingCircle();
    this._bootstrapAsync();
  }

  checkWaitingCircle = () => {
    const item = this.state.details;
    if (item.start_date !== undefined && !flag) {
      flag = true;
      let oldDate = CommonService.allInOneFormatDate(
        item.start_date,
        '/',
        '-',
        'reverse',
      );
      let CurrentDate = new Date();
      oldDate = new Date(oldDate);
      let formatdate = moment(oldDate).format('llll');
      if (CurrentDate > formatdate) {
        console.log('false');
        buttons = true;
        this.setState({visiblityButton: false});
      } else {
        this.setState({visiblityButton: true});
        console.log('true');
        buttons = false;
      }
    }
  };

  _bootstrapAsync = async () => {
    let selectedDetails = this.props.navigation.getParam('result');
    AsyncStorage.multiGet([
      'rememberToken',
      'circle_code',
      'first_name',
      'avatar_location',
      'user_id',
    ]).then((response) => {
      this.setState(
        {
          rememberToken: response[0][1],
          cicle_code: response[1][1],
          first_name: response[2][1],
          avatar_location: {
            uri: URL.public_url + 'storage/' + response[3][1],
          },
          user_id: response[4][1],
          details: selectedDetails,
          selectedLanguage: 'fr',
        },
        () => {
          this.getCircleDetailsByCirlceCode(
            selectedDetails.circle_code,
            response[0][1],
          );
        },
      );
    });
  };

  /**
   * @param {Strting} circleCode
   * @param {String} token
   */
  getCircleDetailsByCirlceCode(circleCode, token) {
    let payload = {
      url: 'ongoing-circle-details',
      data: {
        circle_code: circleCode,
      },
      authtoken: token,
    };

    httpService
      .postHttpCall(payload)
      .then((res) => {
        if (res.status !== undefined) {
          if (res.status == 100) {
            let details = res.result;
            if (details.status == 0) {
              this.setState({details: details});
            } else {
              this.setState({
                errorText: httpService.appMessege.circle_not_found,
                subMessage: httpService.appMessege.circle_sub_msg,
              });
            }
          } else {
            this.setState({
              errorText: res.message
                ? Language[this.state.selectedLanguage]['status'][res.message]
                : '',
            });
          }
        } else {
          this.setState({
            errorText: httpService.appMessege.unknown_error,
            subMessage: httpService.appMessege.working_progress,
          });
        }
        this.setState({apiExecute: true});
      })
      .catch((err) => {
        this.setState({
          errorText: err.message
            ? Language[this.state.selectedLanguage]['status'][err.message]
            : '',
          apiExecute: true,
        });
        if (err.status == 4) {
          this.setState({subMessage: httpService.appMessege.internet_sub});
        }
      });
  }

  whatsppIconEnable(mobile_no_one, mobile_no_two) {
    let mob_one = mobile_no_one.toString();
    let mob_two = mobile_no_two.toString();
    return mob_one == mob_two ? true : false;
  }

  onError(error) {
    this.setState({
      avatar_location: require('../../../assets/images/contact.png'),
    });
  }

  onSendReminder = () => {
    const {details, rememberToken} = this.state;
    this.setState({btnLoader: true});
    if (details.circle_code && rememberToken) {
      let obj = {
        circle_code: details.circle_code,
        user_type: 1, //1->admin, 2->user
        screen: 1, //1->waiting, 2->block
      };
      axios
        .post(API_URL + 'send-reminder', JSON.stringify(obj), {
          headers: {
            Authorization: 'Bearer ' + rememberToken,
          },
        })
        .then((res) => {
          this.setState({btnLoader: false});
          ToastMessage(
            Language[this.state.selectedLanguage]['status'][res.data.message],
          );

          this.props.navigation.navigate('dashboardPage');
        })
        .catch((err) => {
          this.setState({btnLoader: false});
          //alert(err.message)

          ToastMessage(
            Language[this.state.selectedLanguage]['status'][err.message],
          );
        });
    } else {
      this.setState({btnLoader: false});
    }
  };

  render() {
    const item = this.state.details;
    // if(item.start_date !== undefined && !flag){
    // 	flag = true;
    // 	let oldDate = CommonService.allInOneFormatDate(item.start_date,'/','-','reverse');
    // 	let CurrentDate = new Date();
    // 	oldDate = new Date(oldDate);
    // 	let formatdate = moment(oldDate).format('llll');
    // 	if(CurrentDate > formatdate){
    // 		buttons = true;
    // 		this.setState({visiblityButton:false})
    // 	}else{
    // 		this.setState({visiblityButton:true})
    // 		buttons = false;
    // 	}
    // }

    console.log('item', item);
    return (
      <View style={{backgroundColor: '#fff', flex: 1}}>
        <HeaderCurve
          navigation={this.props.navigation}
          avatar_location={this.state.avatar_location}
          backButton={true}
          first_name={this.state.first_name}
          admin={item.is_admin}
          bellIcon={false}
          props={this.props}
        />
        <StatusBar backgroundColor="#1CCBE6" />
        <ScrollView
          contentContainerStyle={{backgroundColor: '#fff', flexGrow: 1}}>
          {this.state.errorText != '' ? (
            <View style={{alignItems: 'center', marginTop: '50%'}}>
              <ErrorTemplate
                message={this.state.errorText}
                subMessage={this.state.subMessage}
              />
            </View>
          ) : (
            <View style={invitationCercleTwoStyle.mainContent}>
              {this.state.apiExecute ? (
                <View>
                  <View style={invitationCercleTwoStyle.headerText}>
                    <Text style={invitationCercleTwoStyle.title}>
                      {item.is_rejected
                        ? Language[this.state.selectedLanguage]['common'][
                            'circle_refused'
                          ]
                        : Language[this.state.selectedLanguage]['common'][
                            'circle_waiting'
                          ]}
                    </Text>
                    <Text>N° {item.circle_code}</Text>
                  </View>
                  <View style={{marginTop: 25}}>
                    <View style={invitationCercleTwoStyle.rowView}>
                      <View style={invitationCercleTwoStyle.rowViewLeftItem}>
                        <Text style={invitationCercleTwoStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              'dashboard_screen'
                            ]['circle_admin']
                          }
                          :
                        </Text>
                      </View>
                      <View
                        style={[
                          invitationCercleTwoStyle.rowViewRightItem,
                          {flexDirection: 'row'},
                        ]}>
                        <Text
                          style={[
                            invitationCercleTwoStyle.rowTextValue,
                            {marginRight: 10},
                          ]}>
                          {item.admin}
                        </Text>
                        {!this.whatsppIconEnable(
                          item.admin_mobile_code + item.admin_mobile,
                          item.login_user_mobile_code + item.login_user_mobile,
                        ) ? (
                          <TouchableOpacity
                            onPress={() =>
                              CommonService.openWhatsApp(
                                item.admin_mobile_code + item.admin_mobile,
                              )
                            }>
                            <Image
                              source={require('../../../assets/images/whatsapp.png')}
                              style={{
                                width: 20,
                                height: 20,
                              }}
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                    <View style={invitationCercleTwoStyle.rowView}>
                      <View style={invitationCercleTwoStyle.rowViewLeftItem}>
                        <Text style={invitationCercleTwoStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              'create_circle_screen'
                            ]['target_achieve']
                          }
                          :
                        </Text>
                      </View>
                      <View style={invitationCercleTwoStyle.rowViewRightItem}>
                        <Text style={invitationCercleTwoStyle.rowTextValue}>
                          €{item.target_achive}
                        </Text>
                      </View>
                    </View>
                    <View style={invitationCercleTwoStyle.rowView}>
                      <View style={invitationCercleTwoStyle.rowViewLeftItem}>
                        <Text style={invitationCercleTwoStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              'create_circle_screen'
                            ]['round_settlement']
                          }
                          :
                        </Text>
                      </View>
                      <View style={invitationCercleTwoStyle.rowViewRightItem}>
                        <Text style={invitationCercleTwoStyle.rowTextValue}>
                          €{item.round_set}
                        </Text>
                      </View>
                    </View>
                    <View style={invitationCercleTwoStyle.rowView}>
                      <View style={invitationCercleTwoStyle.rowViewLeftItem}>
                        <Text style={invitationCercleTwoStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              'create_circle_screen'
                            ]['periodicity_of_round']
                          }
                          :
                        </Text>
                      </View>
                      <View style={invitationCercleTwoStyle.rowViewRightItem}>
                        <Text style={invitationCercleTwoStyle.rowTextValue}>
                          {
                            Language[this.state.selectedLanguage][
                              'create_circle_screen'
                            ][item.p_round]
                          }
                        </Text>
                      </View>
                    </View>
                    <View style={invitationCercleTwoStyle.rowView}>
                      <View style={invitationCercleTwoStyle.thPadding}>
                        <Text style={invitationCercleTwoStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              'create_circle_screen'
                            ]['reason']
                          }
                          :
                        </Text>
                        <Text style={invitationCercleTwoStyle.rowTextValue}>
                          {item.reason_for_circle}
                        </Text>
                      </View>
                    </View>
                    <View style={invitationCercleTwoStyle.rowView}>
                      <View style={invitationCercleTwoStyle.rowViewLeftItem}>
                        <Text style={invitationCercleTwoStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              'create_circle_screen'
                            ]['start_date']
                          }
                          :
                        </Text>
                      </View>
                      <View style={invitationCercleTwoStyle.rowViewRightItem}>
                        <Text style={invitationCercleTwoStyle.rowTextValue}>
                          {CommonService.formatDate(item.start_date)}
                        </Text>
                      </View>
                    </View>
                    <View style={{paddingTop: 20}}>
                      <Text style={invitationCercleTwoStyle.rowText}>
                        {
                          Language[this.state.selectedLanguage][
                            'circle_preview_screen'
                          ]['circle_participants']
                        }
                        :
                      </Text>
                      <View
                        style={[
                          invitationCercleTwoStyle.rowViewNew,
                          {paddingBottom: 20},
                        ]}>
                        {item.circleUsers !== undefined
                          ? item.circleUsers.map((user_item, user_index) => {
                              return (
                                <View
                                  key={user_index}
                                  style={{flexDirection: 'row'}}>
                                  <View
                                    style={
                                      invitationCercleTwoStyle.nextRowViewLeftItem
                                    }>
                                    <Text
                                      style={
                                        invitationCercleTwoStyle.rowTextValue
                                      }>
                                      {user_index + 1}.{user_item.username} (
                                      {user_item.mobile_country_code}
                                      {user_item.mobile_number})
                                    </Text>
                                  </View>
                                  <View
                                    style={
                                      invitationCercleTwoStyle.rowViewMiddleItem
                                    }>
                                    {user_item.accept_status == 1 ? (
                                      <Image
                                        source={require('../../../assets/images/success.png')}
                                        style={{
                                          width: 15,
                                          height: 15,
                                        }}
                                      />
                                    ) : null}

                                    {user_item.accept_status == 3 ? (
                                      <Image
                                        source={require('../../../assets/images/clock.png')}
                                        style={{
                                          width: 20,
                                          height: 20,
                                        }}
                                      />
                                    ) : null}
                                  </View>
                                  <View
                                    style={
                                      invitationCercleTwoStyle.nextRowViewRightItem
                                    }>
                                    {!this.whatsppIconEnable(
                                      user_item.mobile_number,
                                      item.login_user_mobile,
                                    ) ? (
                                      <TouchableOpacity
                                        onPress={() =>
                                          CommonService.openWhatsApp(
                                            user_item.mobile_country_code,
                                            user_item.mobile_number,
                                          )
                                        }>
                                        <Image
                                          source={require('../../../assets/images/whatsapp.png')}
                                          style={{
                                            width: 20,
                                            height: 20,
                                          }}
                                        />
                                      </TouchableOpacity>
                                    ) : null}
                                  </View>
                                </View>
                              );
                            })
                          : null}
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <View style={invitationCercleTwoStyle.rowViewLeftItem}>
                        <Text style={invitationCercleTwoStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              'dashboard_screen'
                            ]['expected_payment_recieved']
                          }
                          :
                        </Text>
                      </View>
                      <View style={invitationCercleTwoStyle.rowViewRightItem}>
                        <Text style={invitationCercleTwoStyle.rowTextValue}>
                          {item.expected_payable_date}
                        </Text>
                      </View>
                    </View>
                    <View style={invitationCercleTwoStyle.rowView}>
                      <View style={invitationCercleTwoStyle.rowViewLeftItem}>
                        <Text style={invitationCercleTwoStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              'circle_preview_screen'
                            ]['num_round']
                          }
                          :
                        </Text>
                      </View>
                      <View style={invitationCercleTwoStyle.rowViewRightItem}>
                        <Text style={invitationCercleTwoStyle.rowTextValue}>
                          {item.estimate_round}
                        </Text>
                      </View>
                    </View>
                    <View style={invitationCercleTwoStyle.rowView}>
                      <View style={invitationCercleTwoStyle.rowViewLeftItem}>
                        <Text style={invitationCercleTwoStyle.rowText}>
                          {
                            Language[this.state.selectedLanguage][
                              'circle_preview_screen'
                            ]['end_date']
                          }
                          :
                        </Text>
                      </View>
                      <View style={invitationCercleTwoStyle.rowViewRightItem}>
                        <Text style={invitationCercleTwoStyle.rowTextValue}>
                          {CommonService.formatDate(item.end_date)}
                        </Text>
                      </View>
                    </View>

                    {item.is_rejected ? null : this.state.visiblityButton ? (
                      <View>
                        {item.request_accept_status == 0 ? (
                          <View>
                            {item.is_admin == 1 ? (
                              <View
                                style={
                                  invitationCercleTwoStyle.paymentButtonView
                                }>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      'bankDetailsPage',
                                      {
                                        result: this.state.details,
                                        reason_id: '',
                                        other_reason: '',
                                        navigate_from: 'accept_screen',
                                      },
                                    )
                                  }
                                  style={[
                                    invitationCercleTwoStyle.paymentButton,
                                  ]}>
                                  <Text
                                    style={
                                      invitationCercleTwoStyle.paymentText
                                    }>
                                    {
                                      Language[this.state.selectedLanguage][
                                        'bank_details_screen'
                                      ]['pay_deposit']
                                    }
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <View style={invitationCercleTwoStyle.buttonView}>
                                <TouchableOpacity
                                  style={invitationCercleTwoStyle.rejectButton}
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      'refusalPage',
                                      {result: item},
                                    )
                                  }>
                                  <Text
                                    style={invitationCercleTwoStyle.buttonText}>
                                    {
                                      Language[this.state.selectedLanguage][
                                        'common'
                                      ]['reject']
                                    }
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={invitationCercleTwoStyle.joinButton}
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      'acceptInvitaionPage',
                                      {result: item},
                                    )
                                  }>
                                  <Text
                                    style={invitationCercleTwoStyle.buttonText}>
                                    {
                                      Language[this.state.selectedLanguage][
                                        'common'
                                      ]['join']
                                    }
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        ) : item.is_admin == 1 && item.status == 0 ? (
                          <View style={invitationCercleTwoStyle.sendButtonView}>
                            <TouchableOpacity
                              style={invitationCercleTwoStyle.sendButton}
                              onPress={() => this.onSendReminder()}>
                              <Text
                                style={invitationCercleTwoStyle.sendButtonText}>
                                {
                                  Language[this.state.selectedLanguage][
                                    'invitation_circle_screen'
                                  ]['send_reminder']
                                }
                              </Text>
                              {this.state.btnLoader ? (
                                <View style={{marginLeft: 10}}>
                                  <ActivityIndicator
                                    size="small"
                                    color={'#FFFFFF'}
                                  />
                                </View>
                              ) : null}
                            </TouchableOpacity>
                          </View>
                        ) : item.request_accept_status == 3 ? (
                          <Text>
                            {
                              Language[this.state.selectedLanguage][
                                'invitation_circle_screen'
                              ]['note']
                            }
                          </Text>
                        ) : null}
                      </View>
                    ) : null}
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
