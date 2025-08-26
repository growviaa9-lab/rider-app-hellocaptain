import React, { useState, useEffect } from 'react';
import { AppState, Alert, PermissionsAndroid } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';

// --- Firebase Messaging Imports ---
import messaging from '@react-native-firebase/messaging';

// --- Navigation Imports ---
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// --- Screen Imports ---
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
import NewOrderScreen from './src/screens/NewOrderScreen'; // Screen to display new ride requests

// --- Background Notification Handler ---
// This function MUST be a top-level function (outside of any class)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // The OS will display the notification automatically. You can add custom logic here if needed.
});

// --- Navigation Reference ---
// This allows navigation from outside of the component tree (e.g., from a notification listener)
export const navigationRef = createNavigationContainerRef();

// --- Navigator Setups ---
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

const Tab = createBottomTabNavigator();
const MainAppTabs = () => {
  const [profileVisible, setProfileVisible] = useState(false);

  const CustomHomeScreen = (props: any) => (
    <HomeScreen {...props} onProfilePress={() => setProfileVisible(true)} />
  );

  return (
    <>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        {/* NOTE: You will need to add your custom tab bar icons back here */}
        <Tab.Screen name="Home" component={CustomHomeScreen} />
        <Tab.Screen name="Rides" component={RidesNavigator} />
        <Tab.Screen
          name="ChatTab"
          component={ChatNavigator}
          options={{ title: 'Chat' }}
        />
      </Tab.Navigator>
      <ProfileScreen visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </>
  );
};

// --- Root Stack Navigator ---
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
          setInitialRouteName('MainApp');
        }
      } catch (error) {
        console.error('Error checking initial route:', error);
        setInitialRouteName('Login'); // Default to login on error
      } finally {
        setIsLoading(false);
      }
    };
    checkInitialRoute();
  }, []);

  if (isLoading || !initialRouteName) {
    return <SplashScreen onFinish={() => { setIsLoading(false); }} />;
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
      
      {/* Main App Screens */}
      <RootStack.Screen name="MainApp" component={MainAppTabs} />

      {/* Modal Screen for New Orders */}
      <RootStack.Screen 
        name="NewOrder" 
        component={NewOrderScreen} 
        options={{ presentation: 'modal', headerShown: false }} 
      />
    </RootStack.Navigator>
  );
};

// --- App Content Wrapper ---
const AppContent = () => {
  const { theme } = useTheme();
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

// --- Main App Component ---
const App = () => {

  useEffect(() => {
    // --- 1. Request Notification Permissions (Android 13+) ---
    const requestUserPermission = async () => {
      try {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      } catch (error) {
        console.log('Notification permission request error: ', error);
      }
    };

    requestUserPermission();

    // --- 2. Handle Foreground Notifications ---
    // This runs when a notification is received while the app is open.
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived in foreground!', JSON.stringify(remoteMessage));
      if (remoteMessage.data && navigationRef.isReady()) {
        // Navigate to the NewOrder screen with the ride data
        navigationRef.navigate('NewOrder', { rideData: remoteMessage.data });
      }
    });

    // --- 3. Handle Tapped Notifications (from Background) ---
    // This runs when the user taps a notification and the app was in the background.
    const unsubscribeOnOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      if (remoteMessage.data && navigationRef.isReady()) {
        navigationRef.navigate('NewOrder', { rideData: remoteMessage.data });
      }
    });

    // --- 4. Handle Tapped Notifications (from Quit State) ---
    // This checks if the app was opened from a terminated state by a notification.
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage && remoteMessage.data) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
          // We add a small delay to ensure the navigator is ready
          setTimeout(() => {
            if (navigationRef.isReady()) {
              navigationRef.navigate('NewOrder', { rideData: remoteMessage.data });
            }
          }, 1000);
        }
      });

    // --- 5. Get and Log the FCM Token (for testing) ---
    const getToken = async () => {
      try {
        const token = await messaging().getToken();
        if (token) {
          console.log('--- FCM REGISTRATION TOKEN ---');
          console.log(token);
          console.log('-----------------------------');
        }
      } catch (error) {
        console.error('Error getting FCM token', error);
      }
    };
    getToken();

    // Cleanup listeners on component unmount
    return () => {
      unsubscribeOnMessage();
      unsubscribeOnOpened();
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
