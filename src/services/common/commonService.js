import colorCode from '../../config/commonColor';
import {Alert, Linking, NativeModules, PermissionsAndroid} from 'react-native';
import {ToastMessage} from '../../components/ToastMessage';
import global from '../../services/global/globalService';

let DirectSms = NativeModules.DirectSms;
class CommonService {
  defaultImagePath = '../../../assets/images/edit.png';
  loaderObj = {
    color: colorCode.lightBlue,
    size: 50,
    overlayColor: 'transparent',
    closeOnTouch: false,
    loadingType: 'Spinner',
  };

  formatDate(date) {
    let newdate = date.split(/-|\./);
    return newdate[2] + '/' + newdate[1] + '/' + newdate[0];
  }

  allInOneFormatDate(date, delimiter, separator, order) {
    let newdate = date.split(delimiter);
    if (order == 'default') {
      return newdate[0] + separator + newdate[1] + separator + newdate[2];
    }
    if (order == 'reverse') {
      return newdate[2] + separator + newdate[1] + separator + newdate[0];
    }
  }

  getDate() {
    let newdate = new Date();
    let day = newdate.getDate();
    let month = newdate.getMonth() + 1;
    let year = newdate.getFullYear();
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return day + '/' + month + '/' + year;
  }

  getDateMonthFirst() {
    let newdate = new Date();
    let day = newdate.getDate();
    let month = newdate.getMonth() + 1;
    let year = newdate.getFullYear();
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return month + '/' + day + '/' + year;
  }

  formatDateMontFirst(date) {
    let newdate = date.split('/');
    return newdate[1] + '/' + newdate[0] + '/' + newdate[2];
  }

  getPercentage(completedRound, estimateRound) {
    let roundPercent = (completedRound / estimateRound) * 100;
    return Math.round(roundPercent);
  }

  showConfirmAlert = (msg, cb) => {
    Alert.alert(
      '',
      msg,
      [
        {
          text: 'OK',
          onPress: () => {
            cb(true);
          },
        },
      ],
      {cancelable: false},
    );
  };

  __showConfirmAlert = (obj, callback) => {
    let msg =
      obj.message == undefined
        ? 'Are you sure you want to continue?'
        : obj.message;
    let title = obj.title == undefined ? '' : obj.title;
    let cancelTxt = obj.cancelTxt == undefined ? 'Cancel' : obj.cancelTxt;
    let submitTxt = obj.submitTxt == undefined ? 'OK' : obj.submitTxt;
    Alert.alert(
      title,
      msg,
      [
        {text: cancelTxt, onPress: () => callback(false), style: 'cancel'},
        {text: submitTxt, onPress: () => callback(true)},
      ],
      {cancelable: false},
    );
  };

  showSimpleAlert = (msg) => {
    Alert.alert('', msg);
  };

  openWhatsApp = (countryCode, whatsapp_no) => {
    //whatsapp_no = '643387373';
    // countryCode = '0';
    if (countryCode == '0') {
      countryCode = '+33';
    }
    let substrCountryCode = countryCode.substr(1);
    let phoneNo = substrCountryCode + whatsapp_no;
    const url = `whatsapp://send?phone=${phoneNo}`;
    //alert(phoneNo);
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            'WhatsApp',
            'WhatsApp is not installed. Opening on web page',
            [{text: 'Ok', onPress: () => this.openWebWhatsApp()}],
          );
        }
      })
      .catch((err) => alert(err));
    Linking.openURL(`whatsapp://send?&phone=${phoneNo}`);
  };

  openWebWhatsApp = () => {
    Linking.openURL('http://api.whatsapp.com/');
  };

  async getSmsPermission(cb) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        cb(true);
      } else {
        cb(false);
      }
    } catch (err) {
      cb(false);
    }
  }

  async sendDirectSms(mobile_number, message) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        DirectSms.sendDirectSms(mobile_number, message);
      } else {
      }
    } catch (err) {
      ToastMessage(err.message);
    }
  }

  resetDataForLaunchNewCircle() {
    global.contacts_data = [];
    global.perticipant_info = [];
    global.update_contact_data = false;
    global.phone_data = null;
  }
}
export default new CommonService();
