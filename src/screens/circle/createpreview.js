import React, { Component } from 'react';
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
  Button,
  Picker,
  Alert,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

const statusBarBackgroundColor = '#1CCBE6';
const barStyle = 'light-content';
import HeaderCurve from '../includes/headercurve';
import axios from 'axios';
import URL from '../../config/url';
import commonService from '../../services/common/commonService';
const ApiConfig = URL;
let count = 0;
var moment = require('moment');
import Language from '../../translations/index';

export default class CreateCirclePreviewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      avatar_location: '',
      participants: [],
      loader: false,
      errorMessage: '',
      cicle_code: '',
      mobile_number: '',
      selectedLanguage: 'en',
    };
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    AsyncStorage.multiGet([
      'rememberToken',
      'circle_code',
      'first_name',
      'avatar_location',
      'mobile_number',
    ]).then((response) => {

      //alert(response[1][1])
      this.setState({
        rememberToken: response[0][1],
        cicle_code: response[1][1],
        first_name: response[2][1],
        avatar_location: {
          uri: ApiConfig.public_url + 'storage/' + response[3][1],
        },
        mobile_number: response[4][1],
        selectedLanguage: 'fr',
      }, () => {
        // alert("circle" + this.state.cicle_code)
      });
    });
  };
  onError(error) {
    this.setState({
      avatar_location: require('../../../assets/images/contact.png'),
    });
  }

  _doRedirectChangeOrder = () => {
    let participants = this.props.navigation.getParam('participants', {});
    this.props.navigation.navigate('changeOrderPage', {
      participants: participants,
    });
  };


  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  _doRedirectLanding = () => {
    this.props.navigation.goBack();
  };

  _doSubmitFinal = () => {
    console.log("cicle 1111=====", this.state.cicle_code)

    this.setState({
      errorMessage: '',
    });

    let start_date = this.props.navigation.getParam('start_date', '');
    let end_date = this.props.navigation.getParam('end_date', '');
    let unsafe_participants = this.props.navigation.getParam(
      'participants',
      {},
    );
    let month_range = Math.abs(
      moment(start_date, 'DD/MM/YYYY')
        .startOf('day')
        .diff(moment(end_date, 'DD/MM/YYYY').startOf('day'), 'months'),
    );

    if (month_range > 6) {
      this.setState({
        errorMessage:
          Language[this.state.selectedLanguage]['circle_preview_screen'][
          'circle_validation_hint1'
          ],
      });
    } else {



      console.log("cicle 222=====", this.state.cicle_code)



      let obj = {
        circle_user_id: 1,
        circle_code: this.state.cicle_code,
        admin: this.state.first_name,
        admin_mobile: this.state.mobile_number,
        login_user_mobile: this.state.mobile_number,
        target_achive: this.props.navigation.getParam('target_achive', '0'),
        round_set: this.props.navigation.getParam('round_set', '0'),
        p_round: this.props.navigation.getParam('p_round', '0'),
        start_date: this.props.navigation.getParam('start_date', '0'),
        reason_for_circle: this.props.navigation.getParam(
          'reason_for_circle',
          '0',
        ),
        unsafe_participants: this.props.navigation.getParam('participants'),
      };

      console.log('objjjj', obj);

      //return false;

      this.props.navigation.push('bankDetailsPage', {
        result: obj,
        reason_id: '',
        other_reason: '',
        navigate_from: 'accept_screen',
      });





    }
  };

  render() {
    const participants = this.props.navigation.getParam('participants', {});
    const joinParticipantList = participants.map(function (data, i) {
      return (
        <Text key={i} style={[styles.frmLabelRight, { marginTop: 5 }]}>
          {i + 1}. {data.username} ({data.mobile_country_code}
          {data.mobile_number})
        </Text>
      );
    });
    const target_achive = this.props.navigation.getParam('target_achive', '0');

    const round_set = this.props.navigation.getParam('round_set', '0');
    const p_round = this.props.navigation.getParam('p_round', '');
    const start_date = this.props.navigation.getParam('start_date', '');
    const reason_for_circle = this.props.navigation.getParam(
      'reason_for_circle',
      '',
    );

    const end_date = this.props.navigation.getParam('end_date', '');
    const estimate_round = this.props.navigation.getParam(
      'estimate_round',
      '0',
    );
    return (








      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={barStyle}
        />
        <HeaderCurve
          //title={"Welcome Dashboard"}
          navigation={this.props.navigation}
          avatar_location={this.state.avatar_location}
          backButton={true}
          first_name={this.state.first_name}
          bellIcon={false}
        />
        <ScrollView
          contentContainerStyle={{ backgroundColor: '#fff', flexGrow: 1 }}>
          <View
            style={{
              flex: 1,
              padding: 20,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.headingText}>
                {
                  Language[this.state.selectedLanguage][
                  'circle_preview_screen'
                  ]['create_circle_preview']
                }
              </Text>
            </View>

            <View style={styles.frmInputWrapper}>
              <Text style={styles.frmLabel}>
                {
                  Language[this.state.selectedLanguage][
                  'circle_preview_screen'
                  ]['target_achieve']
                }
                :
              </Text>
              <Text style={styles.frmLabelRight}>€{target_achive}</Text>
            </View>
            <View style={styles.frmInputWrapper}>
              <Text style={styles.frmLabel}>
                {
                  Language[this.state.selectedLanguage][
                  'circle_preview_screen'
                  ]['round_settlement']
                }
                :
              </Text>
              <Text style={styles.frmLabelRight}>€{round_set}</Text>
            </View>
            <View style={styles.frmInputWrapper}>
              <Text style={styles.frmLabel}>
                {
                  Language[this.state.selectedLanguage][
                  'circle_preview_screen'
                  ]['periodicity_round']
                }
                :
              </Text>
              <Text style={styles.frmLabelRight}>
                {
                  Language[this.state.selectedLanguage]['create_circle_screen'][
                  p_round
                  ]
                }
              </Text>
            </View>
            <View style={styles.frmInputWrapperColumn}>
              <Text style={styles.frmLabel}>
                {
                  Language[this.state.selectedLanguage][
                  'circle_preview_screen'
                  ]['personal_reason']
                }
                :
              </Text>
              <Text style={[styles.frmLabelRight, { marginTop: 5 }]}>
                {reason_for_circle}
              </Text>
            </View>
            <View style={styles.frmInputWrapper}>
              <Text style={styles.frmLabel}>
                {
                  Language[this.state.selectedLanguage][
                  'circle_preview_screen'
                  ]['wishing_start']
                }
                :
              </Text>
              <Text style={styles.frmLabelRight}>{start_date}</Text>
            </View>

            <View style={styles.frmInputWrapperMargin}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 5,

                  justifyContent: 'space-between',
                }}>
                <Text style={styles.frmLabel}>
                  {
                    Language[this.state.selectedLanguage][
                    'circle_preview_screen'
                    ]['circle_participants']
                  }
                  :
                </Text>

                <TouchableOpacity
                  onPress={() => this._doRedirectChangeOrder()}
                  style={styles.changeOrderButtonBlock}>
                  <Text style={styles.changeOrderButtonText}>
                    {
                      Language[this.state.selectedLanguage][
                      'circle_preview_screen'
                      ]['change_order']
                    }
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ padding: 10 }}>{joinParticipantList}</View>
            </View>

            <View style={styles.frmInputWrapper}>
              <Text style={styles.frmLabel}>
                {
                  Language[this.state.selectedLanguage][
                  'circle_preview_screen'
                  ]['num_round']
                }
                :
              </Text>
              <Text style={styles.frmLabelRight}>{estimate_round}</Text>
            </View>

            <View style={styles.frmInputWrapper}>
              <Text style={styles.frmLabel}>
                {
                  Language[this.state.selectedLanguage][
                  'circle_preview_screen'
                  ]['end_date']
                }
                :
              </Text>
              <Text style={styles.frmLabelRight}>{end_date}</Text>
            </View>

            {this.state.errorMessage ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    color: 'red',
                    fontSize: 16,
                  }}>
                  {this.state.errorMessage}
                </Text>
              </View>
            ) : null}

            <View style={styles.frmInputWrapper}>
              <TouchableOpacity
                style={styles.returnButtonBlock}
                onPress={() => this._doRedirectLanding()}>
                <Text style={styles.returnButtonText}>
                  {Language[this.state.selectedLanguage]['common']['return']}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.validateButtonBlock}
                onPress={() => this._doSubmitFinal()}
                disabled={this.state.loader}>
                <Text style={styles.validateButtonText}>
                  {
                    Language[this.state.selectedLanguage][
                    'circle_preview_screen'
                    ]['pay_deposit']
                  }
                </Text>

                {this.state.loader ? (
                  <View style={styles.loading}>
                    <ActivityIndicator size="small" color={'#FFFFFF'} />
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerBackBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },

  containerHeaderText: {
    color: '#FFFFFF',
    fontSize: 20,
    right: 10,
  },

  containerImageBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: height / 4,
    backgroundColor: '#C6F3F0',
  },

  forgotPasswordBlock: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  forgotPasswordText: {
    color: '#22e2ef',
    fontSize: 16,
  },

  inputTextStyleActive: {
    flex: 1,
    height: 25,
    borderBottomColor: '#1DC2E0',
    borderBottomWidth: 1,
    color: '#000000',
    fontSize: 18,
    paddingVertical: 0,
  },

  sendButtonBlock: {
    marginTop: 80,
    height: 50,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5AC6C6',
    elevation: 2,
    flexDirection: 'row',
  },

  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: hp('40%'),
  },
  headerMenu: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    top: hp('3%'),
  },
  headingBold: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headingLight: {
    color: '#FFFFFF',
    fontSize: hp('2.5%'),
    fontWeight: '200',
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  avatarImageWrapper: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eeeeee',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    top: 20,
  },
  frmInputWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frmInputWrapperMargin: {
    marginTop: 20,
    // flexDirection: "row",
    justifyContent: 'space-between',
    //alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#dcdcdc',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },

  frmInputWrapperColumn: {
    marginTop: 20,
    justifyContent: 'center',
  },
  headingText: {
    fontSize: 16,
    //paddingRight: 10,
    //paddingLeft: 10,
    color: '#000000',
  },
  frmLabel: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '400',
  },
  frmLabelRight: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  inputTextStyleInactive: {
    flex: 1,
    //height: 30,
    borderBottomColor: '#cecece',
    borderBottomWidth: 1,
    color: '#000000',
    fontSize: hp('2.5%'),
    paddingVertical: 0,
    // paddingLeft: 10,
    //paddingRight: 10,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  idScan: {
    marginTop: 10,
    height: 40,
    width: wp('40%'),
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5ac6c6',
    elevation: 2,
    flexDirection: 'row',
  },
  loading: {
    marginLeft: 10,
  },
  loadingCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputTextStyleRequired: {
    flex: 1,
    height: 25,
    borderBottomColor: 'red', // required
    borderBottomWidth: 1,
    color: '#000000',
    fontSize: 18,
    paddingVertical: 0,
  },
  avatarName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    top: 20,
  },
  notificationBadge: {
    bottom: 30,
    left: 15,
    height: 20,
    width: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    marginLeft: 5,
    borderRadius: 5,
    color: '#000000',
    fontSize: 18,
    paddingLeft: 5,
    paddingVertical: 0,
  },
  textAreaInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 5,
    color: '#000000',
    fontSize: 18,
    paddingLeft: 5,
    paddingVertical: 0,
  },
  changeOrderButtonBlock: {
    padding: 10,
    //height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5ac6c6',
    elevation: 2,
    //position: "absolute",
    // top: 5,
    right: 0,
  },
  changeOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  returnButtonBlock: {
    width: width / 2.5,
    marginTop: 20,
    height: 50,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#5AC6C6',
    borderWidth: 1,
    elevation: 2,
  },
  returnButtonText: {
    color: '#5AC6C6',
    fontSize: 14,
  },

  validateButtonBlock: {
    width: width / 2.5,
    marginTop: 20,
    height: 50,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5AC6C6',
    borderColor: '#5AC6C6',
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
  },
  validateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
