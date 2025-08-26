import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Modal, Animated, Button, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// --- Import the DriverRatingsScreen component ---
// It will be rendered inside this component, not as a separate route.
import DriverRatingsScreen from './DriverRatingsScreen';

interface ProfileScreenProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const navigation = useNavigation();

  // --- State to manage the view inside the profile panel ---
  // 'main' shows the profile, 'ratings' shows the ratings screen.
  const [currentView, setCurrentView] = useState('main');

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300, // This value should be related to the screen width for a slide-out effect
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  // --- This function now handles closing the entire panel ---
  // It also resets the view to 'main' for the next time it opens.
  const handleClose = () => {
    onClose();
    // Use a timeout to allow the slide-out animation to finish before resetting the view
    setTimeout(() => {
      setCurrentView('main');
    }, 300);
  };

  const handleLogout = async () => {
    handleClose(); // Close the panel first
    console.log('Logging out...');
    await AsyncStorage.multiRemove(['isLoggedIn', 'language', 'locationPermission', 'onboardingCompleted']);
    navigation.reset({
      index: 0,
      routes: [{ name: 'LanguageSelection' }],
    });
  };

  // --- Main Profile View Component ---
  // This keeps the JSX clean and organized.
  const MainProfileView = () => (
    <>
      <Appbar.Header>
        <Appbar.Content title="Profile" />
        <Appbar.Action icon="close" onPress={handleClose} />
      </Appbar.Header>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ color: theme.colors.onSurface, fontSize: 18, marginBottom: 20 }}>
          User Profile Info
        </Text>
        {/* This button now just changes the state, not navigates */}
        <Button title="View Driver Ratings" onPress={() => setCurrentView('ratings')} />
        <View style={{ marginTop: 10 }}>
          <Button title="Logout" onPress={handleLogout} color={theme.colors.error} />
        </View>
      </View>
    </>
  );

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      animationType="none"
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleClose}>
        <Animated.View
          style={[
            styles.profileContainer,
            {
              backgroundColor: theme.colors.surface,
              transform: [{ translateX: slideAnim }],
            },
          ]}
          // This prevents a press inside the panel from closing it
          onStartShouldSetResponder={() => true} 
        >
          {/* --- Conditional Rendering --- */}
          {/* We show one view or the other based on the state */}
          {currentView === 'main' ? (
            <MainProfileView />
          ) : (
            <DriverRatingsScreen onBack={() => setCurrentView('main')} />
          )}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    // No justifyContent or alignItems, so the TouchableOpacity covers the whole screen
  },
  profileContainer: {
    width: '90%',
    height: '100%',
    position: 'absolute',
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ProfileScreen;
