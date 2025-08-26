import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { BottomNavigation, PaperProvider } from 'react-native-paper';
import { LanguageProvider } from './src/context/LanguageContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// --- 1. Import Navigation Components ---
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens from their own files
import HomeScreen from './src/screens/HomeScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import LocationPermissionScreen from './src/screens/LocationPermissionScreen';
import LoginScreen from './src/screens/LoginScreen';
import OnboardingScreen1 from './src/screens/OnboardingScreen1';
import OnboardingScreen2 from './src/screens/OnboardingScreen2';
import OnboardingScreen3 from './src/screens/OnboardingScreen3';
import ProfileNavigator from './src/navigation/ProfileNavigator';
import RegisterOTPScreen from './src/screens/RegisterOTPScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RidesScreen from './src/screens/RidesScreen';
import SplashScreen from './src/screens/SplashScreen';
// --- 2. Import InboxScreen and ChatScreen ---
import ChatScreen from './src/screens/ChatScreen'; // This is the individual chat view
import InboxScreen from './src/screens/InboxScreen'; // This will be the list of chats
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
        component={ChatScreenWrapper}
        options={{ headerShown: false }} // You can customize this header if needed
      />
    </ChatStack.Navigator>
  );
};

// Wrapper component to provide required props to ChatScreen
const ChatScreenWrapper: React.FC = () => {
  const mockNavigation = {
    navigate: () => {},
    goBack: () => {},
    setOptions: () => {},
  } as any;

  const mockRoute = {
    key: 'Chat',
    name: 'Chat',
    params: { chatId: 'default' },
  } as any;

  return <ChatScreen navigation={mockNavigation} route={mockRoute} />;
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

// Wrapper component to provide required props to RidesScreen
const RidesScreenWrapper: React.FC = () => {
  const mockNavigation = {
    navigate: () => {},
    goBack: () => {},
    setOptions: () => {},
  } as any;

  const mockRoute = {
    key: 'RideHistory',
    name: 'RideHistory',
    params: undefined,
  } as any;

  return <RidesScreen navigation={mockNavigation} route={mockRoute} />;
};

// --- Main App with Bottom Navigation ---
const MainAppScreen = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'rides',
      title: 'Rides',
      focusedIcon: 'car',
      unfocusedIcon: 'car-outline',
    },
    {
      key: 'chat',
      title: 'Chat',
      focusedIcon: 'message',
      unfocusedIcon: 'message-outline',
    },
    {
      key: 'profile',
      title: 'Profile',
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline',
    },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'home':
        return <HomeScreen />;
      case 'rides':
        return <RidesScreenWrapper />;
      case 'chat':
        return <ChatNavigator />;
      case 'profile':
        return <ProfileNavigator />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
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
      const hasLocationPermission = await AsyncStorage.getItem(
        'locationPermission',
      );
      const hasCompletedOnboarding = await AsyncStorage.getItem(
        'onboardingCompleted',
      );
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
      return (
        <LanguageSelectionScreen onLanguageSelected={handleLanguageSelected} />
      );
    case 'LocationPermission':
      return (
        <LocationPermissionScreen
          onPermissionGranted={handlePermissionGranted}
        />
      );
    case 'Onboarding1':
      return <OnboardingScreen1 onContinue={handleOnboarding1Continue} />;
    case 'Onboarding2':
      return <OnboardingScreen2 onContinue={handleOnboarding2Continue} />;
    case 'Onboarding3':
      return <OnboardingScreen3 onContinue={handleOnboarding3Continue} />;
    case 'Login':
      return (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={handleNavigateToRegister}
        />
      );
    case 'Register':
      return (
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={handleNavigateToLogin}
        />
      );
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
