import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EKYCSuccessScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleLetsGo = () => {
    // Navigate back to profile main screen
    navigation.navigate('ProfileMain' as never);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Main Image Container */}
      <View className="flex-1">
        {/* Background Image with fade effect */}
        <View className="flex-1 relative">
          {/* Success Image with gradient overlay */}
          <View className="flex-1 items-center justify-center">
            {/* Placeholder for the person's photo - you can replace this with actual image */}
            <View className="w-40 h-40 bg-gray-300 rounded-full items-center justify-center mb-4 overflow-hidden">
              {/* You can replace this with an actual Image component */}
              <View className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
                <Text className="text-6xl">👨‍💼</Text>
              </View>
            </View>
            
            {/* Thumbs up indicator */}
            <View className="absolute bottom-20 right-20">
              <Text className="text-5xl">👍</Text>
            </View>
          </View>
          
          {/* Gradient overlay from image to black */}
          <View className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </View>

        {/* Text Content Overlay */}
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-black">
          {/* Success Message */}
          <Text className="text-5xl font-bold text-primary text-center mb-6">
            All Done!
          </Text>

          {/* Verification Info */}
          <Text className="text-white text-xl text-center mb-4">
            Your documents will be verified in 24hrs
          </Text>

          {/* Encouragement Text */}
          <Text className="text-white text-lg text-center mb-10 leading-6">
            You are just one step away from becoming a Hello Captain's Rider
          </Text>

          {/* Let's Go Button */}
          <TouchableOpacity
            onPress={handleLetsGo}
            className="bg-primary py-5 rounded-xl"
            activeOpacity={0.8}
          >
            <Text className="text-white text-xl font-bold text-center">
              Let's Go!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EKYCSuccessScreen;
