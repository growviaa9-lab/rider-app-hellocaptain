import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface RateAppScreenProps {
  navigation: any;
}

const RateAppScreen: React.FC<RateAppScreenProps> = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const stars = [1, 2, 3, 4, 5];

  const handleRating = (star: number) => {
    setRating(star);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert('Please Rate', 'Please select a rating before submitting');
      return;
    }

    setHasRated(true);
    Alert.alert(
      'Thank You!', 
      `Thank you for your ${rating}-star rating!`,
      [
        {
          text: 'Rate on Store',
          onPress: () => openAppStore()
        },
        {
          text: 'Close',
          style: 'cancel'
        }
      ]
    );
  };

  const openAppStore = () => {
    // For Android, open Google Play Store
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.hellocaptain.rider';
    Linking.openURL(playStoreUrl);
  };

  // const openAppStoreIOS = () => {
  //   // For iOS, open App Store
  //   const appStoreUrl = 'https://apps.apple.com/app/hello-captain/id123456789';
  //   Linking.openURL(appStoreUrl);
  // };

  const getRatingMessage = () => {
    switch (rating) {
      case 1:
        return 'We\'re sorry to hear that. Please let us know how we can improve.';
      case 2:
        return 'We appreciate your feedback. We\'re working to make it better.';
      case 3:
        return 'Thank you for your feedback. We\'re constantly improving.';
      case 4:
        return 'Great! We\'re glad you\'re enjoying Hello Captain.';
      case 5:
        return 'Excellent! We\'re thrilled you love Hello Captain!';
      default:
        return 'Rate your experience with Hello Captain';
    }
  };

  // const getRatingColor = () => {
  //   if (rating >= 4) return '#4CAF50';
  //   if (rating >= 3) return '#FF9800';
  //   return '#F44336';
  // };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Rate App</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Rating Icon */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-yellow-100 items-center justify-center mb-3">
            <Icon name="star" size={40} color="#F59E0B" />
          </View>
          <Text className="text-lg font-semibold text-gray-800">Rate Hello Captain</Text>
          <Text className="text-sm text-gray-600 text-center mt-2">
            Your feedback helps us improve and serve you better
          </Text>
        </View>

        {/* Current Rating Display */}
        {hasRated && (
          <View className="bg-white rounded-lg p-4 mb-4 border-2 border-green-200 shadow-lg">
            <View className="items-center">
              <View className="flex-row items-center mb-2">
                {stars.map((star) => (
                  <Icon 
                    key={star} 
                    name="star" 
                    size={24} 
                    color={star <= rating ? '#FFD700' : '#D1D5DB'} 
                    className="mx-1"
                  />
                ))}
              </View>
              <Text className="text-lg font-semibold text-gray-800">
                You rated us {rating} {rating === 1 ? 'star' : 'stars'}
              </Text>
              <Text className="text-sm text-gray-600 text-center mt-1">
                Thank you for your feedback!
              </Text>
            </View>
          </View>
        )}

        {/* Rating Stars */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
            How would you rate your experience?
          </Text>
          
          <View className="flex-row justify-center items-center mb-4">
            {stars.map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRating(star)}
                className="mx-2"
              >
                <Icon 
                  name={star <= rating ? 'star' : 'star-border'} 
                  size={40} 
                  color={star <= rating ? '#FFD700' : '#D1D5DB'} 
                />
              </TouchableOpacity>
            ))}
          </View>

          {rating > 0 && (
            <View className="items-center">
              <Text className="text-lg font-medium text-gray-800 mb-2">
                {rating} {rating === 1 ? 'Star' : 'Stars'}
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-5">
                {getRatingMessage()}
              </Text>
            </View>
          )}
        </View>

        {/* Submit Rating Button */}
        {rating > 0 && !hasRated && (
          <TouchableOpacity 
            onPress={handleSubmitRating}
            className="bg-yellow-500 py-4 rounded-lg mb-6"
          >
            <Text className="text-white text-center font-bold text-lg">Submit Rating</Text>
          </TouchableOpacity>
        )}

        {/* Why Rate Us */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Why Rate Hello Captain?</Text>
          
          <View className="space-y-3">
            <View className="flex-row items-start">
              <Icon name="check-circle" size={20} color="#4CAF50" className="mt-1" />
              <Text className="text-gray-700 ml-3 flex-1">
                Help other users discover a reliable ride-sharing platform
              </Text>
            </View>
            <View className="flex-row items-start">
              <Icon name="check-circle" size={20} color="#4CAF50" className="mt-1" />
              <Text className="text-gray-700 ml-3 flex-1">
                Your feedback drives our continuous improvement
              </Text>
            </View>
            <View className="flex-row items-start">
              <Icon name="check-circle" size={20} color="#4CAF50" className="mt-1" />
              <Text className="text-gray-700 ml-3 flex-1">
                Support our mission to revolutionize urban mobility
              </Text>
            </View>
            <View className="flex-row items-start">
              <Icon name="check-circle" size={20} color="#4CAF50" className="mt-1" />
              <Text className="text-gray-700 ml-3 flex-1">
                Get early access to new features and updates
              </Text>
            </View>
          </View>
        </View>

        {/* Rate on App Stores
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Rate on App Store</Text>
          
          <TouchableOpacity 
            onPress={openAppStore}
            className="flex-row items-center p-4 border border-gray-200 rounded-lg mb-3"
          >
            <Icon name="android" size={24} color="#4CAF50" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Google Play Store</Text>
              <Text className="text-sm text-gray-600">Rate us on Google Play</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={openAppStoreIOS}
            className="flex-row items-center p-4 border border-gray-200 rounded-lg"
          >
            <Icon name="apple" size={24} color="#000000" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">App Store</Text>
              <Text className="text-sm text-gray-600">Rate us on App Store</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        Feedback Section
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Additional Feedback</Text>
          
          <TouchableOpacity className="flex-row items-center p-3 border border-gray-200 rounded-lg mb-3">
            <Icon name="feedback" size={20} color="#4A90E2" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Send Feedback</Text>
              <Text className="text-sm text-gray-600">Share detailed feedback with us</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-3 border border-gray-200 rounded-lg">
            <Icon name="bug-report" size={20} color="#FF9800" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Report a Bug</Text>
              <Text className="text-sm text-gray-600">Help us fix any issues you encounter</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View> */}

        {/* Rating Statistics */}
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">App Rating Statistics</Text>
          
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Overall Rating</Text>
              <View className="flex-row items-center">
                <Text className="font-bold text-lg text-gray-800 mr-2">4.5</Text>
                <View className="flex-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon 
                      key={star} 
                      name="star" 
                      size={16} 
                      color={star <= 4 ? '#FFD700' : '#D1D5DB'} 
                      className="mx-0.5"
                    />
                  ))}
                </View>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Total Ratings</Text>
              <Text className="font-medium text-gray-800">12,847</Text>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Downloads</Text>
              <Text className="font-medium text-gray-800">500K+</Text>
            </View>
          </View>
        </View>

        {/* Thank You Message */}
        <View className="bg-blue-50 p-4 rounded-lg mb-4">
          <Text className="text-sm font-medium text-blue-800 mb-2">Thank You!</Text>
          <Text className="text-xs text-blue-700 leading-5">
            Your rating and feedback are invaluable to us. They help us create a better experience 
            for all Hello Captain users. We appreciate you taking the time to share your thoughts!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RateAppScreen;


