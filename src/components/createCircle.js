import React, { Component } from 'react';

import axios from 'axios';

import URL from '../config/url';
const ApiConfig = URL;
import EventEmitter from 'react-native-eventemitter';
import CommonService from '../services/common/commonService';

import Language from '../translations/index';
class CreateCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'en',
    };
  }

  componentDidMount() {
    this.setState({
      selectedLanguage: 'fr',
    });
  }

  create(item, token, navigation) {


    let obj = {
      circle_user_id: item.circle_user_id,
      circle_code: item.circle_code,
      target_achive: item.target_achive,
      round_set: item.round_set,
      p_round: item.p_round,
      start_date: item.start_date,
      reason_for_circle: item.reason_for_circle,
    };

    let that = this;

    console.log(ApiConfig.base_url + 'create-circle');
    console.log('req', obj);

    axios
      .post(ApiConfig.base_url + 'create-circle', JSON.stringify(obj), {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(function (response) {


        //console.log("res=============================="+JSON.stringify(response))
        CommonService.showConfirmAlert(
          Language[that.state.selectedLanguage]['status'][
          response.data.message
          ],
          (response) => {
            if (response) {
              navigation.push('dashboardPage');
            }
          },
        );

      })
      .catch(function (error) {
        console.log('err', error);
      });
  }
}

export default new CreateCircle();
