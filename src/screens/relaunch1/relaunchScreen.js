import React, { Component } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Container, Content } from "native-base";
import relaunchStyle from "./relaunchStyle";
import Icon from "react-native-vector-icons/Ionicons";

export default class RelaunchScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Content>
          <StatusBar backgroundColor="#1CCBE6" />
          <View style={relaunchStyle.mainContent}>
            <View style={relaunchStyle.headerText}>
              <Text style={relaunchStyle.title}>Circle xxx Refused</Text>
            </View>
            <View style={{ marginTop: 25 }}>
              <View style={relaunchStyle.rowView}>
                <View style={relaunchStyle.rowViewLeftItem}>
                  <Text style={relaunchStyle.rowText}>Target to achieve:</Text>
                </View>
                <View style={relaunchStyle.rowViewRightItem}>
                  <Text style={relaunchStyle.rowTextValue}>$3000</Text>
                </View>
              </View>
              <View style={relaunchStyle.rowView}>
                <View style={relaunchStyle.rowViewLeftItem}>
                  <Text style={relaunchStyle.rowText}>Round Settlement:</Text>
                </View>
                <View style={relaunchStyle.rowViewRightItem}>
                  <Text style={relaunchStyle.rowTextValue}>$250</Text>
                </View>
              </View>
              <View style={relaunchStyle.rowView}>
                <View style={relaunchStyle.rowViewLeftItem}>
                  <Text style={relaunchStyle.rowText}>
                    Periodisity of round:
                  </Text>
                </View>
                <View style={relaunchStyle.rowViewRightItem}>
                  <Text style={relaunchStyle.rowTextValue}>Bi-weekly</Text>
                </View>
              </View>
              <View style={relaunchStyle.rowView}>
                <View style={relaunchStyle.thPadding}>
                  <Text style={relaunchStyle.rowText}>
                    Personal reason for the circle:
                  </Text>
                  <Text style={relaunchStyle.rowTextValue}>Buy a car</Text>
                </View>
              </View>
              <View style={relaunchStyle.rowView}>
                <View style={relaunchStyle.rowViewLeftItem}>
                  <Text style={relaunchStyle.rowText}>Wishing start date:</Text>
                </View>
                <View style={relaunchStyle.rowViewRightItem}>
                  <Text style={relaunchStyle.rowTextValue}>26.06.2019</Text>
                </View>
              </View>
              <View style={{ paddingTop: 20 }}>
                <Text style={relaunchStyle.rowText}>Circle participants:</Text>
                <View style={[relaunchStyle.rowViewNew, { paddingBottom: 20 }]}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={relaunchStyle.nextRowViewLeftItem}>
                      <Text style={relaunchStyle.rowTextValue}>
                        1.Jhon 12.45.12.124.45
                      </Text>
                    </View>
                    <View style={relaunchStyle.rowViewMiddleItem}>
                      <Icon
                        name="ios-checkmark-circle-outline"
                        size={20}
                        color="#5AC6C6"
                      />
                    </View>
                    <View style={relaunchStyle.nextRowViewRightItem}>
                      <Icon name="logo-whatsapp" size={20} color="#64B161" />
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={relaunchStyle.nextRowViewLeftItem}>
                      <Text style={relaunchStyle.rowTextValue}>
                        1.Jhon 12.45.12.124.45
                      </Text>
                    </View>
                    <View style={relaunchStyle.rowViewMiddleItem}>
                      <Icon
                        name="ios-checkmark-circle-outline"
                        size={20}
                        color="#5AC6C6"
                      />
                    </View>
                    <View style={relaunchStyle.nextRowViewRightItem}>
                      <Icon name="logo-whatsapp" size={20} color="#64B161" />
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={relaunchStyle.nextRowViewLeftItem}>
                      <Text style={relaunchStyle.rowTextValue}>
                        1.Jhon 12.45.12.124.45
                      </Text>
                    </View>
                    <View style={relaunchStyle.rowViewMiddleItem}>
                      <Icon
                        name="ios-close-circle-outline"
                        size={20}
                        color="#E65C6B"
                      />
                    </View>
                    <View style={relaunchStyle.nextRowViewRightItem}>
                      <Icon name="logo-whatsapp" size={20} color="#64B161" />
                    </View>
                  </View>
                </View>
              </View>
              <View style={relaunchStyle.rowView}>
                <View style={relaunchStyle.thPadding}>
                  <Text style={relaunchStyle.rowText}>Reason for Refusal:</Text>
                  <Text style={relaunchStyle.rowTextValue}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s
                  </Text>
                </View>
              </View>
              <View style={relaunchStyle.sendButtonView}>
                <TouchableOpacity style={relaunchStyle.sendButton}>
                  <Text style={relaunchStyle.sendButtonText}>
                    {"Adapt & Relaunch"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}
