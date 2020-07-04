import React, { Component } from "react";
import { View, Text } from "react-native";
import propTypes from "prop-types";

class ErrorTemplate extends Component {
  render() {
    const { message, subMessage } = this.props;
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: "red",
            textAlign: "center",
            fontWeight: "700",
            fontSize: 16,
          }}
        >
          {message}
        </Text>
        <Text style={{ fontSize: 12, textAlign: "center" }}>{subMessage}</Text>
      </View>
    );
  }
}

ErrorTemplate.propTypes = {
  message: propTypes.string,
  subMessage: propTypes.string,
};

ErrorTemplate.defaultProps = {
  subMessage: "",
  subMessage: "",
};

export { ErrorTemplate };
