import React, { useState, useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';

// --- CHANGE: Import navigation components, including createBottomTabNavigator ---
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import all your screens
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
import InboxScreen from './src/screens/InboxScreen';
import ChatScreen from './src/screens/ChatScreen';
import RidesDetail from './src/screens/RidesDetail';

// --- These Stack Navigators for Chat and Rides remain the same ---
const ChatStack = createStackNavigator();
const RidesStack = createStackNavigator();

const ChatNavigator = () => (
  <ChatStack.Navigator screenOptions={{ headerShown: false }}>
    <ChatStack.Screen name="Inbox" component={InboxScreen} />
    <ChatStack.Screen name="Chat" component={ChatScreen} />
  </ChatStack.Navigator>
);

const RidesNavigator = () => (
  <RidesStack.Navigator screenOptions={{ headerShown: false }}>
    <RidesStack.Screen name="RideHistory" component={RidesScreen} />
    <RidesStack.Screen name="RidesDetail" component={RidesDetail} />
  </RidesStack.Navigator>
);

// --- CHANGE: Create a Bottom Tab Navigator for the main app ---
const Tab = createBottomTabNavigator();
const MainAppTabs = () => {
  const [profileVisible, setProfileVisible] = useState(false);

  const CustomHomeScreen = (props) => (
    <HomeScreen {...props} onProfilePress={() => setProfileVisible(true)} />
  );

  return (
    <>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Home"
          component={CustomHomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Rides"
          component={RidesNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="car" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="ChatTab"
          component={ChatNavigator}
          options={{
            title: 'Chat',
            tabBarIcon: ({ color, size }) => <Icon name="message" color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
      <ProfileScreen visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </>
  );
};

// --- CHANGE: Create a single Root Stack to manage the entire app flow ---
const RootStack = createStackNavigator();
const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);

  useEffect(() => {
    const checkInitialRoute = async () => {
      try {
        const hasSelectedLanguage = await AsyncStorage.getItem('language');
        const hasLocationPermission = await AsyncStorage.getItem('locationPermission');
        const hasCompletedOnboarding = await AsyncStorage.getItem('onboardingCompleted');
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

        if (!hasSelectedLanguage) {
          setInitialRouteName('LanguageSelection');
        } else if (!hasLocationPermission) {
          setInitialRouteName('LocationPermission');
        } else if (!hasCompletedOnboarding) {
          setInitialRouteName('Onboarding1');
        } else if (!isLoggedIn) {
          setInitialRouteName('Login');
        } else {
          setInitialRouteName('MainApp'); // This is our new Tab Navigator
        }
      } catch (error) {
        console.error('Error checking initial route:', error);
        setInitialRouteName('Login');
      } finally {
        setIsLoading(false);
      }
    };
    checkInitialRoute();
  }, []);

  if (isLoading || !initialRouteName) {
    return <SplashScreen onFinish={()=>{setIsLoading(false);}}/>;
  }

  return (
    <RootStack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      {/* Auth and Onboarding Screens */}
      <RootStack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <RootStack.Screen name="LocationPermission" component={LocationPermissionScreen} />
      <RootStack.Screen name="Onboarding1" component={OnboardingScreen1} />
      <RootStack.Screen name="Onboarding2" component={OnboardingScreen2} />
      <RootStack.Screen name="Onboarding3" component={OnboardingScreen3} />
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />
      <RootStack.Screen name="RegisterOTP" component={RegisterOTPScreen} />
      <RootStack.Screen name="MainApp" component={MainAppTabs} />
    </RootStack.Navigator>
  );
};

// --- This part remains the same ---
const AppContent = () => {
  const { theme } = useTheme();
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;