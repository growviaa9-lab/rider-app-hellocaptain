import { Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import {
  Alert,
  Image,
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

interface EditProfileScreenProps {
  navigation: any;
}

interface FormValues {
  id: string;
  customer_fullname: string;
  phone_number: string;
  no_telepon_lama: string;
  phone: string;
  email: string;
  countrycode: string;
  dob: string;
  fotodriver: string | null;
  fotodriver_lama: string | null;
}

const validationSchema = Yup.object().shape({
  customer_fullname: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[\d\s-]+$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  countrycode: Yup.string()
    .matches(/^\+\d+$/, 'Please enter a valid country code')
    .required('Country code is required'),
  dob: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .required('Date of birth is required'),
});

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const initialValues: FormValues = {
    id: '',
    customer_fullname: '',
    phone_number: '',
    no_telepon_lama: '',
    phone: '',
    email: '',
    countrycode: '',
    dob: '',
    fotodriver: null,
    fotodriver_lama: null,
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    try {
      const payload = {
        id: values.id,
        customer_fullname: values.customer_fullname,
        phone_number: `${values.countrycode}${values.phone}`,
        no_telepon_lama: values.no_telepon_lama,
        phone: values.phone,
        email: values.email,
        countrycode: values.countrycode,
        dob: values.dob,
        fotodriver: values.fotodriver,
        fotodriver_lama: values.fotodriver_lama,
      };

      const response = await apiService.editProfile(payload);

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImagePicker = () => {
    // Implement image picker logic here
    Alert.alert('Image Picker', 'Image picker functionality to be implemented');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Edit Profile</Text>
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
                {/* Profile Picture Section */}
                <View className="items-center mb-6">
                  <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-3 overflow-hidden">
                    {profileImage || values.fotodriver_lama ? (
                      <Image
                        source={{
                          uri: profileImage || values.fotodriver_lama || '',
                        }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <Icon name="person" size={48} color="#666" />
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={handleImagePicker}
                    className="bg-primary px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">
                      Change Photo
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View className="space-y-4">
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </Text>
                    <TextInput
                      className={`bg-white border rounded-lg px-4 py-3 text-gray-800 ${
                        touched.customer_fullname && errors.customer_fullname
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      value={values.customer_fullname}
                      onChangeText={handleChange('customer_fullname')}
                      onBlur={handleBlur('customer_fullname')}
                      placeholder="Enter your full name"
                      placeholderTextColor="#9CA3AF"
                    />
                    {touched.customer_fullname && errors.customer_fullname && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.customer_fullname}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Email
                    </Text>
                    <TextInput
                      className={`bg-white border rounded-lg px-4 py-3 text-gray-800 ${
                        touched.email && errors.email
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      placeholder="Enter your email"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {touched.email && errors.email && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </Text>
                    )}
                  </View>

                  <View className="flex-row space-x-2">
                    <View className="flex">
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Country Code
                      </Text>
                      <TextInput
                        className={`bg-white border rounded-lg px-4 py-3 text-gray-800 ${
                          touched.countrycode && errors.countrycode
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        value={values.countrycode}
                        onChangeText={handleChange('countrycode')}
                        onBlur={handleBlur('countrycode')}
                        placeholder="+1"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                      />
                      {touched.countrycode && errors.countrycode && (
                        <Text className="text-red-500 text-sm mt-1">
                          {errors.countrycode}
                        </Text>
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </Text>
                      <TextInput
                        className={`bg-white border rounded-lg px-4 py-3 text-gray-800 ${
                          touched.phone && errors.phone
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        value={values.phone}
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        placeholder="Enter phone number"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                      />
                      {touched.phone && errors.phone && (
                        <Text className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Full Phone Number (with country code)
                    </Text>
                    <TextInput
                      className="bg-gray-100 border rounded-lg px-4 py-3 text-gray-600 border-gray-300"
                      value={`${values.countrycode}${values.phone}`}
                      editable={false}
                      placeholder="Auto-generated phone number"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                      This is auto-generated from country code + phone number
                    </Text>
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Previous Phone Number
                    </Text>
                    <TextInput
                      className="bg-white border rounded-lg px-4 py-3 text-gray-800 border-gray-300"
                      value={values.no_telepon_lama}
                      onChangeText={handleChange('no_telepon_lama')}
                      onBlur={handleBlur('no_telepon_lama')}
                      placeholder="Previous phone number"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Date of Birth (YYYY-MM-DD)
                    </Text>
                    <TextInput
                      className={`bg-white border rounded-lg px-4 py-3 text-gray-800 ${
                        touched.dob && errors.dob
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      value={values.dob}
                      onChangeText={handleChange('dob')}
                      onBlur={handleBlur('dob')}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                    />
                    {values.dob && (
                      <Text className="text-xs text-gray-500 mt-1">
                        Formatted: {formatDate(values.dob)}
                      </Text>
                    )}
                    {touched.dob && errors.dob && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.dob}
                      </Text>
                    )}
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
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
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

export default EditProfileScreen;
