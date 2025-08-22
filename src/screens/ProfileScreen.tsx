import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Modal, Animated, Button } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface ProfileScreenProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleLogout = async () => {
    // 1. Close the modal to reveal the screen underneath
    onClose();
    console.log('Logging out...');
    // 2. Remove the login flag from storage
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('language');
    await AsyncStorage.removeItem('locationPermission');
    await AsyncStorage.removeItem('onboardingCompleted');
    // 3. Reset the navigation stack to the Login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'LanguageSelection' }], // Navigate to Login, not LanguageSelection
    });
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="none" // Use our own animation
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.profileContainer,
            {
              backgroundColor: theme.colors.surface,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <Appbar.Header>
            <Appbar.Content title="Profile" />
            <Appbar.Action icon="close" onPress={onClose} />
          </Appbar.Header>
          <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ color: theme.colors.onSurface }}>
              User Profile Info
            </Text>
            {/* Add more profile details here */}
            <Button title="Logout" onPress={handleLogout} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  profileContainer: {
    width: '80%',
    height: '100%',
  },
});

export default ProfileScreen;