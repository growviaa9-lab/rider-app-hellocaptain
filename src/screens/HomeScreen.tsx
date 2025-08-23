import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext'; // Assuming you have this context
import MapComponent from '../components/Map';
import firestore from '@react-native-firebase/firestore';
import { Buffer } from 'buffer'; // Import Buffer for Basic Auth

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

interface RideRequest {
  id: string;
  pickupLocation: { latitude: number; longitude: number; address: string; };
  dropLocation: { latitude: number; longitude: number; address: string; };
  distance: string;
  earnings: string;
  customerRating: number;
  timer: number;
}

interface DriverProfile {
  id: string;
  driver_name: string;
  phone_number: string;
  // Add other fields as needed
}

interface HomeScreenProps {
  onProfilePress: () => void;
}

// --- Component ---
const HomeScreen: React.FC<HomeScreenProps> = ({ onProfilePress }) => {
  const { theme } = useTheme();
  const [isOnline, setIsOnline] = useState(false);
  const [currentEarnings] = useState('₹3,467.00');
  const [rideRequest, setRideRequest] = useState<RideRequest | null>(null);
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);

  // --- useEffect to Fetch Initial Driver Profile & Status ---
  useEffect(() => {
    // In a real app, this object would come from your login/auth state
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
          if (result.message === 'success' && result.data_driver && result.data_driver.length > 0) {
            const profile = result.data_driver[0];
            setDriverProfile(profile);
            const isDriverOnline = result.driver_status === '1';
            setIsOnline(isDriverOnline);
            console.log(`Profile for ${profile.driver_name} loaded. Initial status: ${isDriverOnline ? 'Online' : 'Offline'}`);
          } else {
            Alert.alert('Error', 'Could not retrieve your driver profile. Response: ' + result.message);
          }
        } else {
          Alert.alert('Error', `Failed to connect to the server. Status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching driver profile:', error);
        Alert.alert('Error', 'A network error occurred while fetching your profile.');
      }
    };

    fetchDriverProfile();
  }, []); // Empty array means this runs only once when the screen loads

  // --- Firestore listener for rides ---
  useEffect(() => {
    if (!isOnline || !driverProfile) {
      if (rideRequest) setRideRequest(null);
      return;
    }

    const unsubscribe = firestore()
      .collection('ride_bids')
      .where('bid', '==', 'true')
      .limit(1)
      .onSnapshot(querySnapshot => {
        const newBids: RideRequest[] = [];
        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          newBids.push({
            id: documentSnapshot.id,
            // --- THE FIX IS HERE ---
            // Explicitly convert coordinate strings from Firestore to numbers
            pickupLocation: {
              latitude: Number(data.start_latitude),
              longitude: Number(data.start_longitude),
              address: data.pickup_address,
            },
            dropLocation: {
              latitude: Number(data.end_latitude),
              longitude: Number(data.end_longitude),
              address: data.destination_address,
            },
            distance: `${data.distance} KM`,
            earnings: `₹${data.final_cost}`,
            customerRating: data.rate || 4.5,
            timer: 50,
          });
        });
        setRideRequest(newBids.length > 0 ? newBids[0] : null);
      }, error => {
        console.error("Firestore Listener Error:", error);
        Alert.alert("Listener Error", "Could not fetch new rides. Check your Firestore rules and connectivity.");
      });

    return () => unsubscribe();
  }, [isOnline, driverProfile]);

  // --- Handler Functions (No changes needed below this line) ---
  const handleLocationUpdate = async (location: Location) => {
    if (!driverProfile) return;
    try {
      await fetch(`${API_CONFIG.BASE_URL}/driver/update_location`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${basicAuthToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          bearing: location.bearing || 0,
          driver_id: driverProfile.id,
        }),
      });
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleToggleOnlineStatus = async () => {
    if (!driverProfile) return;
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/driver/turning_on`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${basicAuthToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: driverProfile.id, is_turn: newStatus }),
      });
      const result = await response.json();
      if (result.message !== 'success') {
        Alert.alert('Error', 'Could not update status. Please try again.');
        setIsOnline(!newStatus);
      }
    } catch (error) {
      Alert.alert('Error', 'A network error occurred.');
      setIsOnline(!newStatus);
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    if (!driverProfile) return;
    try {
      await firestore().collection('ride_bids').doc(rideId).update({
        bid: 'false',
        driver_id: driverProfile.id
      });
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/driver/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${basicAuthToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: driverProfile.id, transaction_id: rideId }),
      });

      const result = await response.json();
      if (result.message === 'berhasil') {
        Alert.alert('Success', 'Ride has been accepted!');
        setRideRequest(null);
      } else {
        Alert.alert('Failed', `Could not accept ride: ${result.message}`);
        await firestore().collection('ride_bids').doc(rideId).update({ bid: 'true' });
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while accepting the ride.');
      await firestore().collection('ride_bids').doc(rideId).update({ bid: 'true' });
    }
  };

  const handleRejectRide = async (rideId: string) => {
    console.log('Ride rejected:', rideId);
    try {
       await firestore().collection('ride_bids').doc(rideId).update({
         bid: 'false',
       });
       setRideRequest(null);
    } catch (error) {
      console.error('Error rejecting ride:', error);
      Alert.alert('Error', 'Could not reject ride.');
    }
  };

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
        rideRequest={rideRequest}
        onAcceptRide={handleAcceptRide}
        onRejectRide={handleRejectRide}
        showHeader={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  profileButton: { marginRight: 16 },
});

export default HomeScreen;