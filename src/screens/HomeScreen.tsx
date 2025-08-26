import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Appbar, Avatar, Text } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import MapComponent from '../components/Map';
import { Buffer } from 'buffer';

// --- 1. API Configuration ---
const API_CONFIG = {
  BASE_URL: 'https://app.hellocaptain.in/api',
  AUTH_USER: 'hellocaptain',
  AUTH_PASS: 'hellocaptain@123',
};

// Create the Basic Auth token once
const basicAuthToken = Buffer.from(`${API_CONFIG.AUTH_USER}:${API_CONFIG.AUTH_PASS}`).toString('base64');

// --- Interfaces ---
interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
  bearing?: number;
}

interface DriverProfile {
  id: string;
  driver_name: string;
  phone_number: string;
}

interface HomeScreenProps {
  onProfilePress: () => void;
}

// --- Component ---
const HomeScreen: React.FC<HomeScreenProps> = ({ onProfilePress }) => {
  const { theme } = useTheme();
  const [isOnline, setIsOnline] = useState(false);
  const [currentEarnings] = useState('₹3,467.00');
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  // ADDED: Loading state to provide user feedback while fetching initial data
  const [isLoading, setIsLoading] = useState(true);

  // This hook fetches the driver's profile and initial online status
  useEffect(() => {
    const loggedInDriverCredentials = {
      id: 'D1754461954',
      phone_number: '918218289370',
    };

    const fetchDriverProfile = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/driver/syncronizing_account`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basicAuthToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: loggedInDriverCredentials.id,
            phone_number: loggedInDriverCredentials.phone_number,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          // More robust check on the response data
          if (result.message === 'success' && Array.isArray(result.data_driver) && result.data_driver.length > 0) {
            const profile = result.data_driver[0];
            setDriverProfile(profile);
            // The API sends status as a string '1' for online
            const isDriverOnline = result.driver_status === '1';
            setIsOnline(isDriverOnline);
          } else {
            console.error("API Error: Unexpected response structure", result);
            Alert.alert('Error', 'Could not retrieve your driver profile. The server returned an unexpected response.');
          }
        } else {
          const errorText = await response.text();
          console.error("API Error: Failed to connect", response.status, errorText);
          Alert.alert('Error', `Failed to connect to the server (Status: ${response.status}).`);
        }
      } catch (error) {
        console.error('Error fetching driver profile:', error);
        Alert.alert('Error', 'A network error occurred while fetching your profile.');
      } finally {
        // Ensure loading is always turned off after the fetch attempt
        setIsLoading(false);
      }
    };

    fetchDriverProfile();
  }, []);

  // --- Handler Functions ---
  const handleLocationUpdate = async (location: Location) => {
    // Guard clause: Don't send updates if the profile isn't loaded yet
    if (!driverProfile) {
        console.log("Location update skipped: Driver profile not loaded yet.");
        return;
    }
    try {
      // UPDATED: Check the response to see if the update was successful
      const response = await fetch(`${API_CONFIG.BASE_URL}/driver/update_location`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${basicAuthToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          bearing: location.bearing || 0,
          driver_id: driverProfile.id,
        }),
      });
      if (!response.ok) {
          // Provide feedback if the location update fails
          console.warn('Could not sync location with server.');
      } else {
          console.log(`Location updated successfully: ${location.latitude}, ${location.longitude}`);
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  // UPDATED: This function now waits for server confirmation before updating the UI
  const handleToggleOnlineStatus = async () => {
    if (!driverProfile) return;
    
    const newStatus = !isOnline;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/driver/turning_on`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${basicAuthToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: driverProfile.id, is_turn: newStatus }),
      });

      const result = await response.json();
      
      // Only update the UI state if the server confirms the change
      if (response.ok && result.message === 'success') {
        setIsOnline(newStatus);
      } else {
        Alert.alert('Error', 'Could not update status. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'A network error occurred while updating your status.');
    }
  };

  // Show a loading screen while the initial profile is being fetched
  // if (isLoading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color={theme.colors.primary} />
  //       <Text style={styles.loadingText}>Syncing your account...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title={`Hello ${driverProfile?.driver_name || 'Captain'}`} />
        <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
          <Avatar.Icon size={36} icon="account-circle" />
        </TouchableOpacity>
      </Appbar.Header>

      <MapComponent
        onLocationUpdate={handleLocationUpdate}
        isOnline={isOnline}
        onToggleOnlineStatus={handleToggleOnlineStatus}
        currentEarnings={currentEarnings}
        driverName={driverProfile?.driver_name || ''}
        showHeader={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  profileButton: { marginRight: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
  },
});

export default HomeScreen;
