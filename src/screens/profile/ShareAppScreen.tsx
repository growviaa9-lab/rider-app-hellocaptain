import React from 'react';
import {
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ShareAppScreenProps {
  navigation: any;
}

const ShareAppScreen: React.FC<ShareAppScreenProps> = ({ navigation }) => {
  // const [referralCode, setReferralCode] = useState('LOKI2024');
  // const [copied, setCopied] = useState(false);

  // const shareOptions = [
  //   {
  //     name: 'WhatsApp',
  //     icon: 'whatsapp',
  //     color: '#25D366',
  //     action: () => shareToWhatsApp(),
  //   },
  //   {
  //     name: 'Telegram',
  //     icon: 'telegram',
  //     color: '#0088CC',
  //     action: () => shareToTelegram(),
  //   },
  //   {
  //     name: 'Facebook',
  //     icon: 'facebook',
  //     color: '#1877F2',
  //     action: () => shareToFacebook(),
  //   },
  //   {
  //     name: 'Twitter',
  //     icon: 'twitter',
  //     color: '#1DA1F2',
  //     action: () => shareToTwitter(),
  //   },
  //   {
  //     name: 'Email',
  //     icon: 'email',
  //     color: '#EA4335',
  //     action: () => shareToEmail(),
  //   },
  //   {
  //     name: 'SMS',
  //     icon: 'sms',
  //     color: '#34A853',
  //     action: () => shareToSMS(),
  //   },
  // ];

  const shareMessage =
    `🚗 Download Hello Captain - Your trusted ride-sharing partner!\n\n` +
    `Experience safe, reliable, and affordable rides across India.\n\n` +
    `Use my referral code: LOKI2024\n\n` +
    `Download now: https://play.google.com/store/apps/details?id=com.hellocaptain.rider`;

  // const shareToWhatsApp = async () => {
  //   try {
  //     await Share.share({
  //       message: shareMessage,
  //       title: 'Hello Captain - Ride Sharing App',
  //     });
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to share to WhatsApp');
  //   }
  // };

  // const shareToTelegram = async () => {
  //   try {
  //     await Share.share({
  //       message: shareMessage,
  //       title: 'Hello Captain - Ride Sharing App',
  //     });
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to share to Telegram');
  //   }
  // };

  // const shareToFacebook = async () => {
  //   try {
  //     await Share.share({
  //       message: shareMessage,
  //       title: 'Hello Captain - Ride Sharing App',
  //     });
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to share to Facebook');
  //   }
  // };

  // const shareToTwitter = async () => {
  //   try {
  //     await Share.share({
  //       message: shareMessage,
  //       title: 'Hello Captain - Ride Sharing App',
  //     });
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to share to Twitter');
  //   }
  // };

  // const shareToEmail = async () => {
  //   try {
  //     await Share.share({
  //       message: shareMessage,
  //       title: 'Hello Captain - Ride Sharing App',
  //     });
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to share via Email');
  //   }
  // };

  // const shareToSMS = async () => {
  //   try {
  //     await Share.share({
  //       message: shareMessage,
  //       title: 'Hello Captain - Ride Sharing App',
  //     });
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to share via SMS');
  //   }
  // };

  // const copyReferralCode = () => {
  //   setCopied(true);
  //   setTimeout(() => setCopied(false), 2000);
  //   Alert.alert('Copied!', 'Referral code copied to clipboard');
  // };

  const generalShare = async () => {
    try {
      await Share.share({
        message: shareMessage,
        title: 'Hello Captain - Ride Sharing App',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share app');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Share App</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Share Icon */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-3">
            <Icon name="share" size={40} color="#4CAF50" />
          </View>
          <Text className="text-lg font-semibold text-gray-800">
            Share Hello Captain
          </Text>
          <Text className="text-sm text-gray-600 text-center mt-2">
            Help your friends discover safe and reliable rides
          </Text>
        </View>

        {/* Referral Code Section */}
        {/* <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Your Referral Code
          </Text>
          <View className="flex-row items-center space-x-3">
            <View className="flex-1 bg-gray-100 rounded-lg p-3">
              <Text className="text-center font-bold text-lg text-gray-800">
                {referralCode}
              </Text>
            </View>
            <TouchableOpacity
              onPress={copyReferralCode}
              className={`px-4 py-3 rounded-lg ${
                copied ? 'bg-green-500' : 'bg-blue-500'
              }`}
            >
              <Text className="text-white font-semibold">
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-600 mt-2 text-center">
            Share this code with friends and earn rewards!
          </Text>
        </View> */}

        {/* Quick Share Button */}
        <TouchableOpacity
          onPress={generalShare}
          className="bg-primary py-4 rounded-lg mb-6"
        >
          <View className="flex-row items-center justify-center">
            <Icon name="share" size={24} color="white" className="mr-2" />
            <Text className="text-white text-center font-bold text-lg ml-2">
              Share App
            </Text>
          </View>
        </TouchableOpacity>

        {/* Share Options */}
        {/* <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Share via
          </Text>

          <View className="grid grid-cols-2 gap-3">
            {shareOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={option.action}
                className="flex-row items-center p-3 border border-gray-200 rounded-lg"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${option.color}20` }}
                >
                  <Icon name={option.icon} size={20} color={option.color} />
                </View>
                <Text className="font-medium text-gray-800">{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* Referral Benefits */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Referral Benefits
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center">
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text className="text-gray-700 ml-3">
                ₹50 credit for each successful referral
              </Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text className="text-gray-700 ml-3">
                Free ride on your 5th referral
              </Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text className="text-gray-700 ml-3">
                Exclusive rewards and discounts
              </Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text className="text-gray-700 ml-3">
                Priority customer support
              </Text>
            </View>
          </View>
        </View>

        {/* How It Works */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            How It Works
          </Text>

          <View className="space-y-4">
            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full bg-primary items-center justify-center mr-3 mt-1">
                <Text className="text-white text-xs font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">
                  Share your referral code
                </Text>
                <Text className="text-sm text-gray-600">
                  Send it to friends via any platform
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full bg-primary items-center justify-center mr-3 mt-1">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">
                  Friend downloads the app
                </Text>
                <Text className="text-sm text-gray-600">
                  They use your code during registration
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full bg-primary items-center justify-center mr-3 mt-1">
                <Text className="text-white text-xs font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">
                  Both get rewards
                </Text>
                <Text className="text-sm text-gray-600">
                  You and your friend receive benefits
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* App Features */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Why Share Hello Captain?
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center">
              <Icon name="security" size={20} color="#4CAF50" />
              <Text className="text-gray-700 ml-3">
                Verified drivers with background checks
              </Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="location-on" size={20} color="#4CAF50" />
              <Text className="text-gray-700 ml-3">
                Real-time GPS tracking for safety
              </Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="payment" size={20} color="#4CAF50" />
              <Text className="text-gray-700 ml-3">
                Multiple secure payment options
              </Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="support-agent" size={20} color="#4CAF50" />
              <Text className="text-gray-700 ml-3">24/7 customer support</Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="eco" size={20} color="#4CAF50" />
              <Text className="text-gray-700 ml-3">
                Eco-friendly ride options
              </Text>
            </View>
          </View>
        </View>

        {/* Download Links */}
        {/* <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Download Links
          </Text>

          <TouchableOpacity className="flex-row items-center p-3 border border-gray-200 rounded-lg mb-3">
            <Icon name="android" size={24} color="#4CAF50" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">
                Google Play Store
              </Text>
              <Text className="text-sm text-gray-600">
                Download for Android
              </Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-3 border border-gray-200 rounded-lg">
            <Icon name="apple" size={24} color="#000000" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">App Store</Text>
              <Text className="text-sm text-gray-600">Download for iOS</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShareAppScreen;
