import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const { theme } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
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
      // const response = await axios.post('/api/login', {
      //   phoneNumber,
      //   password
      // });
      
      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess();
      }, 1000);
      
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      
      {/* Background Image */}
      <ImageBackground
        source={{}} // Leave blank as requested - will show car driver image
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Content Container */}
          <View style={styles.contentContainer}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <Text style={styles.logoTextHello}>Hello</Text>
              <Text style={styles.logoTextCaptain}>captain</Text>
              <Text style={styles.tagline}>"Nepali by Heart, Nepali by Purpose."</Text>
            </View>

            {/* Welcome Section */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.subtitleText}>Login to your account</Text>
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
                  placeholder="Enter Mobile Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  mode="outlined"
                  outlineStyle={styles.inputOutline}
                  contentStyle={styles.inputContent}
                />
              </View>

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

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.7}>
                  <Text style={styles.registerLink}>Register Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    minHeight: height,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: height * 0.15, // Reduced from 0.3 to give more space for content
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  logoTextHello: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: -5,
  },
  logoTextCaptain: {
    fontSize: 36,
    fontWeight: '300',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginBottom: 20,
    paddingLeft: 15,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    marginRight: 10,
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
    marginBottom: 20,
    borderRadius: 15,
  },
  inputOutline: {
    borderColor: 'transparent',
  },
  inputContent: {
    fontSize: 16,
    paddingHorizontal: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
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
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
  },
  registerText: {
    fontSize: 16,
    color: '#666666',
  },
  registerLink: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
