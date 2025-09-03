import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
// Mock ApiService; in a real app, this would be imported.
// import apiService from '../../services/ApiService';

interface EditProfileScreenProps {
  navigation?: any; // Kept for standalone use, but onBack is preferred
  onBack?: () => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
  onBack,
}) => {
  // State for form data, errors, and submission status
  const [values, setValues] = useState({
    customer_fullname: '',
    phone: '',
    email: '',
    countrycode: '',
    dob: '',
    no_telepon_lama: '',
    fotodriver_lama: null, // To hold the initial image URI
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Mock API service for demonstration
  const apiService = {
    editProfile: (payload: any) => new Promise(resolve => setTimeout(() => resolve({ status: 200 }), 1000)),
  };

  // --- Form Validation without Yup ---
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!values.customer_fullname || values.customer_fullname.length < 2) {
      newErrors.customer_fullname = 'Full name must be at least 2 characters';
    }
    if (!values.email || !/^\S+@\S+\.\S+$/.test(values.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!values.phone || !/^[\d\s-]+$/.test(values.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!values.countrycode || !/^\+\d+$/.test(values.countrycode)) {
      newErrors.countrycode = 'Please enter a valid country code';
    }
    if (!values.dob || !/^\d{4}-\d{2}-\d{2}$/.test(values.dob)) {
      newErrors.dob = 'Date must be in YYYY-MM-DD format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Back handler that prioritizes onBack prop ---
  const handleBack = () => {
    if (onBack) onBack();
    else if (navigation) navigation.goBack();
  };

  // --- Form Submission Logic ---
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = { ...values, phone_number: `${values.countrycode}${values.phone}`, fotodriver: profileImage };
      const response = await apiService.editProfile(payload);

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully!');
        handleBack();
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (name: keyof typeof values, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleImagePicker = () => {
    Alert.alert('Image Picker', 'Image picker functionality to be implemented');
    // Example: setProfileImage('file:///path/to/new/image.jpg');
  };
  
  const formatDate = (dateString: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return 'Invalid Date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          
          <View style={styles.imageSection}>
            <View style={styles.avatarContainer}>
              {profileImage || values.fotodriver_lama ? (
                <Image
                  source={{ uri: profileImage || values.fotodriver_lama || '' }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Icon name="person" size={48} color="#666" />
              )}
            </View>
            <TouchableOpacity onPress={handleImagePicker} style={styles.changePhotoButton}>
              <Text style={styles.changePhotoButtonText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, errors.customer_fullname && styles.inputError]}
                value={values.customer_fullname}
                onChangeText={text => handleChange('customer_fullname', text)}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
              />
              {errors.customer_fullname && <Text style={styles.errorText}>{errors.customer_fullname}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={values.email}
                onChangeText={text => handleChange('email', text)}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCodeContainer}>
                <Text style={styles.label}>Code</Text>
                <TextInput
                  style={[styles.input, errors.countrycode && styles.inputError]}
                  value={values.countrycode}
                  onChangeText={text => handleChange('countrycode', text)}
                  placeholder="+1"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
                 {errors.countrycode && <Text style={styles.errorText}>{errors.countrycode}</Text>}
              </View>

              <View style={styles.phoneNumberContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  value={values.phone}
                  onChangeText={text => handleChange('phone', text)}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={[styles.input, errors.dob && styles.inputError]}
                value={values.dob}
                onChangeText={text => handleChange('dob', text)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              {values.dob && !errors.dob && <Text style={styles.helperText}>Formatted: {formatDate(values.dob)}</Text>}
              {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
            </View>
          </View>
          
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}>
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  flex1: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  container: { flex: 1, padding: 16 },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  imageSection: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  changePhotoButton: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  changePhotoButtonText: { color: 'white', fontWeight: '600' },
  form: { marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#111827' },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 14, marginTop: 4 },
  helperText: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  phoneInputContainer: { flexDirection: 'row', marginBottom: 16 },
  countryCodeContainer: { flex: 0.3 },
  phoneNumberContainer: { flex: 0.7, marginLeft: 8 },
  submitButton: { backgroundColor: '#3B82F6', paddingVertical: 16, borderRadius: 8, marginTop: 16 },
  submitButtonDisabled: { backgroundColor: '#9CA3AF' },
  submitButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 18 },
});

export default EditProfileScreen;
