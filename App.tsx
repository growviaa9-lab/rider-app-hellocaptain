import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { PaperProvider, BottomNavigation } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';

// --- 1. Import Navigation Components ---
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens from their own files
import SplashScreen from './src/screens/SplashScreen';
import LocationPermissionScreen from './src/screens/LocationPermissionScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import OnboardingScreen1 from './src/screens/OnboardingScreen1';
import OnboardingScreen2 from './src/screens/OnboardingScreen2';
import OnboardingScreen3 from './src/screens/OnboardingScreen3';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RegisterOTPScreen from './src/screens/RegisterOTPScreen';
import HomeScreen from './src/screens/HomeScreen';
import RidesScreen from './src/screens/RidesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
// --- 2. Import InboxScreen and ChatScreen ---
import InboxScreen from './src/screens/InboxScreen'; // This will be the list of chats
import ChatScreen from './src/screens/ChatScreen';   // This is the individual chat view
import RidesDetail from './src/screens/RidesDetail';
// --- 3. Define the Chat Navigation Stack ---
// This creates a separate navigation flow for your chat feature
const ChatStack = createStackNavigator();
// const RidesStack = createStackNavigator();
const ChatNavigator = () => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen 
        name="Inbox" 
        component={InboxScreen} 
        options={{ headerShown: false }} 
      />
      <ChatStack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ headerShown: false }} // You can customize this header if needed
      />
    </ChatStack.Navigator>
  );
};

// const RidesNavigator = () => {
//   return (
//    <RidesStack.Navigator>
//       <RidesStack.Screen 
//         name="RideHistory" 
//         component={RidesScreen} 
//         options={{ headerShown: false }} 
//       />
//       <RidesStack.Screen 
//         name="RidesDetail" 
//         component={RidesDetail} 
//         options={{ headerShown: false }} 
//       />
//     </RidesStack.Navigator>
//   );
// };


// --- Main App with Bottom Navigation ---
const MainAppScreen = () => {
  const [index, setIndex] = useState(0);
  const [profileVisible, setProfileVisible] = useState(false);
  
  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'rides', title: 'Rides', focusedIcon: 'car', unfocusedIcon: 'car-outline' },
    { key: 'chat', title: 'Chat', focusedIcon: 'message', unfocusedIcon: 'message-outline' },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'home':
        return <HomeScreen onProfilePress={() => setProfileVisible(true)} />;
      case 'rides':
        return <RidesScreen/>;
      case 'chat':
        return <ChatNavigator />;
      default:
        return null;
    }
  };

  return (
    <>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
      <ProfileScreen visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </>
  );
};


const AppNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('');
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
      setCurrentScreen('Login');
    }
  };
  
  const handleSplashFinish = () => {
    setIsLoading(false);
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
      setCurrentScreen('Main');
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
    setUserPhoneNumber(phoneNumber);
    setCurrentScreen('RegisterOTP');
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

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  switch (currentScreen) {
    case 'LanguageSelection':
      return <LanguageSelectionScreen onLanguageSelected={handleLanguageSelected} />;
    case 'LocationPermission':
      return <LocationPermissionScreen onPermissionGranted={handlePermissionGranted} />;
    case 'Onboarding1':
      return <OnboardingScreen1 onContinue={handleOnboarding1Continue} />;
    case 'Onboarding2':
      return <OnboardingScreen2 onContinue={handleOnboarding2Continue} />;
    case 'Onboarding3':
      return <OnboardingScreen3 onContinue={handleOnboarding3Continue} />;
    case 'Login':
      return <LoginScreen onLoginSuccess={handleLoginSuccess} onNavigateToRegister={handleNavigateToRegister} />;
    case 'Register':
      return <RegisterScreen onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={handleNavigateToLogin} />;
    case 'RegisterOTP':
      return (
        <RegisterOTPScreen 
          onOTPVerified={handleOTPVerified} 
          onNavigateBack={handleNavigateBackFromOTP}
          phoneNumber={userPhoneNumber}
        />
      );
    case 'Main':
        return <MainAppScreen />;
    default:
        return null; 
  }
};

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  return (
    <PaperProvider theme={theme}>
      {/* --- 5. Wrap the entire app in a NavigationContainer --- */}
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
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