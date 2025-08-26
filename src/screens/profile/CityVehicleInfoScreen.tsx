import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CityVehicleInfoScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const cities = [
    'Kathmandu',
    'Pokhara',
    'Lalitpur',
    'Bhaktapur',
    'Lumbini',
    'Chitwan',
    'Dharan',
  ];
  const vehicles = [
    { type: 'Scooter/Bike', icon: '🚗' },
    { type: 'Auto', icon: '🛺' },
    { type: 'Car', icon: '🚙' },
    { type: 'E-Rickshaw', icon: '🛵' },
  ];

  const handleContinue = () => {
    if (selectedCity && selectedVehicle && vehicleNumber) {
      // Navigate to next screen
      navigation.navigate('UploadDrivingLicense' as never);
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
        <Text className="text-xl font-bold text-black ml-4">
          City & Vehicle Info
        </Text>
      </View>

      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Select City Section */}
          <View className="mt-6">
            <Text className="text-base font-semibold text-black mb-3">
              Select City*
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 mb-4">
              <TextInput
                placeholder="City"
                value={selectedCity}
                onChangeText={setSelectedCity}
                className="flex-1 text-base"
                placeholderTextColor="#9CA3AF"
              />
              <Icon name="my-location" size={20} color="#666" />
            </View>

            {/* City Options */}
            <View className="flex-row flex-wrap gap-2">
              {cities.map(city => (
                <TouchableOpacity
                  key={city}
                  onPress={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCity === city
                      ? 'bg-primary border-primary'
                      : 'border-gray-300'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedCity === city ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Select Vehicle Section */}
          <View className="mt-6">
            <Text className="text-base font-semibold text-black mb-3">
              Select Vehicle*
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {vehicles.map(vehicle => (
                <TouchableOpacity
                  key={vehicle.type}
                  onPress={() => setSelectedVehicle(vehicle.type)}
                  className={`w-[45%] p-4 rounded-lg border-2 ${
                    selectedVehicle === vehicle.type
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200'
                  }`}
                >
                  <Text className="text-4xl text-center mb-2">
                    {vehicle.icon}
                  </Text>
                  <Text
                    className={`text-center text-sm font-medium ${
                      selectedVehicle === vehicle.type
                        ? 'text-primary'
                        : 'text-gray-700'
                    }`}
                  >
                    {vehicle.type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Vehicle Number Section */}
          <View className="mt-6">
            <Text className="text-base font-semibold text-black mb-3">
              Vehicle Number*
            </Text>
            <TextInput
              placeholder="Ex: BA 1 PA 1234"
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 rounded-lg px-3 py-3 text-base"
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!selectedCity || !selectedVehicle || !vehicleNumber}
            className={`mt-8 mb-6 py-4 rounded-lg ${
              selectedCity && selectedVehicle && vehicleNumber
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

export default CityVehicleInfoScreen;
