import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const UploadIDCardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [idNumber, setIdNumber] = useState('');
  const [frontImage, setFrontImage] = useState('');
  const [backImage, setBackImage] = useState('');

  const handleUploadImage = (type: 'front' | 'back') => {
    Alert.alert(
      'Upload Image',
      `Select image for ${type === 'front' ? 'front' : 'back'} of ID card`,
      [
        { 
          text: 'Camera', 
          onPress: () => {
            console.log('Camera button pressed');
            try {
              launchCamera(
                {
                  mediaType: 'photo',
                  quality: 0.8,
                  includeBase64: false,
                  saveToPhotos: false,
                  maxWidth: 1024,
                  maxHeight: 1024,
                  cameraType: 'back',
                },
                (response) => {
                  console.log('Camera response:', response);
                  if (response.didCancel) {
                    console.log('User cancelled camera');
                  } else if (response.errorCode) {
                    console.log('Camera error:', response.errorCode, response.errorMessage);
                    let errorMsg = 'Unknown camera error';
                    
                    switch (response.errorCode) {
                      case 'camera_unavailable':
                        errorMsg = 'Camera is not available on this device';
                        break;
                      case 'permission':
                        errorMsg = 'Camera permission denied. Please enable camera access in settings.';
                        break;
                      case 'others':
                        errorMsg = response.errorMessage || 'Camera error occurred';
                        break;
                      default:
                        errorMsg = response.errorMessage || 'Unknown camera error';
                    }
                    
                    Alert.alert('Camera Error', errorMsg, [
                      { text: 'OK', style: 'default' },
                      { text: 'Settings', onPress: () => {
                        if (Platform.OS === 'ios') {
                          Linking.openURL('app-settings:');
                        } else {
                          Linking.openSettings();
                        }
                      }}
                    ]);
                  } else if (response.assets && response.assets[0]) {
                    const imageUri = response.assets[0].uri;
                    console.log('Image selected:', imageUri);
                    if (type === 'front') {
                      setFrontImage(imageUri || '');
                    } else {
                      setBackImage(imageUri || '');
                    }
                  }
                }
              );
            } catch (error) {
              console.error('Camera launch error:', error);
              Alert.alert('Error', 'Failed to launch camera: ' + (error instanceof Error ? error.message : 'Unknown error'));
            }
          }
        },
        { 
          text: 'Gallery', 
          onPress: () => {
            console.log('Gallery button pressed');
            try {
              launchImageLibrary(
                {
                  mediaType: 'photo',
                  quality: 0.8,
                  includeBase64: false,
                  selectionLimit: 1,
                  maxWidth: 1024,
                  maxHeight: 1024,
                },
                (response) => {
                  console.log('Gallery response:', response);
                  if (response.didCancel) {
                    console.log('User cancelled gallery');
                  } else if (response.errorCode) {
                    console.log('Gallery error:', response.errorCode, response.errorMessage);
                    let errorMsg = 'Unknown gallery error';
                    
                    switch (response.errorCode) {
                      case 'permission':
                        errorMsg = 'Photo library permission denied. Please enable photo access in settings.';
                        break;
                      case 'others':
                        errorMsg = response.errorMessage || 'Gallery error occurred';
                        break;
                      default:
                        errorMsg = response.errorMessage || 'Unknown gallery error';
                    }
                    
                    Alert.alert('Gallery Error', errorMsg, [
                      { text: 'OK', style: 'default' },
                      { text: 'Settings', onPress: () => {
                        if (Platform.OS === 'ios') {
                          Linking.openURL('app-settings:');
                        } else {
                          Linking.openSettings();
                        }
                      }}
                    ]);
                  } else if (response.assets && response.assets[0]) {
                    const imageUri = response.assets[0].uri;
                    console.log('Image selected:', imageUri);
                    if (type === 'front') {
                      setFrontImage(imageUri || '');
                    } else {
                      setBackImage(imageUri || '');
                    }
                  }
                }
              );
            } catch (error) {
              console.error('Gallery launch error:', error);
              Alert.alert('Error', 'Failed to launch gallery: ' + (error instanceof Error ? error.message : 'Unknown error'));
            }
          }
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleContinue = () => {
    if (idNumber && frontImage && backImage) {
      // Complete e-KYC process and navigate to success screen
      navigation.navigate('EKYCSuccess' as never);
    } else {
      Alert.alert('Error', 'Please fill all required fields and upload images');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black ml-4">Upload ID Card</Text>
      </View>

      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* ID Card Front */}
          <View className="mt-6">
            <Text className="text-base font-semibold text-black mb-3">ID Card* (Front)</Text>
            <TouchableOpacity
              onPress={() => handleUploadImage('front')}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 items-center justify-center"
            >
              {frontImage ? (
                <View className="items-center">
                  <Image source={{ uri: frontImage }} className="w-24 h-24 rounded-lg mb-2" />
                  <Text className="text-sm text-green-600 font-medium">Image uploaded</Text>
                  <TouchableOpacity 
                    onPress={() => setFrontImage('')}
                    className="mt-2 px-3 py-1 bg-red-100 rounded-full"
                  >
                    <Text className="text-xs text-red-600">Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="items-center">
                  <Icon name="credit-card" size={48} color="#666" />
                  <Text className="text-sm text-gray-600 mt-2">Tap to Upload or Click Image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ID Card Back */}
          <View className="mt-6">
            <Text className="text-base font-semibold text-black mb-3">ID Card* (Back)</Text>
            <TouchableOpacity
              onPress={() => handleUploadImage('back')}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 items-center justify-center"
            >
              {backImage ? (
                <View className="items-center">
                  <Image source={{ uri: backImage }} className="w-24 h-24 rounded-lg mb-2" />
                  <Text className="text-sm text-green-600 font-medium">Image uploaded</Text>
                  <TouchableOpacity 
                    onPress={() => setBackImage('')}
                    className="mt-2 px-3 py-1 bg-red-100 rounded-full"
                  >
                    <Text className="text-xs text-red-600">Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="items-center">
                  <Icon name="description" size={48} color="#666" />
                  <Text className="text-sm text-gray-600 mt-2">Tap to Upload or Click Image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ID Card Number */}
          <View className="mt-6">
            <Text className="text-base font-semibold text-black mb-3">ID Card Number*</Text>
            <TextInput
              placeholder="12 Digits License Number"
              value={idNumber}
              onChangeText={setIdNumber}
              className="border border-gray-300 rounded-lg px-3 py-3 text-base"
              keyboardType="numeric"
              maxLength={12}
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!idNumber || !frontImage || !backImage}
            className={`mt-8 mb-6 py-4 rounded-lg ${
              idNumber && frontImage && backImage
                ? 'bg-primary'
                : 'bg-gray-300'
            }`}
          >
            <Text className="text-center text-white text-lg font-semibold">
              Continue
            </Text>
          </TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
};

export default UploadIDCardScreen;
