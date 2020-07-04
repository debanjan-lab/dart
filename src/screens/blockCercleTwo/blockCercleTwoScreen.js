import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Container, Content } from "native-base";
import blockCercleTwoStyle from "./blockCercleTwoStyle";
export default class BlockCercleTwoScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Content>
          <StatusBar backgroundColor="#1CCBE6" />
          <View style={blockCercleTwoStyle.mainContent}>
            <Text style={blockCercleTwoStyle.baseText}>
              <Text
                style={[blockCercleTwoStyle.titleText, { color: "#2B2B2B" }]}
              >
                Circle 4-{" "}
              </Text>
              <Text
                style={[blockCercleTwoStyle.titleText, { color: "#E65C6B" }]}
                numberOfLines={5}
              >
                Blocked
              </Text>
            </Text>
            <View style={blockCercleTwoStyle.tableContent}>
              <ScrollView>
                <View style={blockCercleTwoStyle.tablePart}>
                  <Text style={blockCercleTwoStyle.baseText}>
                    <Text style={blockCercleTwoStyle.titleText}>Round 3- </Text>
                    <Text
                      style={blockCercleTwoStyle.tableText}
                      numberOfLines={5}
                    >
                      Overdue
                    </Text>
                  </Text>
                  <View>
                    <View style={blockCercleTwoStyle.rowView}>
                      <View style={blockCercleTwoStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleTwoStyle.rowViewRightItem}>
                        <Text style={{ color: "#23CB97" }}>Paid</Text>
                      </View>
                    </View>
                    <View style={blockCercleTwoStyle.rowView}>
                      <View style={blockCercleTwoStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleTwoStyle.rowViewRightItem}>
                        <Text style={{ color: "#23CB97" }}>Paid</Text>
                      </View>
                    </View>
                    <View style={blockCercleTwoStyle.rowView}>
                      <View style={blockCercleTwoStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleTwoStyle.rowViewRightItem}>
                        <Text style={{ color: "#23CB97" }}>Paid</Text>
                      </View>
                    </View>
                    <View style={blockCercleTwoStyle.rowView}>
                      <View style={blockCercleTwoStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleTwoStyle.rowViewRightItem}>
                        <Text style={{ color: "#23CB97" }}>Paid</Text>
                      </View>
                    </View>
                    <View style={blockCercleTwoStyle.rowView}>
                      <View style={blockCercleTwoStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleTwoStyle.rowViewRightItem}>
                        <Text style={{ color: "#E15862" }}>Not paid yet</Text>
                      </View>
                    </View>
                    <View style={blockCercleTwoStyle.rowView}>
                      <View style={blockCercleTwoStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleTwoStyle.rowViewRightItem}>
                        <Text style={{ color: "#E15862" }}>Not paid yet</Text>
                      </View>
                    </View>
                    <View style={blockCercleTwoStyle.rowView}>
                      <View style={blockCercleTwoStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleTwoStyle.rowViewRightItem}>
                        <Text style={{ color: "#E15862" }}>Not paid yet</Text>
                      </View>
                    </View>
                    <View style={blockCercleTwoStyle.rowView}>
                      <View style={blockCercleTwoStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleTwoStyle.rowViewRightItem}>
                        <Text style={{ color: "#E15862" }}>Not paid yet</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={blockCercleTwoStyle.tableContentPaymentHistory}>
              <ScrollView>
                <View style={blockCercleTwoStyle.tablePart}>
                  <Text style={blockCercleTwoStyle.baseText}>
                    <Text style={blockCercleTwoStyle.titleText}>
                      Payments due 2days ago from
                    </Text>
                  </Text>
                  <View style={blockCercleTwoStyle.rowView}>
                    <View style={blockCercleTwoStyle.rowViewLeftItem}>
                      <Text>Omer</Text>
                    </View>
                  </View>
                  <View style={blockCercleTwoStyle.rowView}>
                    <View style={blockCercleTwoStyle.rowViewLeftItem}>
                      <Text>Omer</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={blockCercleTwoStyle.paymentButtonView}>
              <TouchableOpacity style={blockCercleTwoStyle.paymentButton}>
                <Text style={blockCercleTwoStyle.paymentText}>
                  Call the Admin for Action
                </Text>
              </TouchableOpacity>
            </View>
            <View style={blockCercleTwoStyle.paymentButtonView}>
              <TouchableOpacity style={blockCercleTwoStyle.remiderButton}>
                <Text style={blockCercleTwoStyle.remiderText}>
                  Send Remiders
                </Text>
              </TouchableOpacity>
            </View>
            <View style={blockCercleTwoStyle.roundRow}>
              <ScrollView>
                <View style={blockCercleTwoStyle.tablePart}>
                  <Text style={blockCercleTwoStyle.baseText}>
                    <Text style={blockCercleTwoStyle.titleText}>Round 2- </Text>
                    <Text
                      style={[
                        blockCercleTwoStyle.tableText,
                        { color: "#20CC94" }
                      ]}
                      numberOfLines={5}
                    >
                      Completed
                    </Text>
                  </Text>
                  <View style={blockCercleTwoStyle.rowView}>
                    <View style={blockCercleTwoStyle.rowViewLeftItem}>
                      <Text>The receiver of round was Alian on 27.01.2019</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={blockCercleTwoStyle.roundRow}>
              <ScrollView>
                <View style={blockCercleTwoStyle.tablePart}>
                  <Text style={blockCercleTwoStyle.baseText}>
                    <Text style={blockCercleTwoStyle.titleText}>Round 1- </Text>
                    <Text
                      style={[
                        blockCercleTwoStyle.tableText,
                        { color: "#20CC94" }
                      ]}
                      numberOfLines={5}
                    >
                      Completed
                    </Text>
                  </Text>
                  <View style={blockCercleTwoStyle.rowView}>
                    <View style={blockCercleTwoStyle.rowViewLeftItem}>
                      <Text>The receiver of round was Alian on 27.01.2019</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={blockCercleTwoStyle.paymentButtonView}>
              <TouchableOpacity style={blockCercleTwoStyle.terminateButton}>
                <Text style={blockCercleTwoStyle.paymentText}>
                  Request Terminate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}
