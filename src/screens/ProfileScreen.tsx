import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type ProfileStackParamList = {
  EditProfile: undefined;
  ChangePassword: undefined;
  EditVehicle: undefined;
  EKYC: undefined;
  CityVehicleInfo: undefined;
  UploadDrivingLicense: undefined;
  UploadIDCard: undefined;
  EKYCSuccess: undefined;
  AboutUs: undefined;
  Language: undefined;
  Privacy: undefined;
  ShareApp: undefined;
  RateApp: undefined;
  Recharge: undefined;
  Withdraw: undefined;
  Detail: undefined;
};

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const menuItems = [
    { icon: 'person', label: 'Edit Profile', iconColor: 'text-gray-600', screen: 'EditProfile' as keyof ProfileStackParamList },
    { icon: 'lock', label: 'Change Password', iconColor: 'text-yellow-500', screen: 'ChangePassword' as keyof ProfileStackParamList },
    {
      icon: 'directions-car',
      label: 'Edit Vehicle',
      iconColor: 'text-yellow-500',
      screen: 'EditVehicle' as keyof ProfileStackParamList
    },
    { icon: 'verified-user', label: 'e-KYC', iconColor: 'text-green-500', screen: 'EKYC' as keyof ProfileStackParamList },
    { icon: 'star', label: 'About Us', iconColor: 'text-gray-600', screen: 'AboutUs' as keyof ProfileStackParamList },
    { icon: 'language', label: 'Language', iconColor: 'text-gray-600', screen: 'Language' as keyof ProfileStackParamList },
    { icon: 'security', label: 'Privacy', iconColor: 'text-gray-600', screen: 'Privacy' as keyof ProfileStackParamList },
    { icon: 'share', label: 'Share App', iconColor: 'text-gray-600', screen: 'ShareApp' as keyof ProfileStackParamList },
    { icon: 'star', label: 'Rate App', iconColor: 'text-gray-600', screen: 'RateApp' as keyof ProfileStackParamList },
    { icon: 'logout', label: 'Logout', iconColor: 'text-gray-600', screen: 'Logout' },
  ];

  const financialActions = [
    {
      icon: 'account-balance-wallet',
      label: 'Recharge',
      iconColor: 'text-yellow-500',
      screen: 'Recharge' as keyof ProfileStackParamList,
    },
    { 
      icon: 'credit-card', 
      label: 'Withdraw', 
      iconColor: 'text-blue-500',
      screen: 'Withdraw' as keyof ProfileStackParamList,
    },
    { 
      icon: 'description', 
      label: 'Detail', 
      iconColor: 'text-gray-600',
      screen: 'Detail' as keyof ProfileStackParamList,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5DC" />

      {/* Profile Title */}
      <View className="px-4 py-2">
        <Text className="text-2xl font-bold text-primary uppercase">
          Profile
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* User Profile Summary */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-20 h-20 rounded-full bg-gray-200 mr-4 items-center justify-center">
              <Icon name="person" size={40} color="#666" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-black mb-1">lokik</Text>
              <Text className="text-sm text-gray-600 mb-2">
                uditpandey546@gmail.com
              </Text>
              <View className="flex-row items-center">
                <Icon name="star" size={16} color="#FFD700" />
                <Text className="text-sm text-gray-600 ml-1">4.5</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Driver Status and Balance */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-semibold text-black">
                Great Ride
              </Text>
              <Text className="text-base text-gray-600">Driver</Text>
            </View>
            <View className="items-end">
              <Text className="text-sm text-gray-600">Balance</Text>
              <Text className="text-xl font-bold text-black">₹3,482</Text>
            </View>
          </View>
        </View>

        {/* Financial Actions */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row justify-around">
            {financialActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                className="items-center"
                onPress={() => navigation.navigate(action.screen)}
              >
                <View
                  className={`w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2`}
                >
                  <Icon
                    name={action.icon}
                    size={24}
                    className={action.iconColor}
                  />
                </View>
                <Text className="text-sm text-gray-600">{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Menu Options */}
        <View className="bg-white rounded-lg shadow-sm mb-4">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center p-4 ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              onPress={() => {
                if (item.screen === 'Logout') {
                  // Handle logout
                  Alert.alert('Logout', 'Are you sure you want to logout?');
                } else if (navigation && item.screen !== 'Logout') {
                  // Navigate to sub-screen
                  navigation.navigate(item.screen as keyof ProfileStackParamList);
                }
              }}
            >
              <View
                className={`w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3`}
              >
                <Icon name={item.icon} size={20} className={item.iconColor} />
              </View>
              <Text className="flex-1 text-base text-gray-800">
                {item.label}
              </Text>
              <Icon name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
