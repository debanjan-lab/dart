import URL from '../../config/url';
import axios from 'axios';
const api_url = URL.base_url;

class OtherInfo {}

class HttpService extends OtherInfo {
  postHttpCall = (senddata) => {
    const token =
      senddata.authtoken != undefined ? 'Bearer ' + senddata.authtoken : '';
    const option = {
      headers: {'Content-Type': 'application/json', Authorization: token},
    };

    console.log('api ', api_url + senddata.url);
    console.log('token ', token);

    return axios
      .post(api_url + senddata.url, JSON.stringify(senddata.data), option)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getHttpCall = (senddata) => {
    const token =
      senddata.authtoken != undefined ? 'Bearer ' + senddata.authtoken : '';
    const option = {
      headers: {'Content-Type': 'application/json', Authorization: token},
    };

    return axios
      .get(api_url + senddata.url, option)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((error) => {});
  };
}

export default new HttpService();
