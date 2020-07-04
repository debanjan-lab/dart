import { StyleSheet, Dimensions } from "react-native";
const width = Math.round(Dimensions.get("window").width);
const height = Math.round(Dimensions.get("window").height);
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const headerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  containerBackBlock: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
  },

  containerHeaderText: {
    color: "#FFFFFF",
    fontSize: 20,
    // fontFamily: 'Roboto-Reguler',
    right: 10,
  },

  containerImageBlock: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: height / 4,
    backgroundColor: "#C6F3F0",
  },

  forgotPasswordBlock: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  forgotPasswordText: {
    color: "#22e2ef",
    fontSize: 16,
    // fontFamily: 'Roboto-Reguler'
  },

  inputTextStyleActive: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    marginLeft: 5,
    borderRadius: 5,
    // fontFamily: 'Roboto-Reguler',
    color: "#000000",
    fontSize: 18,
    paddingLeft: 5,
    paddingVertical: 0,
  },

  inputTextStyleRequired: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "red",
    marginLeft: 5,
    borderRadius: 5,
    //fontFamily: 'Roboto-Reguler',
    color: "#000000",
    fontSize: 18,
    paddingLeft: 5,
    paddingVertical: 0,
  },

  sendButtonBlock: {
    marginTop: 20,
    height: 50,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5AC6C6",
    elevation: 2,
    flexDirection: "row",
  },

  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: hp("40%"),
  },
  headerMenu: {
    flexDirection: "row",
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    top: hp("3%"),
  },
  headingBold: {
    color: "#FFFFFF",
    fontSize: 18,
    // fontFamily: 'Roboto-Reguler',
    fontWeight: "600",
  },
  headingLight: {
    color: "#FFFFFF",
    fontSize: hp("2.5%"),
    // fontFamily: 'Roboto-Reguler',
    fontWeight: "200",
  },
  avatarWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  avatarImageWrapper: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eeeeee",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    top: 20,
  },
  frmInputWrapper: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  frmInputWrapperColumn: {
    marginTop: 20,
    justifyContent: "center",
  },
  headingText: {
    // fontFamily: 'Roboto-Reguler',
    fontSize: 16,
    color: "#000000",
  },
  frmLabel: {
    // fontFamily: 'Roboto-Reguler',
    fontSize: 14,
    color: "#000000",
  },
  inputTextStyleInactive: {
    flex: 1,
    borderBottomColor: "#cecece",
    borderBottomWidth: 1,
    color: "#000000",
    fontSize: hp("2.5%"),
    //  fontFamily: 'Roboto-Reguler',
    paddingVertical: 0,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    //  fontFamily: 'Roboto-Reguler'
  },
  idScan: {
    marginTop: 10,
    height: 40,
    width: wp("40%"),
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5ac6c6",
    elevation: 2,
    flexDirection: "row",
  },
  loading: {
    marginLeft: 10,
  },
  loadingCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarName: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
    top: 20,
  },
  notificationBadge: {
    bottom: 30,
    left: 15,
    height: 20,
    width: 20,
    backgroundColor: "red",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    marginLeft: 5,
    borderRadius: 5,
    //  fontFamily: 'Roboto-Reguler',
    color: "#000000",
    fontSize: 18,
    paddingLeft: 5,
    paddingVertical: 0,
  },
  textAreaInput: {
    flex: 1,
    height: 100,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 5,
    //  fontFamily: 'Roboto-Reguler',
    color: "#000000",
    fontSize: 18,
    paddingLeft: 5,
    paddingVertical: 0,
    textAlignVertical: "top",
  },
});

export default headerStyles;
