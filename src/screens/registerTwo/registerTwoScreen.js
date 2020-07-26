import React, {Component} from 'react';
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
} from 'react-native';
import {ToastMessage} from '../../components/ToastMessage';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
const height = Math.round(Dimensions.get('window').height);
const statusBarBackgroundColor = '#1CCBE6';
const barStyle = 'light-content';
import URL from '../../config/url';
import HeaderCurve from '../includes/headercurve';
import httpService from '../../services/http/httpService';
import Language from '../../translations/index';
import axios from 'axios';
const options = {
  title: 'Select Avatar',
  customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class RegisterTwoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: URL.public_url + 'storage/avatars/default_avatar.png',
      idScan: null,
      loaderAvatar: false,
      loaderID: false,
      rememberToken: '',
      success: null,
      avatarFile: null,
      idScanFile: null,
      loader: false,
      email: null,
      phone: null,

      first_name: '',
      errorFirstName: false,
      last_name: '',
      errorLastName: false,
      dob: '',
      selectedDate: new Date(),
      errorDob: false,
      errorMessage: '',
      mobile_country_code: '',
      selectedLanguage: 'en',
    };
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    AsyncStorage.multiGet([
      'rememberToken',
      'email',
      'mobile_number',
      'mobile_country_code',
    ]).then((response) => {
      this.setState({
        rememberToken: response[0][1],
        email: response[1][1],
        phone: response[2][1],
        mobile_country_code: response[3][1],
        selectedLanguage: 'fr',
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
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }
    var date = day + '/' + month + '/' + year;
    this.setState({
      dob: date,
      isDateTimePickerVisible: false,
    });
  };

  makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  _openImagePicker = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: 'data:image/jpeg;base64,' + response.data};

        this.setState(
          {
            uri: response.uri,
            type: response.type,
            fileName: response.fileName,
            source: source,
          },
          () => this._doUpload(),
        );
      }
    });
  };

  _doUpload = () => {
    this.setState({
      loaderAvatar: true,
    });

    let image = this.state.uri;

    let reqUrl = URL.base_url + 'upload-file';

    console.log(reqUrl);
    console.log(this.state.rememberToken);

    var bodyFormData = new FormData();

    bodyFormData.append('flag', '1');
    bodyFormData.append('file_name', {
      uri: image,
      name: this.state.fileName,
      type: this.state.type,
    });

    axios
      .post(reqUrl, bodyFormData, {
        headers: {
          'Content-type': 'multipart/form-data',
          Authorization: 'Bearer ' + this.state.rememberToken,
        },
      })
      .then((res) => {
        console.log('res', res.data);
        if (res.data.status == 100) {
          ToastMessage(
            Language[this.state.selectedLanguage]['common']['uploaded'],
          );

          this.setState({
            avatarFile: res.data.message,
          });
        }

        //this._doRegister();
      })
      .catch((err) => {
        // console.log('err', err);
        // ToastMessage(
        //   Language[this.state.selectedLanguage]["online_payment_screen"][
        //     "payment_key_error"
        //   ]
        // );
      })
      .finally(() => {
        this.setState({
          loaderAvatar: false,
        });
      });
  };

  _doRegister = () => {
    this.setState({
      errorFirstName: false,
      errorLastName: false,
      errorDob: false,
      errorMessage: '',
    });

    if (
      this.state.first_name == '' ||
      this.state.last_name == '' ||
      this.state.dob == ''
    ) {
      if (this.state.first_name == '') {
        this.setState({
          errorFirstName: true,
          errorMessage:
            Language[this.state.selectedLanguage]['common']['empty_field'],
        });
      }

      if (this.state.last_name == '') {
        this.setState({
          errorLastName: true,
          errorMessage:
            Language[this.state.selectedLanguage]['common']['empty_field'],
        });
      }

      if (this.state.dob == '') {
        this.setState({
          errorDob: true,
          errorMessage:
            Language[this.state.selectedLanguage]['common']['empty_field'],
        });
      }
    }

    setTimeout(
      function () {
        if (!this.state.errorMessage) {
          let thatRef = this.refs;
          let that = this;
          let thatNavigation = this.props.navigation;
          let obj = {
            url: 'update-profile',
            data: {
              first_name: this.state.first_name,
              last_name: this.state.last_name,
              dob: this.state.dob,
              iban: this.state.iban,
              credit_card_no: this.state.credit_card_no,
              paypal_account: this.state.paypal_account,
              id_scan: this.state.idScanFile,
              avatar_location: this.state.avatarFile,
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
                      errorMessage: response.message
                        ? Language[this.state.selectedLanguage]['status'][
                            response.message
                          ]
                        : '',
                    });
                  },
                );
              } else {
                AsyncStorage.clear();
                AsyncStorage.multiSet(
                  [
                    ['user_id', response.result.id.toString()],
                    ['rememberToken', that.state.rememberToken],
                    ['loggedIn', 'success'],
                    ['first_name', response.result.first_name],
                    ['last_name', response.result.last_name],
                    ['dob', response.result.dob],
                    ['email', response.result.email],
                    ['iban', response.result.iban],
                    [
                      'mobile_country_code',
                      response.result.mobile_country_code,
                    ],
                    ['mobile_number', response.result.mobile_number.toString()],
                    ['avatar_location', response.result.avatar_location],
                  ],

                  function (error) {
                    that.setState({loader: false});
                    setTimeout(() => {
                      thatNavigation.navigate('App');
                    }, 1000);

                    ToastMessage(
                      Language[that.state.selectedLanguage]['status'][
                        response.message
                      ],
                    );
                  },
                );
              }
            })
            .catch((err) => {
              that.setState({
                errorMessage: err.message
                  ? Language[this.state.selectedLanguage]['status'][err.message]
                  : '',
                loader: false,
              });
            });
        }
      }.bind(this),
      500,
    );
  };

  render() {
    const errorFirstName = this.state.errorFirstName
      ? styles.inputTextStyleRequired
      : styles.inputTextStyleActive;

    const errorLastName = this.state.errorLastName
      ? styles.inputTextStyleRequired
      : styles.inputTextStyleActive;

    const errorDob = this.state.errorDob
      ? styles.inputTextStyleRequired
      : styles.inputTextStyleActive;

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={barStyle}
        />
        <HeaderCurve
          title={
            Language[this.state.selectedLanguage]['register_screen2']['profile']
          }
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
          <View
            style={{
              padding: 20,
              flex: 1,
            }}>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity
                style={styles.avatarImageWrapper}
                onPress={() => this._openImagePicker()}>
                <Image
                  source={{
                    uri: this.state.uri ? this.state.uri : this.state.avatar,
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                  }}
                />

                {this.state.loaderAvatar ? (
                  <View style={styles.loadingCenter}>
                    <ActivityIndicator size="large" color={'#2ba685'} />
                  </View>
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  top: hp('10%'),
                  left: wp('50%'),
                  position: 'absolute',
                }}
                onPress={() => this._openImagePicker()}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                  }}
                  source={require('../../../assets/images/edit.png')}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.frmInputWrapper,
                {flexDirection: 'row', justifyContent: null},
              ]}>
              <Text style={[styles.frmLabel, {flex: 1}]}>
                {Language[this.state.selectedLanguage]['login_screen']['email']}
              </Text>
              <Text style={[styles.frmLabel, {flex: 3, color: '#000000'}]}>
                {this.state.email}
              </Text>
            </View>

            <View
              style={[
                styles.frmInputWrapper,
                {flexDirection: 'row', justifyContent: null},
              ]}>
              <Text style={[styles.frmLabel, {flex: 1}]}>
                {
                  Language[this.state.selectedLanguage]['register_screen1'][
                    'phone'
                  ]
                }
              </Text>
              <Text style={[styles.frmLabel, {flex: 3, color: '#000000'}]}>
                {this.state.mobile_country_code}
                {this.state.phone}
              </Text>
            </View>

            <View style={styles.frmInputWrapper}>
              <Text style={styles.frmLabel}>
                {
                  Language[this.state.selectedLanguage]['register_screen2'][
                    'first_name'
                  ]
                }
              </Text>
              <TextInput
                style={errorFirstName}
                onChangeText={(first_name) => this.setState({first_name})}
              />
            </View>

            <View style={styles.frmInputWrapper}>
              <Text style={styles.frmLabel}>
                {
                  Language[this.state.selectedLanguage]['register_screen2'][
                    'last_name'
                  ]
                }
              </Text>
              <TextInput
                style={errorLastName}
                onChangeText={(last_name) => this.setState({last_name})}
              />
            </View>

            <View style={styles.frmInputWrapper}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.frmLabel}>
                  {
                    Language[this.state.selectedLanguage]['register_screen2'][
                      'date_of_birth'
                    ]
                  }
                </Text>

                <TouchableOpacity onPress={() => this.showDateTimePicker()}>
                  <Image
                    source={require('../../../assets/images/calendar.png')}
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
                datePickerModeAndroid={'spinner'}
                date={this.state.selectedDate}
              />
            </View>
            <View style={styles.errorMessageContainer}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 16,
                }}>
                {this.state.errorMessage}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => this._doRegister()}
              style={styles.sendButtonBlock}
              disabled={this.state.loader}>
              <Text style={styles.sendButtonText}>
                {Language[this.state.selectedLanguage]['common']['submit']}
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
    height: 25,
    borderBottomColor: '#1DC2E0',
    borderBottomWidth: 1,
    color: '#000000',
    fontSize: 18,
    paddingVertical: 0,
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

  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  avatarImageWrapper: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 55,
  },
  frmInputWrapper: {
    marginTop: 20,
    justifyContent: 'space-between',
  },
  frmLabel: {
    fontSize: 16,
    color: '#909090',
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

  errorMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
