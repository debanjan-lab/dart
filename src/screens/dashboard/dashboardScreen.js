import React, {Component} from 'react';
import FooterTabComponent from '../../components/footerTab/footerTabComponent';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import EventEmitter from 'react-native-eventemitter';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProgressCircle from 'react-native-progress-circle';
import AsyncStorage from '@react-native-community/async-storage';

import HeaderCurve from '../includes/headercurve';
import httpService from '../../services/http/httpService';
import CommonService from '../../services/common/commonService';
import {ErrorTemplate} from '../../components/error/errorComponent';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
const statusBarBackgroundColor = '#1CCBE6';
const barStyle = 'light-content';
let tabIndex = 0;
import URL from '../../config/url';
const ApiConfig = URL;
import {withNavigationFocus} from 'react-navigation';
import Language from '../../translations/index';

import OngoingList from './onGoingList';
import WaitingList from './waitingList';
import BlockList from './blockedList';
import SuspendedList from './suspendedList';
class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'en',
      tabIndex: 0,
    };
  }

  componentDidMount() {
    this.setState(
      {
        selectedLanguage: 'fr',
        tabIndex: 0,
      },
      () => {
        this.onGetUserInfo();
        //alert(this.state.tabIndex);
      },
    );
  }

  onGetUserInfo = () => {
    AsyncStorage.multiGet([
      'rememberToken',
      'circle_code',
      'first_name',
      'avatar_location',
      'mobile_number',
    ]).then((response) => {
      this.setState({
        first_name: response[2][1],
        avatar_location: {
          uri: ApiConfig.public_url + 'storage/' + response[3][1],
        },
        loader: false,
      });
    });
  };

  _doActive = (tabNo) => {
    this.setState({
      tabIndex: tabNo,
    });
  };

  _btnTabWaiting = () => {
    return (
      <TouchableOpacity
        onPress={() => this._doActive(0)}
        style={[
          styles.tabBlockDefault,
          this.state.tabIndex == 0
            ? styles.block2Active
            : styles.block2InActive,
        ]}>
        <Text
          style={[
            this.state.tabIndex == 0
              ? styles.block2ActiveText
              : styles.block2InActiveText,
          ]}>
          {Language[this.state.selectedLanguage]['dashboard_screen']['waiting']}
        </Text>
      </TouchableOpacity>
    );
  };

  _btnTabOngoing = () => {
    return (
      <TouchableOpacity
        onPress={() => this._doActive(1)}
        style={[
          styles.tabBlockDefault,
          this.state.tabIndex == 1
            ? styles.block1Active
            : styles.block1InActive,
        ]}>
        <Text
          style={[
            this.state.tabIndex == 1
              ? styles.block1ActiveText
              : styles.block1InActiveText,
          ]}>
          {Language[this.state.selectedLanguage]['dashboard_screen']['ongoing']}
        </Text>
      </TouchableOpacity>
    );
  };

  _btnTabBlocked = () => {
    return (
      <TouchableOpacity
        onPress={() => this._doActive(2)}
        style={[
          styles.tabBlockDefault,
          this.state.tabIndex == 2
            ? styles.block3Active
            : styles.block3InActive,
        ]}>
        <Text
          style={[
            this.state.tabIndex == 2
              ? styles.block3ActiveText
              : styles.block3InActiveText,
          ]}>
          {Language[this.state.selectedLanguage]['dashboard_screen']['blocked']}
        </Text>
      </TouchableOpacity>
    );
  };

  _btnTabSuspended = () => {
    return (
      <TouchableOpacity
        onPress={() => this._doActive(3)}
        style={[
          styles.tabBlockDefault,
          this.state.tabIndex == 3
            ? styles.block4Active
            : styles.block4InActive,
        ]}>
        <Text
          style={[
            this.state.tabIndex == 3
              ? styles.block4ActiveText
              : styles.block4InActiveText,
          ]}>
          {
            Language[this.state.selectedLanguage]['dashboard_screen'][
              'suspended'
            ]
          }
        </Text>
      </TouchableOpacity>
    );
  };

  _doLaunchCircle = () => {
    CommonService.resetDataForLaunchNewCircle();

    let circle_code = Date.now().toString();
    let that = this;
    this.setState({
      loader: true,
      tabName: '',
    });

    AsyncStorage.multiSet([['circle_code', circle_code]], function (error) {
      setTimeout(
        function () {
          that.setState(
            {
              loader: false,
            },
            () => {
              that.props.navigation.push('createCirclePage');
            },
          );
        }.bind(this),
        500,
      );
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={[styles.container]}>
          <HeaderCurve
            first_name={this.state.first_name}
            avatar_location={this.state.avatar_location}
            navigation={this.navigation}
            backButton={false}
            bellIcon={false}
            props={this.props}
          />
          <StatusBar
            backgroundColor={statusBarBackgroundColor}
            barStyle={barStyle}
          />

          <View style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20}}>
            <TouchableOpacity
              onPress={this._doLaunchCircle}
              style={styles.sendButtonBlock}
              disabled={this.state.loader}>
              <Text style={styles.sendButtonText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'launch_new_circle'
                  ]
                }
              </Text>
              {this.state.loader ? (
                <View style={{marginLeft: 10}}>
                  <ActivityIndicator size="small" color={'#FFFFFF'} />
                </View>
              ) : null}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                marginBottom: 10,
              }}>
              {this._btnTabWaiting()}
              {this._btnTabOngoing()}
              {this._btnTabBlocked()}
              {this._btnTabSuspended()}
            </View>
          </View>

          <View style={{flex: 1}}>
            {this.state.tabIndex == 0 && (
              <WaitingList navigation={this.props.navigation} />
            )}
            {this.state.tabIndex == 1 && (
              <OngoingList navigation={this.props.navigation} />
            )}
            {this.state.tabIndex == 2 && (
              <BlockList navigation={this.props.navigation} />
            )}
            {this.state.tabIndex == 3 && (
              <SuspendedList navigation={this.props.navigation} />
            )}
          </View>

          <FooterTabComponent props={this.props} />
        </View>
      </View>
    );
  }
}

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerBackBlock: {
    justifyContent: 'center',
    width: 50,
    height: 50,
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

  inputTextStyleInactive: {
    flex: 1,
    height: 40,
    //borderBottomColor: '#dfdfe1',
    borderBottomColor: '#1DC2E0',
    borderBottomWidth: 1,
    color: '#000000',
    fontSize: 20,
    paddingLeft: 40,
    paddingVertical: 0,
  },

  sendButtonBlock: {
    //marginTop: 20,
    //height: 50,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5AC6C6',
    elevation: 2,
    flexDirection: 'row',
    padding: 10,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },

  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: hp('30%'),
  },
  headerMenu: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    top: hp('3%'),
  },
  headingBold: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  headingLight: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '200',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBlockWrapper: {
    flexDirection: 'row',
    marginTop: 20,
    //height: hp('10%'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  block1Active: {
    // width: width / 4.7,
    //height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#21c995',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21c995',
    elevation: 10,
  },
  block1ActiveText: {
    color: '#FFFFFF',
    fontSize: hp('1.8%'),
    fontWeight: '700',
  },
  block1InActive: {
    // width: width / 4.7,
    // height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#21c995',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 10,
  },
  block1InActiveText: {
    color: '#21c995',
    fontSize: 14,
    fontWeight: '700',
  },

  block2Active: {
    // width: width / 4.7,
    // height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#e3832f',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3832f',
    elevation: 10,
  },
  block2ActiveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  block2InActive: {
    //width: width / 4.7,
    //height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#e3832f',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 10,
  },
  block2InActiveText: {
    color: '#e3832f',
    fontSize: 14,
    fontWeight: '700',
  },

  block3Active: {
    // width: width / 4.7,
    //  height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#7792f9',
    alignItems: 'center',
    backgroundColor: '#7792f9',
    justifyContent: 'center',
    elevation: 10,
  },
  block3ActiveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  block3InActive: {
    //width: width / 4.7,
    // height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#7792f9',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    elevation: 10,
  },
  block3InActiveText: {
    color: '#7792f9',
    fontSize: 14,
    fontWeight: '700',
  },
  block4Active: {
    // width: width / 4.7,
    // height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#de4b5b',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    backgroundColor: '#de4b5b',
  },
  block4ActiveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  block4InActive: {
    // width: width / 4.7,
    //  height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#de4b5b',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    backgroundColor: '#FFFFFF',
  },
  block4InActiveText: {
    color: '#de4b5b',
    fontSize: 14,
    fontWeight: '700',
  },

  listItemWrapper: {
    flexDirection: 'row',
    //height: 160,
    marginTop: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#22c691',
    borderLeftWidth: 2,
    borderLeftColor: '#e2e2e2',
    borderTopWidth: 2,
    borderTopColor: '#e2e2e2',
    borderRightWidth: 2,
    borderRightColor: '#e2e2e2',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  listLeftWrapper: {
    width: wp('65%'),
    padding: 10,
  },
  listLeftText: {
    fontSize: 14,
    fontWeight: '700',
  },
  listRightText: {
    fontSize: 14,
  },
  loaderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  tabBlockDefault: {
    padding: 10,
  },
});
