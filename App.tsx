/**
 * Hello Captain Rider App
 * Main entry point
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet,Text } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import SplashScreen from './src/screens/SplashScreen';
import LocationPermissionScreen from './src/screens/LocationPermissionScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import OnboardingScreen1 from './src/screens/OnboardingScreen1';
import OnboardingScreen2 from './src/screens/OnboardingScreen2';
import OnboardingScreen3 from './src/screens/OnboardingScreen3';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RegisterOTPScreen from './src/screens/RegisterOTPScreen';
import { red200 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const AppNavigator: React.FC = () => {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<string>('Splash');
  const [isLoading, setIsLoading] = useState(true);
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>('');

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    try {
      const hasSelectedLanguage = await AsyncStorage.getItem('language');
      const hasLocationPermission = await AsyncStorage.getItem('locationPermission');
      const hasCompletedOnboarding = await AsyncStorage.getItem('onboardingCompleted');
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      
      if (!hasSelectedLanguage) {
        setCurrentScreen('LanguageSelection');
      } else if (!hasLocationPermission) {
        setCurrentScreen('LocationPermission');
      } else if (!hasCompletedOnboarding) {
        setCurrentScreen('Onboarding1');
      } else if (!isLoggedIn) {
        setCurrentScreen('Login');
      } else {
        setCurrentScreen('Main');
      }
    } catch (error) {
      console.error('Error checking initial route:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSplashFinish = () => {
    checkInitialRoute();
  };

  const handleLanguageSelected = () => {
    setCurrentScreen('LocationPermission');
  };

  const handlePermissionGranted = async () => {
    try {
      await AsyncStorage.setItem('locationPermission', 'granted');
      setCurrentScreen('Onboarding1');
    } catch (error) {
      console.error('Error saving location permission:', error);
    }
  };

  const handleOnboarding1Continue = () => {
    setCurrentScreen('Onboarding2');
  };

  const handleOnboarding2Continue = () => {
    setCurrentScreen('Onboarding3');
  };

  const handleOnboarding3Continue = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      setCurrentScreen('Login');
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  };

  const handleLoginSuccess = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setCurrentScreen('Main'); // Redirect to Onboarding after login
    } catch (error) {
      console.error('Error saving login state:', error);
    }
  };

  const handleNavigateToRegister = () => {
    setCurrentScreen('Register');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('Login');
  };

  const handleRegisterSuccess = async (phoneNumber: string) => {
    try {
      setUserPhoneNumber(phoneNumber);
      setCurrentScreen('RegisterOTP');
    } catch (error) {
      console.error('Error saving registration data:', error);
    }
  };

  const handleOTPVerified = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setCurrentScreen('Main');
    } catch (error) {
      console.error('Error saving login state:', error);
    }
  };

  const handleNavigateBackFromOTP = () => {
    setCurrentScreen('Register');
  };

  if (isLoading || currentScreen === 'Splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (currentScreen === 'LanguageSelection') {
    return <LanguageSelectionScreen onLanguageSelected={handleLanguageSelected} />;
  }

  if (currentScreen === 'LocationPermission') {
    return <LocationPermissionScreen onPermissionGranted={handlePermissionGranted} />;
  }

  if (currentScreen === 'Onboarding1') {
    return <OnboardingScreen1 onContinue={handleOnboarding1Continue} />;
  }

  if (currentScreen === 'Onboarding2') {
    return <OnboardingScreen2 onContinue={handleOnboarding2Continue} />;
  }

  if (currentScreen === 'Onboarding3') {
    return <OnboardingScreen3 onContinue={handleOnboarding3Continue} />;
  }

  if (currentScreen === 'Login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} onNavigateToRegister={handleNavigateToRegister} />;
  }

  if (currentScreen === 'Register') {
    return <RegisterScreen onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={handleNavigateToLogin} />;
  }

  if (currentScreen === 'RegisterOTP') {
    return (
      <RegisterOTPScreen 
        onOTPVerified={handleOTPVerified} 
        onNavigateBack={handleNavigateBackFromOTP}
        phoneNumber={userPhoneNumber}
      />
    );
  }

  // Main app screen placeholder
  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.colors.background }]}>
      {/* Main app content will go here */}
      <Text style={{ color: '#f50000ff' }}>Welcome to Hello Captain Rider!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
