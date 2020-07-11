import React, { Component } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import invitationCercleOneStyle from "./invitationCercleOneStyle";

export default class InvitationCercleOneScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <View>
          <StatusBar backgroundColor="#1CCBE6" />
          <View style={invitationCercleOneStyle.mainContent}>
            <View style={invitationCercleOneStyle.headerText}>
              <Text style={invitationCercleOneStyle.title}>
                Circle xxx Waiting
              </Text>
            </View>
            <View style={{ marginTop: 25 }}>
              <View style={invitationCercleOneStyle.rowView}>
                <View style={invitationCercleOneStyle.rowViewLeftItem}>
                  <Text style={invitationCercleOneStyle.rowText}>
                    Target to achieve:
                  </Text>
                </View>
                <View style={invitationCercleOneStyle.rowViewRightItem}>
                  <Text style={invitationCercleOneStyle.rowTextValue}>
                    $3000
                  </Text>
                </View>
              </View>
              <View style={invitationCercleOneStyle.rowView}>
                <View style={invitationCercleOneStyle.rowViewLeftItem}>
                  <Text style={invitationCercleOneStyle.rowText}>
                    Round Settlement:
                  </Text>
                </View>
                <View style={invitationCercleOneStyle.rowViewRightItem}>
                  <Text style={invitationCercleOneStyle.rowTextValue}>
                    $250
                  </Text>
                </View>
              </View>
              <View style={invitationCercleOneStyle.rowView}>
                <View style={invitationCercleOneStyle.rowViewLeftItem}>
                  <Text style={invitationCercleOneStyle.rowText}>
                    Periodisity of round:
                  </Text>
                </View>
                <View style={invitationCercleOneStyle.rowViewRightItem}>
                  <Text style={invitationCercleOneStyle.rowTextValue}>
                    Bi-weekly
                  </Text>
                </View>
              </View>
              <View style={invitationCercleOneStyle.rowView}>
                <View style={invitationCercleOneStyle.thPadding}>
                  <Text style={invitationCercleOneStyle.rowText}>
                    Personal reason for the circle:
                  </Text>
                  <Text style={invitationCercleOneStyle.rowTextValue}>
                    Buy a car
                  </Text>
                </View>
              </View>
              <View style={invitationCercleOneStyle.rowView}>
                <View style={invitationCercleOneStyle.rowViewLeftItem}>
                  <Text style={invitationCercleOneStyle.rowText}>
                    Wishing start date:
                  </Text>
                </View>
                <View style={invitationCercleOneStyle.rowViewRightItem}>
                  <Text style={invitationCercleOneStyle.rowTextValue}>
                    26.06.2019
                  </Text>
                </View>
              </View>
              <View style={{ paddingTop: 20 }}>
                <Text style={invitationCercleOneStyle.rowText}>
                  Circle participants:
                </Text>
                <View
                  style={[
                    invitationCercleOneStyle.rowViewNew,
                    { paddingBottom: 20 },
                  ]}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View style={invitationCercleOneStyle.nextRowViewLeftItem}>
                      <Text style={invitationCercleOneStyle.rowTextValue}>
                        1.Jhon 12.45.12.124.45
                      </Text>
                    </View>
                    <View style={invitationCercleOneStyle.rowViewMiddleItem}>
                      <Icon
                        name="ios-checkmark-circle-outline"
                        size={20}
                        color="#5AC6C6"
                      />
                    </View>
                    <View style={invitationCercleOneStyle.nextRowViewRightItem}>
                      <Icon name="logo-whatsapp" size={20} color="#64B161" />
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={invitationCercleOneStyle.nextRowViewLeftItem}>
                      <Text style={invitationCercleOneStyle.rowTextValue}>
                        1.Jhon 12.45.12.124.45
                      </Text>
                    </View>
                    <View style={invitationCercleOneStyle.rowViewMiddleItem}>
                      <Icon
                        name="ios-checkmark-circle-outline"
                        size={20}
                        color="#5AC6C6"
                      />
                    </View>
                    <View style={invitationCercleOneStyle.nextRowViewRightItem}>
                      <Icon name="logo-whatsapp" size={20} color="#64B161" />
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={invitationCercleOneStyle.nextRowViewLeftItem}>
                      <Text style={invitationCercleOneStyle.rowTextValue}>
                        1.Jhon 12.45.12.124.45
                      </Text>
                    </View>
                    <View style={invitationCercleOneStyle.rowViewMiddleItem}>
                      <Icon
                        name="ios-checkmark-circle-outline"
                        size={20}
                        color="#5AC6C6"
                      />
                    </View>
                    <View style={invitationCercleOneStyle.nextRowViewRightItem}>
                      <Icon name="logo-whatsapp" size={20} color="#64B161" />
                    </View>
                  </View>
                </View>
              </View>
              <View style={invitationCercleOneStyle.rowView}>
                <View style={invitationCercleOneStyle.rowViewLeftItem}>
                  <Text style={invitationCercleOneStyle.rowText}>
                    Number of expected rounds:
                  </Text>
                </View>
                <View style={invitationCercleOneStyle.rowViewRightItem}>
                  <Text style={invitationCercleOneStyle.rowTextValue}>12</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={invitationCercleOneStyle.rowViewLeftItem}>
                  <Text style={invitationCercleOneStyle.rowText}>
                    Expected end date:
                  </Text>
                </View>
                <View style={invitationCercleOneStyle.rowViewRightItem}>
                  <Text style={invitationCercleOneStyle.rowTextValue}>
                    26.12.2019
                  </Text>
                </View>
              </View>
              <View style={invitationCercleOneStyle.sendButtonView}>
                <TouchableOpacity style={invitationCercleOneStyle.sendButton}>
                  <Text style={invitationCercleOneStyle.sendButtonText}>
                    Send Reminder
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
