import { StyleSheet } from "react-native";

const suspendedSavingOneStyle = StyleSheet.create({
  thPadding: {
    paddingBottom: 20,
    paddingTop: 20
  },
  thView: {
    backgroundColor: "#5AC6C6",
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    borderColor: "#ccc",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  tableContainer: {
    borderWidth: 0.75,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 10
  },
  tdView: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    borderTopWidth: 0.75,
    borderColor: "#ccc"
  },
  rowViewCommon: {
    borderColor: "#ccc",
    borderRightWidth: 0.5
  },
  thText: {
    fontSize: 12,
    paddingTop: 5,
    paddingBottom: 5,
    alignSelf: "center"
  },
  thTextNotPaid: {
    fontSize: 12,
    paddingTop: 5,
    paddingBottom: 5,
    alignSelf: "center",
    color: "red"
  },
  mainContent: {
    padding: 20
  },
  headerText: {
    marginTop: 50,
    alignItems: "center",
    backgroundColor: "red"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  rowView: {
    flexDirection: "row",
    borderColor: "#ccc",
    borderBottomWidth: 0.5
  },
  rowViewLeftItem: {
    flex: 5,
    alignSelf: "flex-start",
    paddingBottom: 20,
    paddingTop: 20
  },
  rowViewRightItem: {
    flex: 0,
    alignSelf: "flex-end",
    paddingBottom: 20,
    paddingTop: 20
  },
  rowText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#494949"
  },
  rowTextValue: {
    color: "#4A4A4A"
  },
  thPadding: {
    paddingBottom: 20,
    paddingTop: 20
  },
  nextRowViewLeftItem: {
    width: "70%"
  },
  nextRowViewRightItem: {
    width: "10%",
    alignItems: "flex-end"
  },
  rowViewMiddleItem: {
    width: "20%",
    alignItems: "flex-start"
  },
  rowViewNew: {
    borderColor: "#ccc",
    borderBottomWidth: 0.5
  },
  sendButtonView: {
    marginTop: 20
  },
  sendButton: {
    width: "100%",
    borderRadius: 50,
    backgroundColor: "#5AC6C6",
    alignItems: "center",
    padding: 14,
    flexDirection: "row",
    justifyContent: "center"
  },
  sendButtonText: {
    color: "white",
    fontSize: 18
  },
  sendButtonText1: {
    color: "#5AC6C6",
    fontSize: 18
  }
});

export default suspendedSavingOneStyle;
