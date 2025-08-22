import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
interface RegisterOTPScreenProps {
  // onOTPVerified: () => void;
  // onNavigateBack: () => void;
  phoneNumber: string;
}

const RegisterOTPScreen: React.FC<RegisterOTPScreenProps> = ({ 
  // onOTPVerified, 
  // onNavigateBack, 
  phoneNumber 
}) => {
  const { theme } = useTheme();
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef<Array<TextInput | null>>([]);

  const navigation = useNavigation();
  const onOTPVerified = async() => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      navigation.replace('MainApp' as never);
    } catch (error) {
      console.error('Error saving login state:', error);
    }
  };

  const onNavigateBack = () => {
    navigation.goBack();
  };

  
  const handleOTPChange = (value: string, index: number) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace to move to previous input
    if (key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otp = otpValues.join('');
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter the complete OTP');
      return;
    }

    setIsLoading(true);
    
    // TODO: Replace with actual API call
    try {
      // const response = await axios.post('/api/verify-otp', {
      //   phoneNumber,
      //   otp
      // });
      
      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false);
        onOTPVerified();
      }, 1000);
      
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'OTP verification failed. Please try again.');
    }
  };

  const handleResendOTP = () => {
    Alert.alert('OTP Resent', 'A new OTP has been sent to your phone number');
    // TODO: Implement resend OTP API call
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OTP Verification</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationWrapper}>
            <View style={styles.phoneIllustration}>
              <View style={styles.phoneScreen}>
                <View style={styles.checkmarkContainer}>
                  <Text style={styles.checkmarkIcon}>✓</Text>
                </View>
              </View>
            </View>
            <View style={styles.personIllustration}>
              <Text style={styles.personIcon}>👤</Text>
            </View>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Authenticate Phone Number</Text>
        </View>

        {/* Phone Number Display */}
        <View style={styles.phoneContainer}>
          <Text style={styles.phoneLabel}>Phone</Text>
          <View style={styles.phoneDisplayContainer}>
            <View style={styles.flagContainer}>
              <Text style={styles.flagText}>🇳🇵</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </View>
            <Text style={styles.phoneNumberText}>{phoneNumber}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* OTP Input Section */}
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>Enter OTP*</Text>
          <View style={styles.otpInputContainer}>
            {otpValues.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  otpRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  value ? styles.otpInputFilled : null
                ]}
                value={value}
                onChangeText={(text) => handleOTPChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>
        </View>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive OTP? </Text>
          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton, 
            { backgroundColor: theme.colors.primary || '#FF6B35' }, 
            isLoading && styles.continueButtonDisabled
          ]}
          onPress={handleVerifyOTP}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Verifying...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  illustrationWrapper: {
    position: 'relative',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneIllustration: {
    width: 120,
    height: 180,
    backgroundColor: '#333333',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneScreen: {
    width: '100%',
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#FF6B35',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  personIllustration: {
    position: 'absolute',
    left: -20,
    bottom: 20,
    width: 80,
    height: 80,
    backgroundColor: '#F0F0F0',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personIcon: {
    fontSize: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  phoneContainer: {
    marginBottom: 30,
  },
  phoneLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 10,
  },
  phoneDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    height: 50,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  flagText: {
    fontSize: 20,
    marginRight: 5,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666666',
    marginRight: 10,
  },
  phoneNumberText: {
    flex: 1,
    fontSize: 16,
    color: '#666666',
  },
  editButton: {
    padding: 5,
  },
  editIcon: {
    fontSize: 16,
  },
  otpContainer: {
    marginBottom: 30,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 15,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F2',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: '#666666',
  },
  resendLink: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  continueButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 50,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RegisterOTPScreen;
