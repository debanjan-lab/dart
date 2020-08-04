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

class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      ongoingApiCalled: false,
      waitingApiCalled: true,
      blockedApiCalled: false,
      suspendApiCalled: false,
      rememberToken: null,
      errorText: '',
      subMessage: '',
      list: [{key: '1', name: 'debanjan'}],
      getList: [],
      language: 'en',
      first_name: '',
      avatar_location: '',
      dataLoadIndicator: false,
      tabName: '',
      selectedLanguage: 'en',
      isRefresh: true,
    };
  }

  async componentDidMount() {
    const {
      ongoingApiCalled,
      waitingApiCalled,
      blockedApiCalled,
      suspendApiCalled,
    } = this.state;
    const language = await AsyncStorage.getItem('language');
    if (language) {
      this.setState({language: language});
    }
    this.onGetUserInfo();
    this.getList(
      ongoingApiCalled,
      waitingApiCalled,
      blockedApiCalled,
      suspendApiCalled,
      '0',
    );
    EventEmitter.on('validatedCircleCreation', (data) => {
      if (data) {
        this.getList(
          ongoingApiCalled,
          waitingApiCalled,
          blockedApiCalled,
          suspendApiCalled,
          '0',
        );
      }
    });

    this.setState({
      selectedLanguage: 'fr',
    });
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

  componentDidUpdate(prevProps, prevState) {
    const {tabName} = this.state;
    console.log(prevState);
    console.log(this.state);
    if (
      prevProps.isFocused !== this.props.isFocused ||
      prevState.isRefresh != this.state.isRefresh
    ) {
      if (tabName === 'onGoing') {
        this.setState({
          ongoingApiCalled: true,
          waitingApiCalled: false,
          blockedApiCalled: false,
          suspendApiCalled: false,
        });
        this.getList(true, false, false, false, '1');
      }
      if (tabName === 'onWaiting') {
        this.setState({
          ongoingApiCalled: false,
          waitingApiCalled: true,
          blockedApiCalled: false,
          suspendApiCalled: false,
        });
        this.getList(false, true, false, false, '0');
      }
      if (tabName === 'onBlock') {
        this.setState({
          ongoingApiCalled: false,
          waitingApiCalled: false,
          blockedApiCalled: true,
          suspendApiCalled: false,
        });
        this.getList(false, false, true, false, '2');
      }
      if (tabName === 'onSuspend') {
        this.setState({
          ongoingApiCalled: false,
          waitingApiCalled: false,
          blockedApiCalled: false,
          suspendApiCalled: true,
        });
        this.getList(false, false, false, true, '3');
      }
    }
  }

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
              that.props.navigation.navigate('createCirclePage');
            },
          );
        }.bind(this),
        1000,
      );
    });
  };

  getList = async (ongoing, waiting, block, suspend, status) => {
    tabIndex = status;
    CommonService.resetDataForLaunchNewCircle();
    //this.loading = Loading.show(CommonService.loaderObj);

    const value = await AsyncStorage.getItem('rememberToken');
    this.setState({
      rememberToken: value,
      errorText: '',
      subMessage: '',
      getList: [],
      ongoingApiCalled: ongoing,
      waitingApiCalled: waiting,
      blockedApiCalled: block,
      suspendApiCalled: suspend,
      dataLoadIndicator: true,
      isRefresh: true,
    });

    let payload = {
      url: 'circle-list',
      data: {
        circle_status: status,
      },
      authtoken: value,
    };

    httpService
      .postHttpCall(payload)
      .then((res) => {
        this.setState({
          isRefresh: false,
        });
        // Loading.hide(this.loading);
        if (res.status !== undefined) {
          if (res.status == 100) {
            this.setState({
              getList: res.result,
              loader: false,
              dataLoadIndicator: false,
            });
          } else {
            //Loading.hide(this.loading);
            this.setState({
              errorText: res.message
                ? Language[this.state.selectedLanguage]['status'][res.message]
                : '',
              loader: false,
              dataLoadIndicator: false,
            });
          }
        } else {
          this.setState({
            errorText: httpService.appMessege.unknown_error,
            subMessage: httpService.appMessege.working_progress,
            loader: false,
            dataLoadIndicator: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          errorText: err.message,
          loader: false,
          isRefresh: false,
        });
        if (err.status == 4) {
          this.setState({
            subMessage: httpService.appMessege.internet_sub,
            loader: false,
            dataLoadIndicator: false,
          });
        }
      });
  };

  getNames(data) {
    let names = '';
    data.forEach((element) => {
      names += element.username + ', ';
    });
    names = names.substring(0, names.length - 2);
    return names + ' ';
  }

  onPresswaitingTab = (item) => {
    this.setState({tabName: 'onWaiting'});
    this.props.navigation.navigate('rejectJoinPage', {result: item});
  };

  onPressGoingTab = (item) => {
    this.setState({tabName: 'onGoing'});
    this.props.navigation.navigate('ongingPage', {result: item});
  };

  onPressBlockTab = (item) => {
    this.setState({tabName: 'onBlock'});
    this.props.navigation.navigate('blockCircleOnePage', {
      result: item,
    });
  };

  onPressSuspended = (item) => {
    this.setState({tabName: 'onSuspend'});
    this.props.navigation.navigate('suspendedScreen', {
      result: item,
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={[styles.container]}>
          <HeaderCurve
            // title={"Dashboard"}
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

          {this.state.dataLoadIndicator ? (
            <View style={styles.loaderWrapper}>
              <ActivityIndicator size="large" color="#1CCBE6" />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                padding: 20,
              }}>
              <TouchableOpacity
                onPress={() => this._doLaunchCircle()}
                style={styles.sendButtonBlock}>
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

              {/* ----------------feature buttons----------------*/}
              <View style={styles.featureBlockWrapper}>
                <TouchableOpacity
                  style={[
                    tabIndex == 0 ? styles.block2Active : styles.block2InActive,
                  ]}
                  onPress={() => this.getList(false, true, false, false, '0')}>
                  <Text
                    style={[
                      tabIndex == 0
                        ? styles.block2ActiveText
                        : styles.block2InActiveText,
                    ]}>
                    {
                      Language[this.state.selectedLanguage]['dashboard_screen'][
                        'waiting'
                      ]
                    }
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    tabIndex == 1 ? styles.block1Active : styles.block1InActive,
                  ]}
                  onPress={() => this.getList(true, false, false, false, '1')}>
                  <Text
                    style={[
                      tabIndex == 1
                        ? styles.block1ActiveText
                        : styles.block1InActiveText,
                    ]}>
                    {
                      Language[this.state.selectedLanguage]['dashboard_screen'][
                        'ongoing'
                      ]
                    }
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    tabIndex == 2 ? styles.block3Active : styles.block3InActive,
                  ]}
                  onPress={() => this.getList(false, false, true, false, '2')}>
                  <Text
                    style={[
                      tabIndex == 2
                        ? styles.block3ActiveText
                        : styles.block3InActiveText,
                    ]}>
                    {
                      Language[this.state.selectedLanguage]['dashboard_screen'][
                        'blocked'
                      ]
                    }
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    tabIndex == 3 ? styles.block4Active : styles.block4InActive,
                  ]}
                  onPress={() => this.getList(false, false, false, true, '3')}>
                  <Text
                    style={[
                      tabIndex == 3
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
              </View>
              {this.state.errorText != '' ? (
                <View style={{alignItems: 'center', marginTop: '47%'}}>
                  <ErrorTemplate
                    message={this.state.errorText}
                    subMessage={this.state.subMessage}
                  />
                </View>
              ) : (
                <View>
                  {this.state.waitingApiCalled &&
                    this.state.getList.map((value, index) => {
                      return this.waitinglistRender(value, index);
                    })}

                  {this.state.ongoingApiCalled &&
                    this.state.getList.map((value, index) => {
                      return this.onGoingListRender(value, index);
                    })}

                  {this.state.blockedApiCalled &&
                    this.state.getList.map((value, index) => {
                      return this.blockedListRender(value, index);
                    })}

                  {this.state.suspendApiCalled &&
                    this.state.getList.map((value, index) => {
                      return this.suspendListRender(value, index);
                    })}

                  {/* {this.state.waitingApiCalled
                    ? 
                    : this.state.ongoingApiCalled
                    ? this.onGoingListComponent(this.state.getList)
                    : this.state.blockedApiCalled
                    ? this.blockListComponent(this.state.getList)
                    : this.state.suspendApiCalled
                    ? this.suspendListComponent(this.state.getList)
                    : null} */}
                </View>
              )}
            </ScrollView>
          )}

          <FooterTabComponent props={this.props} />
        </View>
      </View>
    );
  }

  waitinglistRender = (value, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.onPresswaitingTab(value)}>
        <View style={[styles.listItemWrapper]}>
          <View style={styles.listLeftWrapper}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'circle'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>{value.circle_code}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'circle_admin'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>{value.admin}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'participants'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.listRightText, {paddingRight: 20}]}>
                {this.getNames(value.get_users)}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'amount'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>€{value.target_achive}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'launch_date'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>
                {CommonService.formatDate(value.start_date)}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'last_round_date'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>
                {CommonService.formatDate(value.end_date)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // waitinglistComponent = (response) => {
  //   return (
  //     <FlatList
  //       showsHorizontalScrollIndicator={false}
  //       showsVerticalScrollIndicator={false}
  //       keyExtractor={(item) => item.id.toString()}
  //       ListHeaderComponent={<View style={{height: 10}} />}
  //       ListFooterComponent={<View style={{height: 10}} />}
  //       data={response}
  //       numColumns={1}
  //       renderItem={({item, index}) => (
  //         <TouchableOpacity
  //           activeOpacity={1}
  //           onPress={() => this.onPresswaitingTab(item)}>
  //           <View style={[styles.listItemWrapper]}>
  //             <View style={styles.listLeftWrapper}>
  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'circle'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>{item.circle_code}</Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'circle_admin'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>{item.admin}</Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'participants'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text
  //                   numberOfLines={1}
  //                   style={[styles.listRightText, {paddingRight: 20}]}>
  //                   {this.getNames(item.get_users)}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'amount'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   €{item.target_achive}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'launch_date'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   {CommonService.formatDate(item.start_date)}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'last_round_date'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   {CommonService.formatDate(item.end_date)}
  //                 </Text>
  //               </View>
  //             </View>
  //           </View>
  //         </TouchableOpacity>
  //       )}
  //     />
  //   );
  // };

  onGoingListRender = (value, index) => {
    return (
      <TouchableOpacity key={index} onPress={() => this.onPressGoingTab(value)}>
        <View style={styles.listItemWrapper}>
          <View style={styles.listLeftWrapper}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'circle'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>{value.circle_code}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'circle_admin'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>{value.admin}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'participants'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.listRightText, {width: wp('33%')}]}>
                {this.getNames(value.get_users)}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'amount'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>€{value.target_achive}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'launch_date'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>
                {CommonService.formatDate(value.end_date)}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'expected_payment_recieved'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>
                {value.expected_payable_date}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'next_expected_payment'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>
                {value.expected_next_payment_date}
              </Text>
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              flex: 1,
              paddingTop: 10,
            }}>
            <ProgressCircle
              percent={CommonService.getPercentage(
                value.completed_round,
                value.estimate_round,
              )}
              radius={hp('5%')}
              borderWidth={8}
              color="#3bdfde"
              shadowColor="#ececec"
              bgColor="#fff">
              <Text style={{fontSize: 18}}>
                {CommonService.getPercentage(
                  value.completed_round,
                  value.estimate_round,
                ) + '%'}
              </Text>
            </ProgressCircle>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // onGoingListComponent = (response) => {
  //   return (
  //     <FlatList
  //       showsHorizontalScrollIndicator={false}
  //       showsVerticalScrollIndicator={false}
  //       keyExtractor={(item) => item.id.toString()}
  //       ListHeaderComponent={<View style={{height: 10}} />}
  //       ListFooterComponent={<View style={{height: 10}} />}
  //       data={response}
  //       renderItem={({item, index}) => (
  //         <TouchableOpacity
  //           activeOpacity={1}
  //           onPress={() => this.onPressGoingTab(item)}>
  //           <View style={styles.listItemWrapper}>
  //             <View style={styles.listLeftWrapper}>
  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'circle'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>{item.circle_code}</Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'circle_admin'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>{item.admin}</Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'participants'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text
  //                   numberOfLines={1}
  //                   style={[styles.listRightText, {width: wp('33%')}]}>
  //                   {this.getNames(item.get_users)}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'amount'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   €{item.target_achive}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'launch_date'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   {CommonService.formatDate(item.end_date)}
  //                 </Text>
  //               </View>
  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'expected_payment_recieved'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   {item.expected_payable_date}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'next_expected_payment'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   {item.expected_next_payment_date}
  //                 </Text>
  //               </View>
  //             </View>

  //             <View
  //               style={{
  //                 alignItems: 'center',
  //                 flex: 1,
  //                 paddingTop: 10,
  //               }}>
  //               <ProgressCircle
  //                 percent={CommonService.getPercentage(
  //                   item.completed_round,
  //                   item.estimate_round,
  //                 )}
  //                 radius={hp('5%')}
  //                 borderWidth={8}
  //                 color="#3bdfde"
  //                 shadowColor="#ececec"
  //                 bgColor="#fff">
  //                 <Text style={{fontSize: 18}}>
  //                   {CommonService.getPercentage(
  //                     item.completed_round,
  //                     item.estimate_round,
  //                   ) + '%'}
  //                 </Text>
  //               </ProgressCircle>
  //             </View>
  //           </View>
  //         </TouchableOpacity>
  //       )}
  //       numColumns={1}
  //     />
  //   );
  // };

  blockedListRender = (value, index) => {
    return (
      <TouchableOpacity key={index} onPress={() => this.onPressBlockTab(value)}>
        <View style={styles.listItemWrapper}>
          <View style={styles.listLeftWrapper}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'circle'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>{value.circle_code}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'circle_admin'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>{value.admin}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'participants'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.listRightText, {width: wp('33%')}]}>
                {this.getNames(value.get_users)}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'amount'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>€{value.target_achive}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'launch_date'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>
                {CommonService.formatDate(value.start_date)}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'last_round_date'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>
                {CommonService.formatDate(value.end_date)}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'progress_status'
                  ]
                }{' '}
                :{' '}
              </Text>
              {value.completed_round == value.estimate_round ? (
                <Text style={styles.listRightText}>
                  {Language[this.state.selectedLanguage]['common']['completed']}
                </Text>
              ) : (
                <Text style={styles.listRightText}>
                  {value.completed_round +
                    ' ' +
                    Language[this.state.selectedLanguage][
                      'circle_completed_screen'
                    ]['round_over_out'] +
                    ' ' +
                    value.estimate_round}
                </Text>
              )}
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              flex: 1,
              paddingTop: 10,
            }}>
            <ProgressCircle
              percent={CommonService.getPercentage(
                value.completed_round,
                value.estimate_round,
              )}
              radius={hp('5%')}
              borderWidth={8}
              color="#3bdfde"
              shadowColor="#ececec"
              bgColor="#fff">
              <Text style={{fontSize: 18}}>
                {CommonService.getPercentage(
                  value.completed_round,
                  value.estimate_round,
                ) + '%'}
              </Text>
            </ProgressCircle>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // blockListComponent = (response) => {
  //   return (
  //     <FlatList
  //       showsHorizontalScrollIndicator={false}
  //       showsVerticalScrollIndicator={false}
  //       keyExtractor={(item) => item.id.toString()}
  //       ListHeaderComponent={<View style={{height: 10}} />}
  //       ListFooterComponent={<View style={{height: 10}} />}
  //       data={response}
  //       renderItem={({item, index}) => (
  //         <TouchableOpacity
  //           activeOpacity={1}
  //           onPress={() => this.onPressBlockTab(item)}>
  //           <View style={styles.listItemWrapper}>
  //             <View style={styles.listLeftWrapper}>
  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'circle'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>{item.circle_code}</Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'circle_admin'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>{item.admin}</Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'participants'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text
  //                   numberOfLines={1}
  //                   style={[styles.listRightText, {width: wp('33%')}]}>
  //                   {this.getNames(item.get_users)}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'amount'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   €{item.target_achive}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'launch_date'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   {CommonService.formatDate(item.start_date)}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'last_round_date'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   {CommonService.formatDate(item.end_date)}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'progress_status'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 {item.completed_round == item.estimate_round ? (
  //                   <Text style={styles.listRightText}>
  //                     {
  //                       Language[this.state.selectedLanguage]['common'][
  //                         'completed'
  //                       ]
  //                     }
  //                   </Text>
  //                 ) : (
  //                   <Text style={styles.listRightText}>
  //                     {item.completed_round +
  //                       ' ' +
  //                       Language[this.state.selectedLanguage][
  //                         'circle_completed_screen'
  //                       ]['round_over_out'] +
  //                       ' ' +
  //                       item.estimate_round}
  //                   </Text>
  //                 )}
  //               </View>
  //             </View>

  //             <View
  //               style={{
  //                 alignItems: 'center',
  //                 flex: 1,
  //                 paddingTop: 10,
  //               }}>
  //               <ProgressCircle
  //                 percent={CommonService.getPercentage(
  //                   item.completed_round,
  //                   item.estimate_round,
  //                 )}
  //                 radius={hp('5%')}
  //                 borderWidth={8}
  //                 color="#3bdfde"
  //                 shadowColor="#ececec"
  //                 bgColor="#fff">
  //                 <Text style={{fontSize: 18}}>
  //                   {CommonService.getPercentage(
  //                     item.completed_round,
  //                     item.estimate_round,
  //                   ) + '%'}
  //                 </Text>
  //               </ProgressCircle>
  //             </View>
  //           </View>
  //         </TouchableOpacity>
  //       )}
  //       numColumns={1}
  //     />
  //   );
  // };

  suspendListRender = (value, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.onPressSuspended(value)}>
        <View style={styles.listItemWrapper}>
          <View style={styles.listLeftWrapper}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'circle'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>{value.circle_code}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'circle_admin'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>{value.admin}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'participants'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.listRightText, {width: wp('33%')}]}>
                {this.getNames(value.get_users)}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'amount'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>€{value.target_achive}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'launch_date'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>
                {CommonService.formatDate(value.start_date)}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'last_round_date'
                  ]
                }{' '}
                :{' '}
              </Text>
              <Text style={styles.listRightText}>
                {CommonService.formatDate(value.end_date)}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listLeftText}>
                {
                  Language[this.state.selectedLanguage]['dashboard_screen'][
                    'progress_status'
                  ]
                }{' '}
                :{' '}
              </Text>
              {value.completed_round > 1 ? (
                <Text style={styles.listRightText}>
                  {value.completed_round +
                    ' rounds over out of ' +
                    value.estimate_round}
                </Text>
              ) : (
                <Text style={styles.listRightText}>
                  {value.completed_round +
                    ' ' +
                    Language[this.state.selectedLanguage][
                      'circle_completed_screen'
                    ]['round_over_out'] +
                    ' ' +
                    value.estimate_round}
                </Text>
              )}
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              flex: 1,
              paddingTop: 10,
            }}>
            <ProgressCircle
              percent={CommonService.getPercentage(
                value.completed_round,
                value.estimate_round,
              )}
              radius={hp('5%')}
              borderWidth={8}
              color="#3bdfde"
              shadowColor="#ececec"
              bgColor="#fff">
              <Text style={{fontSize: 18}}>
                {CommonService.getPercentage(
                  value.completed_round,
                  value.estimate_round,
                ) + '%'}
              </Text>
            </ProgressCircle>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // suspendListComponent = (response) => {
  //   return (
  //     <FlatList
  //       showsHorizontalScrollIndicator={false}
  //       showsVerticalScrollIndicator={false}
  //       keyExtractor={(item) => item.id.toString()}
  //       ListHeaderComponent={<View style={{height: 10}} />}
  //       ListFooterComponent={<View style={{height: 10}} />}
  //       data={response}
  //       renderItem={({item, index}) => (
  //         <TouchableOpacity
  //           activeOpacity={1}
  //           onPress={() => this.onPressSuspended(item)}>
  //           <View style={styles.listItemWrapper}>
  //             <View style={styles.listLeftWrapper}>
  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'circle'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>{item.circle_code}</Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'circle_admin'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>{item.admin}</Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'participants'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text
  //                   numberOfLines={1}
  //                   style={[styles.listRightText, {width: wp('33%')}]}>
  //                   {this.getNames(item.get_users)}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'amount'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   €{item.target_achive}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'launch_date'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   {CommonService.formatDate(item.start_date)}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'last_round_date'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 <Text style={styles.listRightText}>
  //                   {CommonService.formatDate(item.end_date)}
  //                 </Text>
  //               </View>

  //               <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                 <Text style={styles.listLeftText}>
  //                   {
  //                     Language[this.state.selectedLanguage]['dashboard_screen'][
  //                       'progress_status'
  //                     ]
  //                   }{' '}
  //                   :{' '}
  //                 </Text>
  //                 {item.completed_round > 1 ? (
  //                   <Text style={styles.listRightText}>
  //                     {item.completed_round +
  //                       ' rounds over out of ' +
  //                       item.estimate_round}
  //                   </Text>
  //                 ) : (
  //                   <Text style={styles.listRightText}>
  //                     {item.completed_round +
  //                       ' ' +
  //                       Language[this.state.selectedLanguage][
  //                         'circle_completed_screen'
  //                       ]['round_over_out'] +
  //                       ' ' +
  //                       item.estimate_round}
  //                   </Text>
  //                 )}
  //               </View>
  //             </View>

  //             <View
  //               style={{
  //                 alignItems: 'center',
  //                 flex: 1,
  //                 paddingTop: 10,
  //               }}>
  //               <ProgressCircle
  //                 percent={CommonService.getPercentage(
  //                   item.completed_round,
  //                   item.estimate_round,
  //                 )}
  //                 radius={hp('5%')}
  //                 borderWidth={8}
  //                 color="#3bdfde"
  //                 shadowColor="#ececec"
  //                 bgColor="#fff">
  //                 <Text style={{fontSize: 18}}>
  //                   {CommonService.getPercentage(
  //                     item.completed_round,
  //                     item.estimate_round,
  //                   ) + '%'}
  //                 </Text>
  //               </ProgressCircle>
  //             </View>
  //           </View>
  //         </TouchableOpacity>
  //       )}
  //       numColumns={1}
  //     />
  //   );
  // };
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
    width: width / 4.7,
    height: 60,
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
    width: width / 4.7,
    height: 60,
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
    width: width / 4.7,
    height: 60,
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
    width: width / 4.7,
    height: 60,
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
    width: width / 4.7,
    height: 60,
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
    width: width / 4.7,
    height: 60,
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
    width: width / 4.7,
    height: 60,
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
    width: width / 4.7,
    height: 60,
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
});
