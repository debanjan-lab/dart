import React, { Component, PureComponent } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Text,
  ActivityIndicator,
  Image,
} from "react-native";
import { ToastMessage } from "../../components/ToastMessage";
import StatusBarComponent from "../../components/statusBar/statusBarComponent";
import HeaderCurve from "../includes/headercurve";
import SearchBar from "react-native-searchbar";
import { Container, Content } from "native-base";
import Contacts from "react-native-contacts";
import CommonService from "../../services/common/commonService";
import Loading from "react-native-loader-overlay";
import global from "../../services/global/globalService";
import { NavigationEvents } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";

import Language from "../../translations/index";

export default class PhoneContacsScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      searchResult: [],
      contactList: false,
      defaultIcon: true,
      selectedLists: [],
      isChecked: [],
      mobile_number: "",
      mobile_country_code: "",
      allContacts: [],
      sortedContacts: [],
      isLoading: true,
      searchedList: [],
      selectLoader: false,
      selectedLanguage: "en",
      selectedLanguage: "fr",
    };
  }

  componentDidMount() {
    const { isChecked } = this.state;
    global.contacts_data.map((d) => {
      isChecked[d.rawContactId] = true;
      this.setState({ isChecked: isChecked });
    });
    this.setState({
      selectedLists: global.contacts_data,
    });
    AsyncStorage.multiGet(["mobile_number", "mobile_country_code"]).then(
      (response) => {
        console.log("mobile", response);
        this.setState({
          mobile_number: response[0][1],
          mobile_country_code: response[1][1],
        });
      }
    );
    this.getContactList();
  }

  getContactList() {
    Contacts.getAll((err, contacts) => {
      if (err !== null) {
        ToastMessage(err);
      } else {
        try {
          console.log(contacts);
          this.setState({ allContacts: contacts }, () => {
            this._getSortByLimit();
          });
        } catch (err) {}
      }
    });
  }

  _getSortByLimit = () => {
    let arrContacts = [];
    for (var a = 0; a < this.state.allContacts.length; a++) {
      let obj = {};
      let displayName = this.state.allContacts[a].displayName;
      let givenName = this.state.allContacts[a].givenName;
      let rawContactId = this.state.allContacts[a].rawContactId;
      let phoneNumbers = this.state.allContacts[a].phoneNumbers[0]
        ? this.state.allContacts[a].phoneNumbers[0].number
        : "";
      if (phoneNumbers) {
        phoneNumbers = phoneNumbers.split(".").join("");
        phoneNumbers = phoneNumbers.split(" ").join("");
        phoneNumbers = phoneNumbers.split("-").join("");
        phoneNumbers = phoneNumbers.split("(").join("");
        phoneNumbers = phoneNumbers.split(")").join("");
        obj["displayName"] = displayName;
        obj["givenName"] = givenName;
        obj["phoneNumber"] = phoneNumbers;
        obj["key"] = a + 1;
        obj["rawContactId"] = rawContactId;
        arrContacts.push(obj);
      }
    }
    let sortedContact = arrContacts.sort(function(a, b) {
      var nameA = a.displayName.toUpperCase(); // ignore upper and lowercase
      var nameB = b.displayName.toUpperCase();
      if (nameA < nameB) {
        return -1;
      } else {
        return 1;
      }
    });
    this.setState(
      {
        sortedContacts: sortedContact,
        searchedList: sortedContact,
        isLoading: false,
      },
      () => {
        console.log("arrContacts===" + JSON.stringify(arrContacts));
      }
    );
  };

  showSearchBar = () => {
    this.setState({ defaultIcon: false });
    this.searchBar.show();
  };

  hideSearchBar() {
    this.props.navigation.goBack();
  }

  search = (searchText) => {
    if (searchText.length > 0) {
      const newData = this.state.sortedContacts.filter((item) => {
        const itemData = `${item.displayName.toUpperCase()}`;
        const textData = searchText.trim().toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        searchedList: newData,
      });
    } else {
      this.setState({
        searchedList: this.state.sortedContacts,
      });
    }
  };

  chooseContact = (item, mobile, index) => {
    var mobile = mobile.trim();
    let mobileNumber = "";
    if (mobile[0] === "0") {
      if (mobile[1] === "6" || mobile[1] === "7") {
        mobileNumber = mobile.replace("0", this.state.mobile_country_code);
      } else {
        //Alert.alert("",`Not a valid number 1 , selected phone number ${mobile} , position of "mobile[1]" is ${mobile[1]}`);
        Alert.alert(`Not a valid number`);
      }
    } else if (mobile.indexOf(this.state.mobile_country_code) > -1) {
      mobileNumber = mobile;
      //Alert.alert("",`Not a valid number 2 , selected phone number ${mobileNumber} , position of "+33" is ${mobile.indexOf('+33')}`);
    } else {
      //Alert.alert("",`Not a valid number 3 , selected phone number ${mobile} , position of "+33" is ${mobile.indexOf('+33')}`);
    }

    if (mobileNumber !== "") {
      let myContact = mobileNumber.match(this.state.mobile_number);
      if (myContact == null) {
        this.setState({ selectLoader: true });
        let all = this.state.searchedList;
        if (!this.state.selectedLists.includes(item.rawContactId)) {
          this.setState(
            { selectedLists: [...this.state.selectedLists, item.rawContactId] },
            () => {
              this.setState({
                searchedList: all,
                selectLoader: false,
              });
            }
          );
        } else {
          var array = [...this.state.selectedLists];
          var index = array.indexOf(item.rawContactId);
          if (index !== -1) {
            array.splice(index, 1);
            this.setState({ selectedLists: array }, () => {
              this.setState({
                searchedList: all,
                selectLoader: false,
              });
            });
          }
        }
      } else {
        //Alert.alert("You can't choose your own number");
      }
    } else {
      //Alert.alert("",`Not a valid number 4 , selected phone number ${mobile} , my country code ${this.state.mobile_country_code}`);
      // Alert.alert(`Not a valid number`);
    }
  };

  submitContactsData = () => {
    let list = global.perticipant_info;
    for (let a = 0; a < this.state.sortedContacts.length; a++) {
      var rawContactIdA = this.state.sortedContacts[a].rawContactId;
      for (let b = 0; b < this.state.selectedLists.length; b++) {
        var rawContactIdB = this.state.selectedLists[b];
        if (rawContactIdB == rawContactIdA) {
          let obj = {};
          obj["username"] = this.state.sortedContacts[a]["displayName"];
          obj["givenName"] = this.state.sortedContacts[a]["givenName"];
          obj["mobile"] = this.state.sortedContacts[a]["phoneNumber"];
          obj["rawContactId"] = rawContactIdB;

          let find = list.find((x) => x.mobile === obj["mobile"]);
          if (!find) {
            list.push(obj);
          }
          //console.log("find==="+JSON.stringify(find))
          // for (var i=0; i < list.length; i++) {
          //   if (list[i].mobile != obj['mobile']) {
          //     list.push(obj)
          //     console.log("list[i].mobile=="+list[i].mobile);
          //     console.log("obj['mobile']=="+obj['mobile']);
          //   }
          // }
        }
      }
    }

    console.log("list==========" + JSON.stringify(list));
    console.log(
      "global.perticipant_info==========" +
        JSON.stringify(global.perticipant_info)
    );

    global.contacts_data = this.state.selectedLists;
    global.perticipant_info = list;
    global.update_contact_data = true;
    this.props.navigation.goBack();
  };

  render() {
    console.log("mobile_country_code", this.state.mobile_country_code);
    return (
      <Container>
        <Content>
          <StatusBarComponent />
          <View style={{ flex: 1, position: "relative", height: 120 }}>
            {this.state.defaultIcon ? (
              <HeaderCurve
                title={
                  Language[this.state.selectedLanguage]["phone_contact_screen"][
                    "phone_contacts"
                  ]
                }
                navigation={this.props.navigation}
                searchIcon={true}
                showSearchBar={this.showSearchBar}
                backButton={true}
                bellIcon={true}
              />
            ) : (
              <HeaderCurve
                navigation={this.props.navigation}
                searchIcon={true}
                showSearchBar={this.showSearchBar}
                bellIcon={false}
              />
            )}
            <SearchBar
              ref={(ref) => (this.searchBar = ref)}
              handleChangeText={this.search}
              backgroundColor={"transparent"}
              iconColor={"white"}
              textColor={"white"}
              placeholderTextColor={"white"}
              heightAdjust={16}
              onBack={() => this.hideSearchBar()}
            />
          </View>

          {this.state.selectLoader && <ActivityIndicator />}

          {!this.state.isLoading ? (
            <View>
              <FlatList
                data={this.state.searchedList}
                renderItem={({ item }) =>
                  this.listItem(item, this.state.selectedLists)
                }
                keyExtractor={(item) => item.key.toString()}
                removeClippedSubviews={true}
                extraData={this.state}
              />
            </View>
          ) : (
            <ActivityIndicator />
          )}
        </Content>

        {this.state.selectedLists.length ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.submitContactsData()}
            style={{
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: 50,
              right: 30,
            }}
          >
            <Image
              source={require("../../../assets/images/tick_fill.png")}
              style={{
                width: 50,
                height: 50,
              }}
            />
          </TouchableOpacity>
        ) : null}
      </Container>
    );
  }

  listItem(item, selectedLists) {
    return (
      <View
        style={{
          flexDirection: "row",
          height: 50,
          marginTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../../assets/images/profile_place_holder.png")}
          style={{
            width: 50,
            height: 50,
          }}
        />

        <View
          style={{
            flex: 1,
            paddingLeft: 10,
            padding: 2,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500" }}>
            {item.displayName}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "500" }}>
            {item.phoneNumber}
          </Text>
        </View>

        <View style={{ width: 25 }}>
          {selectedLists.includes(item.rawContactId) ? (
            <TouchableOpacity
              onPress={() =>
                this.chooseContact(item, item.phoneNumber, item.key)
              }
            >
              <Image
                source={require("../../../assets/images/success.png")}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                this.chooseContact(item, item.phoneNumber, item.key)
              }
            >
              <Image
                source={require("../../../assets/images/circle.png")}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}
