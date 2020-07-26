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
  I18nManager,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const statusBarBackgroundColor = '#1CCBE6';
const barStyle = 'light-content';
import HeaderCurve from '../includes/headercurve';
import Language from '../../translations/index';

export default class StartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'en',
    };
  }

  _doRedirectLogin = () => {
    this.props.navigation.navigate('loginPage');
  };

  _doRedirectCreateAccount = () => {
    this.props.navigation.navigate('registerOnePage');
  };

  componentDidMount() {
    this.setState({
      selectedLanguage: 'fr',
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={barStyle}
        />
        <HeaderCurve />
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View
            style={{
              flex: 1,
              padding: 20,
            }}>
            <View style={styles.imageWrapper}>
              <Image
                source={require('../../../assets/images/login.png')}
                resizeMode={'contain'}
                style={{
                  width: 200,
                  height: 200,
                }}
              />
            </View>

            <View style={styles.containerHeaderBlock}>
              <Text style={styles.containerHeaderText}>
                {Language[this.state.selectedLanguage]['start_screen']['this']}
                <Text style={{fontWeight: '200'}}>
                  {
                    Language[this.state.selectedLanguage]['start_screen'][
                      'is_the'
                    ]
                  }
                </Text>
                {
                  Language[this.state.selectedLanguage]['start_screen'][
                    'welcome_text'
                  ]
                }
              </Text>
              <Text style={styles.containerHeaderSubText} numberOfLines={2}>
                {
                  Language[this.state.selectedLanguage]['start_screen'][
                    'sub_heading'
                  ]
                }
              </Text>
            </View>

            <View style={{marginTop: 20}}>
              <TouchableOpacity
                onPress={() => this._doRedirectLogin()}
                style={styles.sendButtonBlock}>
                <Text style={styles.sendButtonText}>
                  {
                    Language[this.state.selectedLanguage]['start_screen'][
                      'login'
                    ]
                  }
                </Text>
              </TouchableOpacity>

              <View style={styles.sendButtonBlockCreateAccount}>
                <Text
                  style={styles.createAccountText}
                  onPress={() => this._doRedirectCreateAccount()}>
                  {
                    Language[this.state.selectedLanguage]['start_screen'][
                      'create_account'
                    ]
                  }
                </Text>
              </View>
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

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },

  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    // height: '50%',
  },

  containerHeaderBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  containerHeaderText: {
    color: '#2B2B2B',
    fontSize: 18,
    fontWeight: '500',
    //marginTop:hp('2%')
  },
  containerHeaderSubText: {
    color: '#4a4a4a',
    fontSize: 16,
    marginTop: 10,
  },
  sendButtonBlock: {
    marginTop: 40,
    height: 50,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5ac6c6',
    elevation: 2,
  },
  createAccountText: {
    color: '#12c4cc',
    fontSize: 16,
  },

  sendButtonBlockCreateAccount: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
