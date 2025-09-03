import React, { useState } from 'react';
import {
  Alert,
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
// Assume apiService is configured correctly
// import apiService from '../../services/ApiService';

interface ChangePasswordScreenProps {
  navigation: any;
  onBack: () => void;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({  onBack }) => {
  // State for form values, errors, and submission status
  const [values, setValues] = useState({
    phone_number: '',
    password: '',
    new_password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to manage password visibility
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
  });

  // Mock API service for demonstration
  const apiService = {
    changePassword: (vals: typeof values) =>
      new Promise(resolve => setTimeout(() => resolve({ status: 200, data: { message: 'Success' } }), 1000)),
  };

  // --- Validation logic using plain JavaScript ---
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Phone number validation
    if (!values.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s-]+$/.test(values.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    // Current password validation
    if (!values.password) {
      newErrors.password = 'Current password is required';
    }

    // New password validation
    if (!values.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (values.new_password.length < 6) {
      newErrors.new_password = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(values.new_password)) {
      newErrors.new_password = 'Password must contain uppercase, lowercase, number and special character';
    }

    setErrors(newErrors);
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Only proceed if validation passes
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response: any = await apiService.changePassword(values);

      if (response.status === 200) {
        Alert.alert('Success', 'Password changed successfully!');
        onBack();
      } else {
        Alert.alert('Error', 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (name: keyof typeof values, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  // Toggle visibility of password fields
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Security Icon and Title */}
          <View style={styles.titleContainer}>
            <View style={styles.iconWrapper}>
              <Icon name="security" size={40} color="#F59E0B" />
            </View>
            <Text style={styles.titleText}>Update Your Password</Text>
            <Text style={styles.subtitleText}>
              Make sure your new password is strong and secure
            </Text>
          </View>

          <>
            {/* Form Fields */}
            <View>
              {/* Phone Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.phone_number && styles.inputError,
                  ]}
                  value={values.phone_number}
                  onChangeText={text => handleChange('phone_number', text)}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
                {errors.phone_number && (
                  <Text style={styles.errorText}>{errors.phone_number}</Text>
                )}
              </View>

              {/* Current Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Password</Text>
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      errors.password && styles.inputError,
                    ]}
                    value={values.password}
                    onChangeText={text => handleChange('password', text)}
                    placeholder="Enter current password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPasswords.current}
                  />
                  <TouchableOpacity
                    onPress={() => togglePasswordVisibility('current')}
                    style={styles.eyeIcon}>
                    <Icon
                      name={showPasswords.current ? 'visibility' : 'visibility-off'}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              {/* New Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      errors.new_password && styles.inputError,
                    ]}
                    value={values.new_password}
                    onChangeText={text => handleChange('new_password', text)}
                    placeholder="Enter new password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPasswords.new}
                  />
                  <TouchableOpacity
                    onPress={() => togglePasswordVisibility('new')}
                    style={styles.eyeIcon}>
                    <Icon
                      name={showPasswords.new ? 'visibility' : 'visibility-off'}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.helperText}>Minimum 6 characters</Text>
                {errors.new_password && (
                  <Text style={styles.errorText}>{errors.new_password}</Text>
                )}
              </View>
            </View>

            {/* Password Requirements Box */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <View>
                <Text style={styles.requirementText}>• At least 6 characters long</Text>
                <Text style={styles.requirementText}>• Include uppercase and lowercase letters</Text>
                <Text style={styles.requirementText}>• Include numbers and special characters</Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}>
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Changing Password...' : 'Change Password'}
              </Text>
            </TouchableOpacity>
          </>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  subtitleText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  passwordInput: {
    paddingRight: 48, // Make space for the icon
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 13, // Adjust for vertical centering
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  requirementsContainer: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    color: '#1D4ED8',
    marginBottom: 4,
  },
  submitButton: {
    backgroundColor: '#3B82F6', // A generic primary blue color
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ChangePasswordScreen;

