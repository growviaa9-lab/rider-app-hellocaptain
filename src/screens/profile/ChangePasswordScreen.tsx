import { Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import apiService from '../../services/ApiService';

interface ChangePasswordScreenProps {
  navigation: any;
}

interface FormValues {
  phone_number: string;
  password: string;
  new_password: string;
}

const validationSchema = Yup.object().shape({
  phone_number: Yup.string()
    .matches(/^\+?[\d\s-]+$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  password: Yup.string()
    .required('Current password is required'),
  new_password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Password must contain uppercase, lowercase, number and special character')
    .required('New password is required'),
});

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false
  });

  const initialValues: FormValues = {
    phone_number: '',
    password: '',
    new_password: '',
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    try {
      const response = await apiService.changePassword(values);
      
      if (response.status === 200) {
        Alert.alert('Success', 'Password changed successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Change Password</Text>
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
          {/* Security Icon */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 rounded-full bg-yellow-100 items-center justify-center mb-3">
              <Icon name="security" size={40} color="#F59E0B" />
            </View>
            <Text className="text-lg font-semibold text-gray-800">Update Your Password</Text>
            <Text className="text-sm text-gray-600 text-center mt-2">
              Make sure your new password is strong and secure
            </Text>
          </View>

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
                {/* Form Fields */}
                <View className="space-y-4">
                  {/* Phone Number */}
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number</Text>
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

                  {/* Current Password */}
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">Current Password</Text>
                    <View className="relative">
                      <TextInput
                        className={`bg-white border rounded-lg px-4 py-3 pr-12 text-gray-800 ${
                          touched.password && errors.password
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        placeholder="Enter current password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showPasswords.current}
                      />
                      <TouchableOpacity 
                        onPress={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-3"
                      >
                        <Icon 
                          name={showPasswords.current ? 'visibility' : 'visibility-off'} 
                          size={20} 
                          color="#666" 
                        />
                      </TouchableOpacity>
                    </View>
                    {touched.password && errors.password && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </Text>
                    )}
                  </View>

                  {/* New Password */}
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">New Password</Text>
                    <View className="relative">
                      <TextInput
                        className={`bg-white border rounded-lg px-4 py-3 pr-12 text-gray-800 ${
                          touched.new_password && errors.new_password
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        value={values.new_password}
                        onChangeText={handleChange('new_password')}
                        onBlur={handleBlur('new_password')}
                        placeholder="Enter new password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showPasswords.new}
                      />
                      <TouchableOpacity 
                        onPress={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-3"
                      >
                        <Icon 
                          name={showPasswords.new ? 'visibility' : 'visibility-off'} 
                          size={20} 
                          color="#666" 
                        />
                      </TouchableOpacity>
                    </View>
                    <Text className="text-xs text-gray-500 mt-1">Minimum 6 characters</Text>
                    {touched.new_password && errors.new_password && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.new_password}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Password Requirements */}
                <View className="bg-blue-50 p-4 rounded-lg mt-4">
                  <Text className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</Text>
                  <View className="space-y-1">
                    <Text className="text-xs text-blue-700">• At least 6 characters long</Text>
                    <Text className="text-xs text-blue-700">• Include uppercase and lowercase letters</Text>
                    <Text className="text-xs text-blue-700">• Include numbers and special characters</Text>
                  </View>
                </View>

                {/* Change Password Button */}
                <TouchableOpacity 
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                  className={`py-4 rounded-lg mt-6 mb-4 ${
                    isSubmitting ? 'bg-gray-400' : 'bg-primary'
                  }`}
                >
                  <Text className="text-white text-center font-bold text-lg">
                    {isSubmitting ? 'Changing Password...' : 'Change Password'}
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

export default ChangePasswordScreen;


