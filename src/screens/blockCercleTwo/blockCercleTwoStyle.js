import { StyleSheet } from "react-native";

const blockCercleTwoStyle = StyleSheet.create({
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  mainContent: {
    padding: 20,
  },
  tableContent: {
    height: 180,
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
    color: "#4A4A4A",
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
    alignItems: "flex-start",
    width: "30%",
  },
  tableContentPaymentHistory: {
    height: 100,
    width: "100%",
    borderColor: "#ccc",
    borderRadius: 8,
    borderWidth: 0.7,
    marginTop: 30,
  },
  paymentButtonView: {
    marginTop: 30,
  },
  paymentButton: {
    width: "100%",
    borderRadius: 50,
    backgroundColor: "#5AC6C6",
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
    backgroundColor: "#E75F6D",
    alignItems: "center",
    padding: 14,
  },
  remiderButton: {
    width: "100%",
    borderRadius: 50,
    borderColor: "#5AC6C6",
    alignItems: "center",
    borderWidth: 1,
    padding: 14,
  },
  remiderText: {
    color: "#5AC6C6",
    fontSize: 18,
  },
});

export default blockCercleTwoStyle;
