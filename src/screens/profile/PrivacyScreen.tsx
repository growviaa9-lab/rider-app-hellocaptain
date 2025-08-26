import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PrivacyScreenProps {
  navigation: any;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ navigation }) => {
  // const [privacySettings, setPrivacySettings] = useState({
  //   locationSharing: true,
  //   profileVisibility: false,
  //   rideHistory: true,
  //   notifications: true,
  //   dataAnalytics: false,
  //   thirdPartySharing: false,
  //   biometricAuth: true,
  //   autoLock: true,
  // });

  // const toggleSetting = (key: keyof typeof privacySettings) => {
  //   setPrivacySettings(prev => ({
  //     ...prev,
  //     [key]: !prev[key],
  //   }));
  // };

  // const handleDeleteAccount = () => {
  //   Alert.alert(
  //     'Delete Account',
  //     'Are you sure you want to delete your account? This action cannot be undone.',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       {
  //         text: 'Delete',
  //         style: 'destructive',
  //         onPress: () => {
  //           Alert.alert(
  //             'Account Deleted',
  //             'Your account has been deleted successfully.',
  //           );
  //         },
  //       },
  //     ],
  //   );
  // };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">
          Privacy & Security
        </Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Privacy Icon */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-3">
            <Icon name="security" size={40} color="#4CAF50" />
          </View>
          <Text className="text-lg font-semibold text-gray-800">
            Privacy Settings
          </Text>
          <Text className="text-sm text-gray-600 text-center mt-2">
            Control how your data is shared and used
          </Text>
        </View>

        {/* Location & Profile Privacy
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Location & Profile</Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Location Sharing</Text>
                <Text className="text-sm text-gray-600">Share location during rides</Text>
              </View>
              <Switch
                value={privacySettings.locationSharing}
                onValueChange={() => toggleSetting('locationSharing')}
                trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
                thumbColor={privacySettings.locationSharing ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Profile Visibility</Text>
                <Text className="text-sm text-gray-600">Show profile to other users</Text>
              </View>
              <Switch
                value={privacySettings.profileVisibility}
                onValueChange={() => toggleSetting('profileVisibility')}
                trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
                thumbColor={privacySettings.profileVisibility ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        Data & Analytics
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Data & Analytics</Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Ride History</Text>
                <Text className="text-sm text-gray-600">Store your ride history</Text>
              </View>
              <Switch
                value={privacySettings.rideHistory}
                onValueChange={() => toggleSetting('rideHistory')}
                trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
                thumbColor={privacySettings.rideHistory ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Data Analytics</Text>
                <Text className="text-sm text-gray-600">Help improve app performance</Text>
              </View>
              <Switch
                value={privacySettings.dataAnalytics}
                onValueChange={() => toggleSetting('dataAnalytics')}
                trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
                thumbColor={privacySettings.dataAnalytics ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Third-party Sharing</Text>
                <Text className="text-sm text-gray-600">Share data with partners</Text>
              </View>
              <Switch
                value={privacySettings.thirdPartySharing}
                onValueChange={() => toggleSetting('thirdPartySharing')}
                trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
                thumbColor={privacySettings.thirdPartySharing ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        Security Settings
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Security</Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Biometric Authentication</Text>
                <Text className="text-sm text-gray-600">Use fingerprint or face ID</Text>
              </View>
              <Switch
                value={privacySettings.biometricAuth}
                onValueChange={() => toggleSetting('biometricAuth')}
                trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
                thumbColor={privacySettings.biometricAuth ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Auto-lock</Text>
                <Text className="text-sm text-gray-600">Lock app when inactive</Text>
              </View>
              <Switch
                value={privacySettings.autoLock}
                onValueChange={() => toggleSetting('autoLock')}
                trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
                thumbColor={privacySettings.autoLock ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        Notifications
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Notifications</Text>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-medium text-gray-800">Push Notifications</Text>
              <Text className="text-sm text-gray-600">Receive app notifications</Text>
            </View>
            <Switch
              value={privacySettings.notifications}
              onValueChange={() => toggleSetting('notifications')}
              trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
              thumbColor={privacySettings.notifications ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        Data Management
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Data Management</Text>
          
          <TouchableOpacity className="flex-row items-center p-3 border border-gray-200 rounded-lg mb-3">
            <Icon name="download" size={20} color="#4A90E2" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Download My Data</Text>
              <Text className="text-sm text-gray-600">Get a copy of your data</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-3 border border-gray-200 rounded-lg">
            <Icon name="delete" size={20} color="#F44336" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Delete My Data</Text>
              <Text className="text-sm text-gray-600">Remove all your data</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        Account Actions
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Account</Text>
          
          <TouchableOpacity className="flex-row items-center p-3 border border-gray-200 rounded-lg mb-3">
            <Icon name="logout" size={20} color="#FF9800" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Logout</Text>
              <Text className="text-sm text-gray-600">Sign out of your account</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleDeleteAccount}
            className="flex-row items-center p-3 border border-red-200 rounded-lg bg-red-50"
          >
            <Icon name="delete-forever" size={20} color="#F44336" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-red-800">Delete Account</Text>
              <Text className="text-sm text-red-600">Permanently remove account</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#F44336" />
          </TouchableOpacity>
        </View> */}

        {/* Privacy Information */}
        <View className="bg-blue-50 p-4 rounded-lg mb-4">
          <Text className="text-sm font-medium text-blue-800 mb-2">
            Your Privacy Matters
          </Text>
          <Text className="text-xs text-blue-700 leading-5">
            We are committed to protecting your privacy and ensuring the
            security of your personal data. All settings are applied immediately
            and can be changed at any time.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyScreen;
