import React, {Component} from 'react';
import {
  Platform,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Button,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
export default class HeaderCurve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load_api: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        load_api: false,
      });
    }, 1000);
  }
  onPressBackPage = () => {
    this.props.navigation.goBack();
  };

  render() {
    //console.log('==================lo', this.props.avatar_location);
    return (
      <View style={{height: 120}}>
        <ImageBackground
          source={require('../../../assets/images/header.png')}
          style={{width: '100%', height: '100%'}}>
          <View style={styles.headerWrapper}>
            <View style={{width: 30}}>
              {this.props.backButton && (
                <TouchableOpacity onPress={() => this.onPressBackPage()}>
                  <Image
                    source={require('../../../assets/images/arrow.png')}
                    style={{
                      width: 20,
                      height: 20,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              {!this.state.load_api && this.props.avatar_location && (
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                  source={this.props.avatar_location}
                />
              )}

              {!this.state.load_api && this.props.first_name && (
                <Text style={styles.centerText}>
                  {this.props.first_name}{' '}
                  {this.props.admin == 1 ? '(Admin)' : null}
                </Text>
              )}

              {!this.state.load_api && this.props.title && (
                <Text style={styles.centerText}>{this.props.title}</Text>
              )}
            </View>

            <View style={{width: 30}}>
              {this.props.searchIcon && (
                <TouchableOpacity onPress={() => this.props.showSearchBar()}>
                  <Image
                    source={require('../../../assets/images/search_white.png')}
                    style={{
                      width: 20,
                      height: 20,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerWrapper: {
    height: 120,
    //top: '10%',
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    //backgroundColor: 'blue',
  },
  centerText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 5,
  },
});
