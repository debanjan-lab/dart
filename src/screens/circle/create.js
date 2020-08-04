import React, {Component} from 'react';
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
  Keyboard,
  Alert,
  BackHandler,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-community/picker';

import {ToastMessage} from '../../components/ToastMessage';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import DateTimePicker from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-community/async-storage';
import global from '../../services/global/globalService';
import {NavigationEvents} from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ModalSelector from 'react-native-modal-selector';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

import Language from '../../translations/index';

const statusBarBackgroundColor = '#1CCBE6';
const barStyle = 'light-content';
import HeaderCurve from '../includes/headercurve';

import axios from 'axios';
import URL from '../../config/url';
import CommonService from '../../services/common/commonService';
const ApiConfig = URL;

export default class CreateCircleScreen extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      mobile_number: '',
      avatar_location: '',
      target_amount: '',
      errorTargetAmount: false,
      round_settelment: '',
      errorRoundSettlement: false,
      start_date: '',
      errorStartDate: false,
      cicle_code: '',
      reason: '',
      periodicity: 'weekly',

      loader: false,
      errorMessage: '',
      successMessage: '',
      tempData: [],
      selectedLanguage: 'en',
      roundTypes: [],
    };
  }

  componentDidMount() {
    global.phone_data = null;
    global.perticipant_info = [];
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    AsyncStorage.multiGet([
      'rememberToken',
      'circle_code',
      'first_name',
      'avatar_location',
      'mobile_country_code',
      'mobile_number',
    ]).then((response) => {
      this.setState(
        {
          rememberToken: response[0][1],
          cicle_code: response[1][1],
          first_name: response[2][1],
          avatar_location: {
            uri: ApiConfig.public_url + 'storage/' + response[3][1],
          },
          mobile_country_code: response[4][1],
          mobile_number: response[5][1],
          selectedLanguage: 'fr',
        },
        () => {
          this.setState({
            roundTypes: [
              {
                option:
                  Language[this.state.selectedLanguage]['create_circle_screen'][
                    'weekly'
                  ],
                value: 'weekly',
              },
              {
                option:
                  Language[this.state.selectedLanguage]['create_circle_screen'][
                    'bi-weekly'
                  ],
                value: 'bi-weekly',
              },
              {
                option:
                  Language[this.state.selectedLanguage]['create_circle_screen'][
                    'every-10-days'
                  ],
                value: 'every-10-days',
              },
              {
                option:
                  Language[this.state.selectedLanguage]['create_circle_screen'][
                    'monthly'
                  ],
                value: 'monthly',
              },
            ],
          });
        },
      );
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
    console.log(date);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }
    var __date = day + '/' + month + '/' + year;

    // var date =
    //   ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year;

    this.setState({
      start_date: __date,
      isDateTimePickerVisible: false,
    });
  };

  convertToSlug(Text) {
    return Text.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  _doContinue = () => {
    //Keyboard.dismiss();
    this.setState({
      errorTargetAmount: false,
      errorRoundSettlement: false,
      errorStartDate: false,
      errorMessage: '',
      successMessage: '',
    });
    if (
      this.state.target_amount == '' ||
      this.state.round_settelment == '' ||
      this.state.start_date == ''
    ) {
      if (this.state.target_amount == '') {
        this.setState({
          errorTargetAmount: true,
          errorMessage: 'Above fields are required',
        });
      }

      if (this.state.round_settelment == '') {
        this.setState({
          errorRoundSettlement: true,
          errorMessage: 'Above fields are required',
        });
      }

      if (this.state.start_date == '') {
        this.setState({
          errorStartDate: true,
          errorMessage: 'Above fields are required',
        });
      }
      if (this.state.tempData.length <= 0) {
        this.setState({
          errorMessage:
            Language[this.state.selectedLanguage]['create_circle_screen'][
              'please_assign_user'
            ],
        });
      }
    } else {
      if (
        Number(this.state.round_settelment) >= Number(this.state.target_amount)
      ) {
        this.setState({
          errorMessage:
            Language[this.state.selectedLanguage]['create_circle_screen'][
              'target_amount_hint1'
            ],
        });
      }
      if (this.state.tempData.length <= 0) {
        this.setState({
          errorMessage:
            Language[this.state.selectedLanguage]['create_circle_screen'][
              'please_assign_user'
            ],
        });
      }
    }

    if (!this.state.errorMessage) {
      let obj = {
        circle_code: this.state.cicle_code,
        target_achive: this.state.target_amount,
        round_set: this.state.round_settelment,

        p_round: this.state.periodicity,

        start_date: this.state.start_date,
        reason_for_circle: this.state.reason,
      };

      console.log('obj', obj);

      this.setState({
        loader: true,
      });

      let that = this;

      axios
        .post(ApiConfig.base_url + 'circle-details', JSON.stringify(obj), {
          headers: {
            Authorization: 'Bearer ' + that.state.rememberToken,
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
                    ? Language[this.state.selectedLanguage]['status'][
                        response.data.message
                      ]
                    : '',
                });
              },
            );
          } else {
            that.setState(
              {
                success: true,
              },
              () => {
                if (response.data.exceed_amount > 0) {
                  let buttonObj = {
                    cancelTxt:
                      Language[this.state.selectedLanguage]['common']['no'],
                    submitTxt:
                      Language[this.state.selectedLanguage]['common']['yes'],
                    message:
                      Language[this.state.selectedLanguage][
                        'create_circle_screen'
                      ]['hin1'],
                    title: 'Please confirm',
                  };
                  CommonService.__showConfirmAlert(buttonObj, (res) => {
                    if (res) {
                      that.props.navigation.navigate('circlePreviewPage', {
                        target_achive: that.state.target_amount,
                        round_set: that.state.round_settelment,
                        p_round: that.state.periodicity,
                        start_date: that.state.start_date,
                        reason_for_circle: that.state.reason,
                        participants: response.data.result,
                        end_date: response.data.end_date,
                        estimate_round: response.data.estimate_round,
                      });
                    }
                  });
                } else {
                  that.props.navigation.navigate('circlePreviewPage', {
                    target_achive: that.state.target_amount,
                    round_set: that.state.round_settelment,
                    p_round: that.state.periodicity,
                    start_date: that.state.start_date,
                    reason_for_circle: that.state.reason,
                    participants: response.data.result,
                    end_date: response.data.end_date,
                    estimate_round: response.data.estimate_round,
                  });
                }
              },
            );
          }
        })
        .catch(function (error) {
          ToastMessage(error.response);
        })
        .finally(function () {
          that.setState({
            loader: false,
          });
        });

      // this.props.navigation.navigate('CreateCirclePreviewScreen');
    } else {
      ToastMessage(this.state.errorMessage);
    }
  };

  _doRedirectJoinPerticipants = () => {
    this.props.navigation.navigate('searchParticipantPage');
  };

  makeid(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  temporaryData() {
    this.setState({tempData: global.perticipant_info});
  }

  _doRedirectLanding = () => {
    if (
      this.state.tempData.length ||
      this.state.reason != '' ||
      this.state.target_amount != '' ||
      this.state.round_settelment != '' ||
      this.state.start_date != ''
    ) {
      Alert.alert(
        Language[this.state.selectedLanguage]['common']['confirmation'],
        Language[this.state.selectedLanguage]['common']['you_loose'],
        [
          {
            text: Language[this.state.selectedLanguage]['common']['no'],
          },
          {
            text: Language[this.state.selectedLanguage]['common']['ok'],
            onPress: () => this.props.navigation.goBack(),
          },
        ],
      );
      return true;
    } else {
      this.props.navigation.goBack();
    }
    return true;
  };

  onError(error) {
    this.setState({
      avatar_location: require('../../../assets/images/contact.png'),
    });
  }

  onDeleteContact = (index) => {
    let tempData = this.state.tempData;
    let contact = tempData[index];
    Alert.alert(
      Language[this.state.selectedLanguage]['delete_circle']['delete_request'],
      `${
        Language[this.state.selectedLanguage]['delete_circle'][
          'delete_request_alert'
        ]
      } ${contact.username}`,
      [
        {
          text: Language[this.state.selectedLanguage]['common']['cancel'],
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            let obj = {
              circle_code: this.state.cicle_code,
              mobile_number: contact.mobile,
            };
            let that = this;
            axios
              .post(
                ApiConfig.base_url + 'delete-circle-user',
                JSON.stringify(obj),
                {
                  headers: {
                    Authorization: 'Bearer ' + that.state.rememberToken,
                  },
                },
              )
              .then((res) => {
                if (res.data.status === 100) {
                  tempData.splice(index, 1);
                  global.contacts_data.splice(index, 1);
                  this.setState({
                    tempData,
                  });

                  ToastMessage(
                    Language[this.state.selectedLanguage]['status'][
                      res.data.message
                    ],
                  );
                } else {
                  ToastMessage(
                    Language[this.state.selectedLanguage]['status'][
                      res.data.message
                    ],
                  );
                }
              })
              .catch((err) => {});
          },
        },
      ],
      {cancelable: false},
    );
  };

  render() {
    const errorTargetAmount = this.state.errorTargetAmount
      ? styles.inputTextStyleRequired
      : styles.inputTextStyleActive;

    const errorRoundSettlement = this.state.errorRoundSettlement
      ? styles.inputTextStyleRequired
      : styles.inputTextStyleActive;

    const errorStartDate = this.state.errorStartDate
      ? styles.inputTextStyleRequired
      : styles.inputTextStyleActive;

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 10);

    const roundType = this.state.roundTypes.map((s, i) => {
      return <Picker.Item key={i} value={s.value} label={s.option} />;
    });

    return (
      <View style={{backgroundColor: '#fff', flex: 1}}>
        <NavigationEvents onWillFocus={() => this.temporaryData()} />
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={barStyle}
        />

        <HeaderCurve
          navigation={this.props.navigation}
          avatar_location={this.state.avatar_location}
          backButton={true}
          first_name={this.state.first_name}
          bellIcon={true}
          backAlert={
            this.state.tempData.length ||
            this.state.reason != '' ||
            this.state.target_amount != '' ||
            this.state.round_settelment != '' ||
            this.state.start_date != ''
              ? true
              : false
          }
        />
        <KeyboardAwareScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              flex: 1,
              padding: 20,
              // marginTop: 5
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.headingText}>
                {
                  Language[this.state.selectedLanguage]['create_circle_screen'][
                    'create_circle'
                  ]
                }
              </Text>
            </View>

            <View style={styles.frmInputWrapper}>
              <Text style={[styles.frmLabel, {width: width / 2}]}>
                {
                  Language[this.state.selectedLanguage]['create_circle_screen'][
                    'target_achieve'
                  ]
                }
              </Text>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.frmLabel}>€</Text>
              </View>
              <TextInput
                style={errorTargetAmount}
                onChangeText={(target_amount) => this.setState({target_amount})}
                value={this.state.target_amount}
                autoFocus={true}
                keyboardType="numeric"
                autoCapitalize="none"
                returnKeyType="next"
                //onSubmitEditing={() => this.sattelment.focus()}
              />
            </View>

            <View style={styles.frmInputWrapper}>
              <Text style={[styles.frmLabel, {width: width / 2}]}>
                {
                  Language[this.state.selectedLanguage]['create_circle_screen'][
                    'round_settlement'
                  ]
                }
              </Text>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.frmLabel}>€</Text>
              </View>

              <TextInput
                style={errorRoundSettlement}
                onChangeText={(round_settelment) =>
                  this.setState({round_settelment})
                }
                value={this.state.round_settelment}
                // ref={sattelment => (this.sattelment = sattelment)}
                keyboardType="numeric"
                autoCapitalize="none"
                returnKeyType="next"
                //onSubmitEditing={() => this.picker.focus()}
              />
            </View>

            <View
              style={{
                height: 40,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <View style={{width: width / 2 + 12}}>
                <Text style={styles.frmLabel}>
                  {
                    Language[this.state.selectedLanguage][
                      'create_circle_screen'
                    ]['periodicity_of_round']
                  }
                  :{' '}
                </Text>
              </View>

              <View
                style={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: '#dcdcdc',
                  paddingLeft: 5,
                  flex: 1,
                }}>
                {Platform.OS == 'ios' ? (
                  <ModalSelector
                    optionTextStyle={{
                      fontSize: 14,
                      color: '#000000',
                    }}
                    data={this.state.roundTypes}
                    initValue={this.state.periodicity}
                    onChange={(option) =>
                      this.setState({periodicity: option.option})
                    }
                    keyExtractor={(option) => option.option}
                    labelExtractor={(option) => option.option}
                    cancelText={
                      Language[this.state.selectedLanguage]['common']['cancel']
                    }
                    overlayStyle={{
                      flex: 1,
                      padding: '5%',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                    }}>
                    <TextInput
                      style={{
                        fontSize: 14,
                        color: '#000000',
                        height: 40,
                      }}
                      editable={false}
                      value={this.state.periodicity}
                    />
                  </ModalSelector>
                ) : (
                  <Picker
                    //ref={picker => (this.picker = picker)}
                    selectedValue={this.state.periodicity}
                    style={{
                      height: 40,
                      padding: 5,
                    }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({periodicity: itemValue})
                    }>
                    {roundType}
                  </Picker>
                )}
              </View>
            </View>

            <View style={styles.frmInputWrapperColumn}>
              <Text style={styles.frmLabel}>
                {
                  Language[this.state.selectedLanguage]['create_circle_screen'][
                    'reason'
                  ]
                }
              </Text>

              <TextInput
                style={[styles.textAreaInput, {marginTop: 5}]}
                onChangeText={(reason) => this.setState({reason})}
                multiline={true}
              />
            </View>

            <View style={[styles.frmInputWrapper]}>
              <Text style={[styles.frmLabel, {width: width / 2 + 12}]}>
                {
                  Language[this.state.selectedLanguage]['create_circle_screen'][
                    'start_date'
                  ]
                }
                :
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  position: 'relative',
                }}>
                <TextInput
                  editable={false}
                  style={[errorStartDate, {paddingRight: 20}]}
                  value={this.state.start_date}
                />
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    right: 10,
                    top: 10,
                    position: 'absolute',
                  }}
                  onPress={() => this.showDateTimePicker()}>
                  <Image
                    source={require('../../../assets/images/calendar.png')}
                    style={{
                      width: 20,
                      height: 20,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
                datePickerModeAndroid={'spinner'}
                minimumDate={minDate}
                maximumDate={maxDate}
              />
            </View>

            <View
              style={[
                styles.frmInputWrapper,
                {justifyContent: 'space-between'},
              ]}>
              <Text style={styles.frmLabel}>
                {
                  Language[this.state.selectedLanguage]['create_circle_screen'][
                    'participants'
                  ]
                }
              </Text>

              <TouchableOpacity
                onPress={() => this._doRedirectJoinPerticipants()}>
                <Image
                  source={require('../../../assets/images/plus.png')}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View>
              {this.state.tempData.length ? (
                <View>
                  {
                    <View>
                      <Text style={[styles.frmLabelRight, {marginTop: 5}]}>
                        {'1'}. {this.state.first_name}(
                        {
                          Language[this.state.selectedLanguage][
                            'dashboard_screen'
                          ]['circle_admin']
                        }
                        ) ({this.state.mobile_country_code}
                        {this.state.mobile_number})
                      </Text>
                      {/* {joinParticipantList} */}
                      {this.state.tempData.map((contact, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={[styles.frmLabelRight, {marginTop: 5}]}>
                              {index + 2}. {contact.username} ({contact.mobile})
                            </Text>
                            <TouchableOpacity
                              onPress={() => this.onDeleteContact(index)}>
                              <Image
                                source={require('../../../assets/images/delete.png')}
                                style={{
                                  width: 20,
                                  height: 20,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  }
                </View>
              ) : null}
            </View>

            {/* {this.state.errorMessage && this.state.tempData.length <= 0 ? (
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
                    textAlign: 'center',
                    padding: 10,
                  }}>
                  {this.state.errorMessage}
                </Text>
              </View>
            ) : null} */}

            {this.state.successMessage ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    color: 'green',
                    fontSize: 16,
                  }}>
                  {this.state.successMessage}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={() => this._doContinue()}
              style={styles.sendButtonBlock}
              disabled={this.state.loader}>
              <Text style={styles.sendButtonText}>
                {Language[this.state.selectedLanguage]['common']['continue']}
              </Text>

              {this.state.loader ? (
                <View style={styles.loading}>
                  <ActivityIndicator size="small" color={'#FFFFFF'} />
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  inputTextStyleActive: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    marginLeft: 5,
    borderRadius: 5,
  },

  inputTextStyleRequired: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'red',
    marginLeft: 5,
    borderRadius: 5,
  },

  sendButtonBlock: {
    marginTop: 20,
    height: 50,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5AC6C6',
    elevation: 2,
    flexDirection: 'row',
  },

  frmInputWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frmInputWrapperColumn: {
    marginTop: 20,
    justifyContent: 'center',
  },
  headingText: {
    fontSize: 16,
    color: '#000000',
  },
  frmLabel: {
    fontSize: 14,
    color: '#000000',
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
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

  textAreaInput: {
    flex: 1,
    height: 100,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 5,
    color: '#000000',
    fontSize: 18,
    paddingLeft: 5,
    paddingVertical: 0,
    textAlignVertical: 'top',
  },
  frmLabelRight: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
});
