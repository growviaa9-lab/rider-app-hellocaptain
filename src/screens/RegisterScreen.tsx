import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


type RootStackParamList = {
  Register: undefined; // This screen does not expect any parameters
  RegisterOTP: { phoneNumber: string }; // This screen expects a phoneNumber string

};
type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = ({}) => {
  const { theme } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  // const navigation = useNavigation();

   const navigation = useNavigation<RegisterScreenNavigationProp>();
  const onNavigateToLogin = () => {
    navigation.navigate('Login' as never);
  };

  const onRegisterSuccess = (phone: string) => {
    navigation.navigate('RegisterOTP', { phoneNumber: phone });
  };
  const handleRegister = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!dateOfBirth.trim()) {
      Alert.alert('Error', 'Please enter your date of birth');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to Terms of Use and Privacy Policy');
      return;
    }

    setIsLoading(true);
    
    // TODO: Replace with actual API call
    try {
      // const response = await axios.post('/api/register', {
      //   phoneNumber,
      //   name,
      //   email,
      //   dateOfBirth,
      //   password
      // });
      
      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false);
        onRegisterSuccess(phoneNumber);
      }, 1000);
      
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onNavigateToLogin}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        nestedScrollEnabled={true}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoTextHello}>Hello</Text>
          <Text style={styles.logoTextCaptain}>captain</Text>
          <Text style={styles.tagline}>"Nepali by Heart, Nepali by Purpose."</Text>
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Create an Account</Text>
          <Text style={styles.subtitleText}>Enter the below details to Register</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* Phone Number Input */}
          <View style={styles.phoneInputContainer}>
            <View style={styles.flagContainer}>
              <Text style={styles.flagText}>🇳🇵</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              mode="outlined"
              outlineStyle={styles.inputOutline}
              contentStyle={styles.inputContent}
            />
          </View>

          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            outlineStyle={styles.inputOutline}
            contentStyle={styles.inputContent}
          />

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            mode="outlined"
            outlineStyle={styles.inputOutline}
            contentStyle={styles.inputContent}
          />

          {/* Date of Birth Input */}
          <TextInput
            style={styles.input}
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            mode="outlined"
            outlineStyle={styles.inputOutline}
            contentStyle={styles.inputContent}
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="outlined"
            outlineStyle={styles.inputOutline}
            contentStyle={styles.inputContent}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          {/* Terms Checkbox */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
              {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              By Continuing, I agree to{' '}
              <Text style={styles.linkText}>Terms of Use</Text>
              {' & '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button - Moved outside form container */}
        <TouchableOpacity
          style={[
            styles.continueButton, 
            { backgroundColor: theme.colors.primary || '#FF6B35' }, 
            isLoading && styles.continueButtonDisabled
          ]}
          onPress={handleRegister}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Creating Account...' : 'Continue'}
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
    position: 'absolute',
    left: 20,
    top: 40,
    zIndex: 1,
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    color: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoTextHello: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: -5,
  },
  logoTextCaptain: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 5,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 15,
    paddingLeft: 12,
    height: 50,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    marginRight: 8,
  },
  flagText: {
    fontSize: 20,
    marginRight: 5,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666666',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  input: {
    backgroundColor: '#F5F5F5',
    marginBottom: 15,
    borderRadius: 12,
    height: 50,
  },
  inputOutline: {
    borderColor: 'transparent',
  },
  inputContent: {
    fontSize: 14,
    paddingHorizontal: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    marginTop: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#FF6B35',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  linkText: {
    color: '#FF6B35',
    textDecorationLine: 'underline',
  },
  continueButton: {
    backgroundColor: '#FF6B35', // Fallback color
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

export default RegisterScreen;
