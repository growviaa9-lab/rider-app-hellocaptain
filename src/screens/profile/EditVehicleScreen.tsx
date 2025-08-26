import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import apiService from '../../services/ApiService';

interface EditVehicleScreenProps {
  navigation: any;
}

interface VehicleFormValues {
  id: string;
  phone_number: string;
  id_kendaraan: number;
  brand: string;
  type: string;
  no_kendaraan: string;
  color: string;
}

const validationSchema = Yup.object().shape({
  phone_number: Yup.string()
    .matches(/^\+?[\d\s-]+$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  brand: Yup.string()
    .min(2, 'Vehicle brand must be at least 2 characters')
    .required('Vehicle brand is required'),
  type: Yup.string()
    .min(2, 'Vehicle type must be at least 2 characters')
    .required('Vehicle type is required'),
  no_kendaraan: Yup.string()
    .min(3, 'Vehicle number must be at least 3 characters')
    .required('Vehicle number is required'),
  color: Yup.string()
    .min(2, 'Color must be at least 2 characters')
    .required('Color is required'),
});

const EditVehicleScreen: React.FC<EditVehicleScreenProps> = ({
  navigation,
}) => {
  const initialValues: VehicleFormValues = {
    id: '', // This should come from user context or navigation params
    phone_number: '', // This should come from user context
    id_kendaraan: 0, // This should come from navigation params or user context
    brand: '',
    type: '',
    no_kendaraan: '',
    color: '',
  };

  const handleSubmit = async (
    values: VehicleFormValues,
    { setSubmitting }: FormikHelpers<VehicleFormValues>,
  ) => {
    try {
      const payload = {
        id: values.id,
        phone_number: values.phone_number,
        id_kendaraan: values.id_kendaraan,
        brand: values.brand,
        type: values.type,
        no_kendaraan: values.no_kendaraan,
        color: values.color,
      };

      // Call the API service to update vehicle information
      const response = await apiService.editVehicle(payload);

      if (response.status === 200) {
        Alert.alert('Success', 'Vehicle information updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update vehicle information');
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      Alert.alert(
        'Error',
        'Failed to update vehicle information. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Edit Vehicle</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          className="flex-1 p-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <>
                {/* Vehicle Icon */}
                <View className="items-center mb-6">
                  <View className="w-20 h-20 rounded-full bg-yellow-100 items-center justify-center mb-3">
                    <Icon name="directions-car" size={40} color="#F59E0B" />
                  </View>
                  <Text className="text-lg font-semibold text-gray-800">
                    Vehicle Information
                  </Text>
                  <Text className="text-sm text-gray-600 text-center mt-2">
                    Update your vehicle details for ride verification
                  </Text>
                </View>

                {/* Vehicle Form */}
                <View className="space-y-4">
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </Text>
                    <TextInput
                      className={`bg-white border rounded-lg px-4 py-3 text-gray-800 ${
                        touched.phone_number && errors.phone_number
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      value={values.phone_number}
                      onChangeText={handleChange('phone_number')}
                      onBlur={handleBlur('phone_number')}
                      placeholder="Enter your phone number"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                    />
                    {touched.phone_number && errors.phone_number && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.phone_number}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Vehicle Brand
                    </Text>
                    <TextInput
                      className={`bg-white border rounded-lg px-4 py-3 text-gray-800 ${
                        touched.brand && errors.brand
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      value={values.brand}
                      onChangeText={handleChange('brand')}
                      onBlur={handleBlur('brand')}
                      placeholder="e.g., Honda, Yamaha, TVS"
                      placeholderTextColor="#9CA3AF"
                    />
                    {touched.brand && errors.brand && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.brand}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </Text>
                    <TextInput
                      className={`bg-white border rounded-lg px-4 py-3 text-gray-800 ${
                        touched.type && errors.type
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      value={values.type}
                      onChangeText={handleChange('type')}
                      onBlur={handleBlur('type')}
                      placeholder="e.g., Civic, Activa 6G, Jupiter"
                      placeholderTextColor="#9CA3AF"
                    />
                    {touched.type && errors.type && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.type}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Vehicle Number
                    </Text>
                    <TextInput
                      className={`bg-white border rounded-lg px-4 py-3 text-gray-800 ${
                        touched.no_kendaraan && errors.no_kendaraan
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      value={values.no_kendaraan}
                      onChangeText={handleChange('no_kendaraan')}
                      onBlur={handleBlur('no_kendaraan')}
                      placeholder="e.g., ABC-456, MH-01-AB-1234"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="characters"
                    />
                    {touched.no_kendaraan && errors.no_kendaraan && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.no_kendaraan}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Vehicle Color
                    </Text>
                    <TextInput
                      className={`bg-white border rounded-lg px-4 py-3 text-gray-800 ${
                        touched.color && errors.color
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      value={values.color}
                      onChangeText={handleChange('color')}
                      onBlur={handleBlur('color')}
                      placeholder="e.g., Black, White, Red"
                      placeholderTextColor="#9CA3AF"
                    />
                    {touched.color && errors.color && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.color}
                      </Text>
                    )}
                  </View>

                  {/* Hidden fields for API */}
                  <View style={{ display: 'none' }}>
                    <TextInput value={values.id} />
                    <TextInput value={values.id_kendaraan.toString()} />
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                  className={`py-4 rounded-lg mt-6 mb-4 ${
                    isSubmitting ? 'bg-gray-400' : 'bg-primary'
                  }`}
                >
                  <Text className="text-white text-center font-bold text-lg">
                    {isSubmitting ? 'Saving...' : 'Save Vehicle Details'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditVehicleScreen;
