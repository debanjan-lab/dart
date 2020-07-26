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
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';

const height = Math.round(Dimensions.get('window').height);

const statusBarBackgroundColor = '#1CCBE6';
const barStyle = 'light-content';

import HeaderCurve from '../includes/headercurve';
import httpService from '../../services/http/httpService';

import Language from '../../translations/index';

export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      success: null,
      rememberToken: null,
      email: '',
      errorEmail: false,
      errorMessage: '',
      successMessage: '',
      selectedLanguage: 'en',
    };
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    AsyncStorage.multiGet(['rememberToken']).then((response) => {
      this.setState({
        rememberToken: response[0][1],
        selectedLanguage: 'fr',
      });
    });
  };

  _doRecoverPassword = () => {
    Keyboard.dismiss();
    this.setState({
      errorEmail: false,
      errorMessage: '',
      successMessage: '',
    });

    if (this.state.email == '') {
      this.setState({
        errorEmail: true,
        errorMessage:
          Language[this.state.selectedLanguage]['common']['empty_field'],
      });
    }

    setTimeout(
      function () {
        if (!this.state.errorMessage) {
          let that = this;
          let thatNavigation = this.props.navigation;
          let obj = {
            url: 'forget-password',
            data: {
              email: this.state.email,
            },
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
                that.setState({
                  successMessage: response.message
                    ? Language[this.state.selectedLanguage]['status'][
                        response.message
                      ]
                    : '',
                });
                setTimeout(
                  function () {
                    thatNavigation.navigate('loginPage');
                  }.bind(this),
                  3000,
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

  _doRedirectPrev = () => {
    this.props.navigation.navigate('LoginScreen1');
  };

  render() {
    const errorEmail = this.state.errorEmail
      ? styles.inputTextStyleRequired
      : styles.inputTextStyleInactive;

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={barStyle}
        />
        <HeaderCurve
          backButton={true}
          title={
            Language[this.state.selectedLanguage]['forgot_password_screen'][
              'headText'
            ]
          }
          bellIcon={false}
          backAlert={this.state.email ? true : false}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <View style={{padding: 20, flex: 1}}>
            <View style={styles.imageWrapper}>
              <Image
                source={require('../../../assets/images/forgot.png')}
                resizeMode={'contain'}
                style={{
                  width: 200,
                  height: 200,
                }}
              />
            </View>

            <Text style={styles.headingText}>
              {
                Language[this.state.selectedLanguage]['forgot_password_screen'][
                  'heading'
                ]
              }
            </Text>
            <View style={styles.textInputWrapper}>
              <TextInput
                autoFocus={true}
                style={errorEmail}
                onChangeText={(email) => this.setState({email})}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <View style={{position: 'absolute'}}>
                <Image
                  source={require('../../../assets/images/email.png')}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </View>
            </View>
            <View style={styles.errorMessageContainer}>
              {this.state.successMessage ? (
                <Text
                  style={{
                    color: 'green',
                    fontSize: 16,
                  }}>
                  {this.state.successMessage}
                </Text>
              ) : (
                <Text
                  style={{
                    color: 'red',
                    fontSize: 16,
                  }}>
                  {this.state.errorMessage}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => this._doRecoverPassword()}
              style={styles.sendButtonBlock}
              disabled={this.state.loader}>
              <Text style={styles.sendButtonText}>
                {Language[this.state.selectedLanguage]['common']['send']}
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
  inputTextStyleInactive: {
    flex: 1,
    height: 40,
    borderBottomColor: '#1DC2E0',
    borderBottomWidth: 1,
    color: '#000000',
    fontSize: 18,
    paddingLeft: 40,
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
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    marginLeft: 20,
  },
  inputTextStyleRequired: {
    flex: 1,
    height: 40,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
    color: '#000000',
    fontSize: 18,
    paddingLeft: 40,
    paddingVertical: 0,
  },
  headingText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  textInputWrapper: {
    flexDirection: 'row',
    position: 'relative',
    marginTop: 20,
    alignItems: 'center',
  },
  errorMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
