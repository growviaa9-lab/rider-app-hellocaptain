import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MapComponent from '../components/Map';

interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface RideRequest {
  id: string;
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  distance: string;
  earnings: string;
  customerRating: number;
  timer: number;
}

const MapScreen: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [currentEarnings] = useState('₹3,467.00');
  const [driverName] = useState('Aditya');
  const [rideRequest, setRideRequest] = useState<RideRequest | null>(null);

  // Mock ride request data - in real app this would come from API
  const mockRideRequest: RideRequest = {
    id: '123',
    pickupLocation: {
      latitude: 27.7172,
      longitude: 85.3240,
      address: 'Tribhuvan International Airport, Ring Rd, Kathmandu 44600, Nepal',
    },
    dropLocation: {
      latitude: 27.7021,
      longitude: 85.3370,
      address: 'MoneyGram, Maitidevi 29 Maitidevi Chowk, Kathmandu 44600, Nepal',
    },
    distance: '5.1 KM',
    earnings: '₹54 - ₹78',
    customerRating: 4,
    timer: 50,
  };

  const handleLocationUpdate = (location: Location) => {
    console.log('Driver location updated:', location);
    // Here you would typically send the location to your backend
  };

  const handleToggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    
    // Simulate receiving a ride request when going online
    if (!isOnline) {
      setTimeout(() => {
        setRideRequest(mockRideRequest);
      }, 3000); // Show ride request after 3 seconds
    } else {
      setRideRequest(null);
    }
  };

  const handleAcceptRide = (rideId: string) => {
    console.log('Ride accepted:', rideId);
    setRideRequest(null);
    // Here you would navigate to the ride in progress screen
    // and start navigation to pickup location
  };

  const handleRejectRide = (rideId: string) => {
    console.log('Ride rejected:', rideId);
    setRideRequest(null);
    // Continue looking for new rides
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapComponent
        onLocationUpdate={handleLocationUpdate}
        isOnline={isOnline}
        onToggleOnlineStatus={handleToggleOnlineStatus}
        currentEarnings={currentEarnings}
        driverName={driverName}
        rideRequest={rideRequest}
        onAcceptRide={handleAcceptRide}
        onRejectRide={handleRejectRide}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default MapScreen;
