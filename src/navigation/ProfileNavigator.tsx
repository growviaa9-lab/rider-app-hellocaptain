import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import profile screens
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import EditVehicleScreen from '../screens/profile/EditVehicleScreen';
import CityVehicleInfoScreen from '../screens/profile/CityVehicleInfoScreen';
import UploadDrivingLicenseScreen from '../screens/profile/UploadDrivingLicenseScreen';
import UploadIDCardScreen from '../screens/profile/UploadIDCardScreen';
import EKYCSuccessScreen from '../screens/profile/EKYCSuccessScreen';
import AboutUsScreen from '../screens/profile/AboutUsScreen';
import LanguageScreen from '../screens/profile/LanguageScreen';
import PrivacyScreen from '../screens/profile/PrivacyScreen';
import ShareAppScreen from '../screens/profile/ShareAppScreen';
import RateAppScreen from '../screens/profile/RateAppScreen';

// Import financial action screens
import RechargeScreen from '../screens/profile/RechargeScreen';
import WithdrawScreen from '../screens/profile/WithdrawScreen';
import DetailScreen from '../screens/profile/DetailScreen';

const ProfileStack = createStackNavigator();

const ProfileNavigator: React.FC = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <ProfileStack.Screen name="EditVehicle" component={EditVehicleScreen} />
      <ProfileStack.Screen name="EKYC" component={CityVehicleInfoScreen} />
      <ProfileStack.Screen name="CityVehicleInfo" component={CityVehicleInfoScreen} />
      <ProfileStack.Screen name="UploadDrivingLicense" component={UploadDrivingLicenseScreen} />
      <ProfileStack.Screen name="UploadIDCard" component={UploadIDCardScreen} />
      <ProfileStack.Screen name="EKYCSuccess" component={EKYCSuccessScreen} />
      <ProfileStack.Screen name="AboutUs" component={AboutUsScreen} />
      <ProfileStack.Screen name="Language" component={LanguageScreen} />
      <ProfileStack.Screen name="Privacy" component={PrivacyScreen} />
      <ProfileStack.Screen name="ShareApp" component={ShareAppScreen} />
      <ProfileStack.Screen name="RateApp" component={RateAppScreen} />
      
      {/* Financial Action Screens */}
      <ProfileStack.Screen name="Recharge" component={RechargeScreen} />
      <ProfileStack.Screen name="Withdraw" component={WithdrawScreen} />
      <ProfileStack.Screen name="Detail" component={DetailScreen} />
    </ProfileStack.Navigator>
  );
};

export default ProfileNavigator;
