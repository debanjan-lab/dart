import NetInfo from "@react-native-community/netinfo";
import URL from "../../config/url";
import axios from "axios";
const api_url = URL.base_url;

class OtherInfo {
  appMessege = {
    internet_error: "Internet not connected",
    internet_sub:
      "Make sure Wi-Fi or cellular data is turned on, then try again.",
    server_error: "Invalid server response, please try again",
    network_error: "Can not connect to server, please check your network",
    empty_field: "Above fields are required",
    unknown_error: "Something went wrong, please try again",
    working_progress: "We're working on it and will fix as soon as we can",
    asyncStorageError: "Error: Unable to found data, please login again.",
    device_token_error: "Something went wrong, please restart your app",
    circle_not_found: "Circle not found",
    circle_sub_msg: "Please go back and refresh your tab again",
    sms_permission: "We are unable to process your request,please try again!",
  };

  checkConnection() {
    return NetInfo.fetch()
      .then((state) => {
        if (state.isConnected) {
          return Promise.resolve(true);
        } else {
          throw { status: 4, message: this.appMessege.internet_error };
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
}

class HttpService extends OtherInfo {
  postHttpCall = (senddata) => {
    const token =
      senddata.authtoken != undefined ? "Bearer " + senddata.authtoken : "";
    const option = {
      headers: { "Content-Type": "application/json", Authorization: token },
    };

    console.log("api ", api_url + senddata.url);
    return this.checkConnection()
      .then((res) => {
        return axios
          .post(api_url + senddata.url, JSON.stringify(senddata.data), option)
          .then((res) => {
            return Promise.resolve(res.data);
          })
          .catch((error) => {
            console.log(error);
            if (error.response) {
              const errorMsg = error.response.data.message;
              const networkError = errorMsg.search("Network");
              const serverError = errorMsg.search("Failed");
              if (serverError >= 0) {
                throw { status: 500, message: this.appMessege.server_error };
              }
              if (networkError >= 0) {
                throw { status: 500, message: this.appMessege.network_error };
              } else {
                throw {
                  status: error.response.status,
                  message: "Error: " + errorMsg.substr(0, 20),
                };
              }
            } else {
              const networkError = error.toString().search("Network");
              if (networkError >= 0) {
                throw { status: 500, message: this.appMessege.network_error };
              } else {
                throw { status: 500, message: this.appMessege.unknown_error };
              }
            }
          });
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  getHttpCall = (senddata) => {
    const token =
      senddata.authtoken != undefined ? "Bearer " + senddata.authtoken : "";
    const option = {
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return this.checkConnection()
      .then((res) => {
        return axios
          .get(api_url + senddata.url, option)
          .then((res) => {
            return Promise.resolve(res.data);
          })
          .catch((error) => {
            if (error.response) {
              const errorMsg = error.response.data.message;
              const networkError = errorMsg.search("Network");
              const serverError = errorMsg.search("Failed");
              if (serverError >= 0) {
                throw { status: 500, message: this.appMessege.server_error };
              }
              if (networkError >= 0) {
                throw { status: 500, message: this.appMessege.network_error };
              } else {
                throw {
                  status: error.response.status,
                  message: "Error: " + errorMsg.substr(0, 20),
                };
              }
            } else {
              const networkError = error.toString().search("Network");
              if (networkError >= 0) {
                throw { status: 500, message: this.appMessege.network_error };
              } else {
                throw { status: 500, message: this.appMessege.unknown_error };
              }
            }
          });
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };
}

export default new HttpService();
