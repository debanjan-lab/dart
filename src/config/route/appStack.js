import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import BlockCircleOneScreen from "../../screens/blockCircleOne/blockCircleOneScreen";
import AcceptInvitaionScreen from "../../screens/acceptInvitaion/acceptInvitaionScreen";
import InvitationCercleTwoScreen from "../../screens/invitationCircleTwo/invitationCercleTwoScreen";
import OnGoingCircleScreen from "../../screens/onGoingCircle/onGoingCircleScreen";
import RefusalInvitationScreen from "../../screens/refusalInvitation/refusalInvitationScreen";
import ForgotPasswordScreen from "../../screens/forgotPassword/forgotPasswordScreen";
import RegisterOneScreen from "../../screens/registerOne/registerOneScreen";
import OtpVerifyScreen from "../../screens/otpVerify/otpVerifyScreen";
import RegisterTwoScreen from "../../screens/registerTwo/registerTwoScreen";
import DashboardScreen from "../../screens/dashboard/dashboardScreen";
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



const AppNavigator = createStackNavigator({
    CompletedCircle: {
        screen: CompletedCircle,
    },
    CompletedCircleDetails: {
        screen: CompletedCircleDetails,
    },
});

export default createAppContainer(AppNavigator);
