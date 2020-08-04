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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProgressCircle from 'react-native-progress-circle';
import AsyncStorage from '@react-native-community/async-storage';
import httpService from '../../services/http/httpService';
import CommonService from '../../services/common/commonService';
import {ErrorTemplate} from '../../components/error/errorComponent';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
import URL from '../../config/url';
const ApiConfig = URL;
import Language from '../../translations/index';

import {ToastMessage} from '../../components/ToastMessage';
class BlockList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedLanguage: 'en',
      list: [],
      refreshing: true,
    };
  }

  async componentDidMount() {
    this.setState(
      {
        selectedLanguage: 'fr',
      },
      () => {
        this.onGetUserInfo();
      },
    );
  }

  onGetUserInfo = () => {
    AsyncStorage.multiGet(['rememberToken']).then((response) => {
      this.setState(
        {
          token: response[0][1],
        },
        () => {
          this.getList();
        },
      );
    });
  };

  getList = () => {
    let payload = {
      url: 'circle-list',
      data: {
        circle_status: '2',
      },
      authtoken: this.state.token,
    };
    console.log(payload);

    httpService
      .postHttpCall(payload)
      .then((res) => {
        console.log(res);

        this.setState({
          list: res.result,
          errorText:
            Language[this.state.selectedLanguage]['status'][res.message],
        });

        // ToastMessage(
        //   Language[this.state.selectedLanguage]['status'][res.message],
        // );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({
          loading: false,
          refreshing: false,
        });
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

  onPressBlockTab = (item) => {
    this.props.navigation.navigate('blockCircleOnePage', {
      result: item,
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator color={'#1CCBE6'} />
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          paddingLeft: 20,
          paddingRight: 20,
        }}>
        {this.state.list.length == 0 && (
          <View style={styles.loadingWrapper}>
            <ErrorTemplate message={this.state.errorText} subMessage={''} />
          </View>
        )}
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.getList}
            />
          }
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={<View style={{height: 10}} />}
          ListFooterComponent={<View style={{height: 10}} />}
          data={this.state.list}
          renderItem={({item, index}) => (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.onPressBlockTab(item)}>
              <View style={styles.listItemWrapper}>
                <View style={styles.listLeftWrapper}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.listLeftText}>
                      {
                        Language[this.state.selectedLanguage][
                          'dashboard_screen'
                        ]['circle']
                      }{' '}
                      :{' '}
                    </Text>
                    <Text style={styles.listRightText}>{item.circle_code}</Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.listLeftText}>
                      {
                        Language[this.state.selectedLanguage][
                          'dashboard_screen'
                        ]['circle_admin']
                      }{' '}
                      :{' '}
                    </Text>
                    <Text style={styles.listRightText}>{item.admin}</Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.listLeftText}>
                      {
                        Language[this.state.selectedLanguage][
                          'dashboard_screen'
                        ]['participants']
                      }{' '}
                      :{' '}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[styles.listRightText, {width: wp('33%')}]}>
                      {this.getNames(item.get_users)}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.listLeftText}>
                      {
                        Language[this.state.selectedLanguage][
                          'dashboard_screen'
                        ]['amount']
                      }{' '}
                      :{' '}
                    </Text>
                    <Text style={styles.listRightText}>
                      €{item.target_achive}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.listLeftText}>
                      {
                        Language[this.state.selectedLanguage][
                          'dashboard_screen'
                        ]['launch_date']
                      }{' '}
                      :{' '}
                    </Text>
                    <Text style={styles.listRightText}>
                      {CommonService.formatDate(item.start_date)}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.listLeftText}>
                      {
                        Language[this.state.selectedLanguage][
                          'dashboard_screen'
                        ]['last_round_date']
                      }{' '}
                      :{' '}
                    </Text>
                    <Text style={styles.listRightText}>
                      {CommonService.formatDate(item.end_date)}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.listLeftText}>
                      {
                        Language[this.state.selectedLanguage][
                          'dashboard_screen'
                        ]['progress_status']
                      }{' '}
                      :{' '}
                    </Text>
                    {item.completed_round == item.estimate_round ? (
                      <Text style={styles.listRightText}>
                        {
                          Language[this.state.selectedLanguage]['common'][
                            'completed'
                          ]
                        }
                      </Text>
                    ) : (
                      <Text style={styles.listRightText}>
                        {item.completed_round +
                          ' ' +
                          Language[this.state.selectedLanguage][
                            'circle_completed_screen'
                          ]['round_over_out'] +
                          ' ' +
                          item.estimate_round}
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
                      item.completed_round,
                      item.estimate_round,
                    )}
                    radius={hp('5%')}
                    borderWidth={8}
                    color="#3bdfde"
                    shadowColor="#ececec"
                    bgColor="#fff">
                    <Text style={{fontSize: 18}}>
                      {CommonService.getPercentage(
                        item.completed_round,
                        item.estimate_round,
                      ) + '%'}
                    </Text>
                  </ProgressCircle>
                </View>
              </View>
            </TouchableOpacity>
          )}
          numColumns={1}
        />
      </View>
    );
  }
}

export default BlockList;

const styles = StyleSheet.create({
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

  loadingWrapper: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
