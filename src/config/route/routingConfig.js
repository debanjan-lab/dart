import BlockCircleOneScreen from "../../screens/blockCircleOne/blockCircleOneScreen";
import AcceptInvitaionScreen from "../../screens/acceptInvitaion/acceptInvitaionScreen";
import InvitationCercleTwoScreen from "../../screens/invitationCircleTwo/invitationCercleTwoScreen";
import OnGoingCircleScreen from "../../screens/onGoingCircle/onGoingCircleScreen";
import RefusalInvitationScreen from "../../screens/refusalInvitation/refusalInvitationScreen";
import LoginScreen from "../../screens/login/loginScreen";
import ForgotPasswordScreen from "../../screens/forgotPassword/forgotPasswordScreen";
import RegisterOneScreen from "../../screens/registerOne/registerOneScreen";
import OtpVerifyScreen from "../../screens/otpVerify/otpVerifyScreen";
import RegisterTwoScreen from "../../screens/registerTwo/registerTwoScreen";
import DashboardScreen from "../../screens/dashboard/dashboardScreen";
import StartScreen from "../../screens/start/startScreen";
import MoreScreen from "../../screens/more";
import CreateCircleScreen from "../../screens/circle/create";
import SearchParticipantsScreen from "../../screens/circle/search";
import CreateCirclePreviewScreen from "../../screens/circle/createpreview";
import BankDetailsScreen from "../../screens/bankDetails/bankDetailsScreen";
import PhoneContacsScreen from "../../screens/phoneContacs/phoneContacsScreen";
import ChangeOrderParticipantsScreen from "../../screens/circle/changeorder";
import EditProfileScreen from "../../screens/profile/editProfileScreen";
import SuspendedSavingOneScreen from "../../screens/suspendedSavingOne/suspendedSavingOneScreen";
import CompletedCircle from "../../screens/circle/completedCircle";
import CompletedCircleDetails from "../../screens/circle/completedCircleDetails";

const navigationConfig = Object.create(null);



/**
 * Register all screen for navigation
 */
navigationConfig.Screen = {
  authStackScreens: {
    loginPage: {
      screen: LoginScreen,
      navigationOptions: {
        title: "Login"
      }
    },
    forgotPasswordPage: {
      screen: ForgotPasswordScreen,
      navigationOptions: {
        title: "Forgot password"
      }
    },
    registerOnePage: {
      screen: RegisterOneScreen,
      navigationOptions: {
        title: "Register one"
      }
    },
    otpVerifyPage: {
      screen: OtpVerifyScreen,
      navigationOptions: {
        title: "Otp verification"
      }
    },
    RegisterTwoPage: {
      screen: RegisterTwoScreen,
      navigationOptions: {
        title: "Register two"
      }
    },
    StartPage: {
      screen: StartScreen,
      navigationOptions: {
        title: "Start"
      }
    },
    ongingPage: {
      screen: OnGoingCircleScreen,
      path: "onging_page/:circle_code_id",
      navigationOptions: {
        title: "ongoingDetails"
      }
    }
  },




  homeStackScreens: {
    completedCircle: {
      screen: CompletedCircle,
      navigationOptions: {
        title: "Completed"
      }
    },
    completedCircleDetails: {
      screen: CompletedCircleDetails,
      navigationOptions: {
        title: "CompletedDetails"
      }
    },

    dashboardPage: {
      screen: DashboardScreen,
      navigationOptions: {
        title: "Dashboard"
      }
    },
    createCirclePage: {
      screen: CreateCircleScreen,
      navigationOptions: {
        title: "CreateCircle"
      }
    },
    searchParticipantPage: {
      screen: SearchParticipantsScreen,
      navigationOptions: {
        title: "participants"
      }
    },
    circlePreviewPage: {
      screen: CreateCirclePreviewScreen,
      navigationOptions: {
        title: "circlePreview"
      }
    },
    changeOrderPage: {
      screen: ChangeOrderParticipantsScreen,
      navigationOptions: {
        title: "changeOrder"
      }
    },
    acceptInvitaionPage: {
      screen: AcceptInvitaionScreen,
      navigationOptions: {
        title: "acceptInvitaion"
      }
    },
    bankDetailsPage: {
      screen: BankDetailsScreen,
      navigationOptions: {
        title: "bankDetails"
      }
    },
    rejectJoinPage: {
      screen: InvitationCercleTwoScreen,
      navigationOptions: {
        title: "rejectJoin"
      }
    },
    refusalPage: {
      screen: RefusalInvitationScreen,
      navigationOptions: {
        title: "refusal"
      }
    },
    ongingPage: {
      screen: OnGoingCircleScreen,
      path: "onging_page/:circle_code_id",
      navigationOptions: {
        title: "ongoingDetails"
      }
    },
    blockCircleOnePage: {
      screen: BlockCircleOneScreen,
      navigationOptions: {
        title: "blockOne"
      }
    },
    suspendedScreen: {
      screen: SuspendedSavingOneScreen,
      navigationOptions: {
        title: "Suspended"
      }
    },
    phoneContactPage: {
      screen: PhoneContacsScreen,
      navigationOptions: {
        title: "PhoneContacts"
      }
    }
  },
  moreStackScreens: {
    morePage: {
      screen: MoreScreen,
      navigationOptions: {
        title: "More"
      }
    },
    editProfile: {
      screen: EditProfileScreen,
      navigationOptions: {
        title: "Edit Profile"
      }
    }
  }


};

export default navigationConfig;
