import { StyleSheet } from "react-native";
const onGoingCircleStyle = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  titleTextValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  rowTextValue: {
    color: "#4A4A4A",
  },
  mainContent: {
    padding: 20,
    // marginTop:
  },
  tableContent: {
    width: "100%",
    borderColor: "#ccc",
    borderRadius: 8,
    borderWidth: 0.7,
    marginTop: 10,
  },
  tablePart: {
    padding: 10,
  },
  tableText: {
    fontSize: 15,
  },
  rowView: {
    flexDirection: "row",
    marginTop: 5,
  },
  rowViewLeftItem: {
    alignItems: "flex-start",
    width: "70%",
  },
  rowViewRightItem: {
    width: "30%",
    alignItems: "flex-start",
  },
  tableContentPaymentHistory: {
    height: 100,
    width: "100%",
    borderColor: "#ccc",
    borderRadius: 8,
    borderWidth: 0.7,
    marginTop: 30,
  },
  tableContentReceiverHistory: {
    width: "100%",
    borderColor: "#ccc",
    borderRadius: 8,
    borderWidth: 0.7,
    marginTop: 30,
    padding: 10,
  },
  paymentButtonView: {
    marginTop: 30,
  },
  paymentButton: {
    width: "100%",
    borderRadius: 50,
    backgroundColor: "#24D19B",
    alignItems: "center",
    padding: 14,
  },
  paymentText: {
    color: "white",
    fontSize: 18,
  },
  roundRow: {
    width: "100%",
    borderColor: "#ccc",
    borderRadius: 8,
    borderWidth: 0.7,
    marginTop: 30,
  },
  terminateButton: {
    width: "100%",
    borderRadius: 50,
    backgroundColor: "#24D19B",
    alignItems: "center",
    padding: 14,
    justifyContent: "center",
    flexDirection: "row",
  },
});

export default onGoingCircleStyle;
