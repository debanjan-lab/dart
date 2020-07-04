import { StyleSheet, Platform } from "react-native";

const acceptInvitaionStyle = StyleSheet.create({
  mainContent: {
    padding: 20,
  },
  headerText: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rowView: {
    flexDirection: "row",
    marginTop: 25,
  },
  rowViewLeftItem: {
    flex: 1,
    alignSelf: "flex-start",
  },
  rowViewRightItem: {
    flex: 0,
    alignSelf: "flex-end",
  },
  selectText: {
    width: 180,
    borderColor: "#ccc",
    borderRadius: 8,
    borderWidth: 0.7,
    padding: 10,
  },
  childRowView: {
    flexDirection: "row",
  },
  childRowViewLeftItem: {
    flex: 6,
    alignSelf: "flex-start",
  },
  childRowViewRightItem: {
    flex: 0,
    alignSelf: "flex-end",
  },
  borderBottom: {
    borderColor: "#ccc",
    borderBottomWidth: 0.7,
    padding: 10,
  },
  unSelectText: {
    width: 180,
    borderColor: "#ccc",
    borderRadius: 8,
    borderWidth: 0.7,
  },
  otherResonView: {
    marginTop: 20,
  },
  textInput: {
    flex: 1,
    height: 100,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 5,
    color: "#000000",
    fontSize: 18,
    paddingLeft: 5,
    paddingVertical: 0,
    textAlignVertical: "top",
  },
  paymentButtonView: {
    marginTop: 30,
  },
  paymentButton: {
    width: "100%",
    borderRadius: 50,
    backgroundColor: "#5AC6C6",
    alignItems: "center",
    padding: 16,
  },
  paymentText: {
    color: "white",
    fontSize: 18,
  },
});

export default acceptInvitaionStyle;
