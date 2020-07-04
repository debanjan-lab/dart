import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Container, Content } from "native-base";
import blockCercleThreeStyle from "./blockCercleThreeStyle";

export default class BlockCercleThreeScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container>
        <Content>
          <StatusBar backgroundColor="#1CCBE6" />
          <View style={blockCercleThreeStyle.mainContent}>
            <Text style={blockCercleThreeStyle.baseText}>
              <Text
                style={[blockCercleThreeStyle.titleText, { color: "#2B2B2B" }]}
              >
                Circle 4-{" "}
              </Text>
              <Text
                style={[blockCercleThreeStyle.titleText, { color: "#E65C6B" }]}
                numberOfLines={5}
              >
                Blocked
              </Text>
            </Text>
            <View style={blockCercleThreeStyle.tableContent}>
              <ScrollView>
                <View style={blockCercleThreeStyle.tablePart}>
                  <Text style={blockCercleThreeStyle.baseText}>
                    <Text style={blockCercleThreeStyle.titleText}>
                      Round 3-{" "}
                    </Text>
                    <Text
                      style={blockCercleThreeStyle.tableText}
                      numberOfLines={5}
                    >
                      Overdue
                    </Text>
                  </Text>
                  <View>
                    <View style={blockCercleThreeStyle.rowView}>
                      <View style={blockCercleThreeStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleThreeStyle.rowViewRightItem}>
                        <Text style={{ color: "#23CB97" }}>Paid</Text>
                      </View>
                    </View>
                    <View style={blockCercleThreeStyle.rowView}>
                      <View style={blockCercleThreeStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleThreeStyle.rowViewRightItem}>
                        <Text style={{ color: "#23CB97" }}>Paid</Text>
                      </View>
                    </View>
                    <View style={blockCercleThreeStyle.rowView}>
                      <View style={blockCercleThreeStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleThreeStyle.rowViewRightItem}>
                        <Text style={{ color: "#23CB97" }}>Paid</Text>
                      </View>
                    </View>
                    <View style={blockCercleThreeStyle.rowView}>
                      <View style={blockCercleThreeStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleThreeStyle.rowViewRightItem}>
                        <Text style={{ color: "#23CB97" }}>Paid</Text>
                      </View>
                    </View>
                    <View style={blockCercleThreeStyle.rowView}>
                      <View style={blockCercleThreeStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleThreeStyle.rowViewRightItem}>
                        <Text style={{ color: "#E15862" }}>Not paid yet</Text>
                      </View>
                    </View>
                    <View style={blockCercleThreeStyle.rowView}>
                      <View style={blockCercleThreeStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleThreeStyle.rowViewRightItem}>
                        <Text style={{ color: "#E15862" }}>Not paid yet</Text>
                      </View>
                    </View>
                    <View style={blockCercleThreeStyle.rowView}>
                      <View style={blockCercleThreeStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleThreeStyle.rowViewRightItem}>
                        <Text style={{ color: "#E15862" }}>Not paid yet</Text>
                      </View>
                    </View>
                    <View style={blockCercleThreeStyle.rowView}>
                      <View style={blockCercleThreeStyle.rowViewLeftItem}>
                        <Text>Omer</Text>
                      </View>
                      <View style={blockCercleThreeStyle.rowViewRightItem}>
                        <Text style={{ color: "#E15862" }}>Not paid yet</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={blockCercleThreeStyle.tableContentPaymentHistory}>
              <ScrollView>
                <View style={blockCercleThreeStyle.tablePart}>
                  <Text style={blockCercleThreeStyle.baseText}>
                    <Text style={blockCercleThreeStyle.titleText}>
                      Payments due 2days ago from
                    </Text>
                  </Text>
                  <View style={blockCercleThreeStyle.rowView}>
                    <View style={blockCercleThreeStyle.rowViewLeftItem}>
                      <Text>Omer</Text>
                    </View>
                  </View>
                  <View style={blockCercleThreeStyle.rowView}>
                    <View style={blockCercleThreeStyle.rowViewLeftItem}>
                      <Text>Omer</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={blockCercleThreeStyle.paymentButtonView}>
              <TouchableOpacity style={blockCercleThreeStyle.terminateButton}>
                <Text style={blockCercleThreeStyle.paymentText}>
                  Pay My Round
                </Text>
              </TouchableOpacity>
            </View>
            <View style={blockCercleThreeStyle.roundRow}>
              <ScrollView>
                <View style={blockCercleThreeStyle.tablePart}>
                  <Text style={blockCercleThreeStyle.baseText}>
                    <Text style={blockCercleThreeStyle.titleText}>
                      Round 2-{" "}
                    </Text>
                    <Text
                      style={[
                        blockCercleThreeStyle.tableText,
                        { color: "#20CC94" }
                      ]}
                      numberOfLines={5}
                    >
                      Completed
                    </Text>
                  </Text>
                  <View style={blockCercleThreeStyle.rowView}>
                    <View style={blockCercleThreeStyle.rowViewLeftItem}>
                      <Text>The receiver of round was Alian on 27.01.2019</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={blockCercleThreeStyle.roundRow}>
              <ScrollView>
                <View style={blockCercleThreeStyle.tablePart}>
                  <Text style={blockCercleThreeStyle.baseText}>
                    <Text style={blockCercleThreeStyle.titleText}>
                      Round 1-{" "}
                    </Text>
                    <Text
                      style={[
                        blockCercleThreeStyle.tableText,
                        { color: "#20CC94" }
                      ]}
                      numberOfLines={5}
                    >
                      Completed
                    </Text>
                  </Text>
                  <View style={blockCercleThreeStyle.rowView}>
                    <View style={blockCercleThreeStyle.rowViewLeftItem}>
                      <Text>The receiver of round was Alian on 27.01.2019</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}
