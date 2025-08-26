import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface AboutUsScreenProps {
  navigation: any;
}

const AboutUsScreen: React.FC<AboutUsScreenProps> = ({ navigation }) => {
  // const handleContact = (type: string) => {
  //   switch (type) {
  //     case 'email':
  //       Linking.openURL('mailto:support@hellocaptain.com');
  //       break;
  //     case 'phone':
  //       Linking.openURL('tel:+91-1800-123-4567');
  //       break;
  //     case 'website':
  //       Linking.openURL('https://www.hellocaptain.com');
  //       break;
  //   }
  // };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">About Us</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Company Logo */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-3">
            <Icon name="star" size={48} color="white" />
          </View>
          <Text className="text-2xl font-bold text-primary">Hello Captain</Text>
          <Text className="text-sm text-gray-600 text-center mt-2">
            Your trusted ride-sharing partner
          </Text>
        </View>

        {/* App Version */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-700">App Version</Text>
            <Text className="text-gray-800 font-medium">1.0.0</Text>
          </View>
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-700">Build Number</Text>
            <Text className="text-gray-800 font-medium">2024.01.001</Text>
          </View>
        </View>

        {/* Company Description */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Our Story
          </Text>
          <Text className="text-gray-600 leading-6">
            Hello Captain is a leading ride-sharing platform that connects
            riders with reliable drivers. Founded in 2020, we've been committed
            to providing safe, affordable, and convenient transportation
            solutions across India.
          </Text>
        </View>

        {/* Mission & Vision */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Our Mission
          </Text>
          <Text className="text-gray-600 leading-6 mb-4">
            To revolutionize urban mobility by creating a seamless, safe, and
            sustainable transportation ecosystem that benefits both riders and
            drivers.
          </Text>

          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Our Vision
          </Text>
          <Text className="text-gray-600 leading-6">
            To become India's most trusted and preferred ride-sharing platform,
            setting new standards for safety, reliability, and customer
            satisfaction.
          </Text>
        </View>

        {/* Key Features */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-14">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Why Choose Hello Captain?
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
              <Text className="text-gray-700 ml-3">Real-time GPS tracking</Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="payment" size={20} color="#4CAF50" />
              <Text className="text-gray-700 ml-3">
                Multiple payment options
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

        {/* Contact Information
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Contact Us
          </Text>

          <TouchableOpacity
            onPress={() => handleContact('email')}
            className="flex-row items-center p-3 border border-gray-200 rounded-lg mb-3"
          >
            <Icon name="email" size={20} color="#4A90E2" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Email Support</Text>
              <Text className="text-sm text-gray-600">
                support@hellocaptain.com
              </Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleContact('phone')}
            className="flex-row items-center p-3 border border-gray-200 rounded-lg mb-3"
          >
            <Icon name="phone" size={20} color="#4A90E2" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Customer Care</Text>
              <Text className="text-sm text-gray-600">1800-123-4567</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleContact('website')}
            className="flex-row items-center p-3 border border-gray-200 rounded-lg"
          >
            <Icon name="language" size={20} color="#4A90E2" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Website</Text>
              <Text className="text-sm text-gray-600">
                www.hellocaptain.com
              </Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        Legal Information
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Legal
          </Text>
          <View className="space-y-2">
            <TouchableOpacity>
              <Text className="text-blue-600">Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-blue-600">Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-blue-600">Cookie Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-blue-600">Data Protection</Text>
            </TouchableOpacity>
          </View>
        </View>

        Copyright
        <View className="items-center py-4">
          <Text className="text-sm text-gray-500 text-center">
            © 2024 Hello Captain. All rights reserved.
          </Text>
          <Text className="text-xs text-gray-400 text-center mt-1">
            Made with ❤️ in India
          </Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUsScreen;
