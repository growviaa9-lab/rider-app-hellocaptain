
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform, // Import Platform
  PermissionsAndroid, // Import PermissionsAndroid for Android
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get('window');

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

interface MapComponentProps {
  onLocationUpdate?: (location: Location) => void;
  isOnline?: boolean;
  onToggleOnlineStatus?: () => void;
  currentEarnings?: string;
  driverName?: string;
  rideRequest?: RideRequest | null;
  onAcceptRide?: (rideId: string) => void;
  onRejectRide?: (rideId: string) => void;
  showHeader?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  onLocationUpdate,
  isOnline = false,
  onToggleOnlineStatus,
  currentEarnings = '₹3,467.00',
  driverName = 'Aditya',
  rideRequest,
  onAcceptRide,
  onRejectRide,
  showHeader = true,
}) => {
  const [location, setLocation] = useState<Location>({
    latitude: 27.7172,
    longitude: 85.3240,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [_isLookingForRide, setIsLookingForRide] = useState(false);
  const [rideTimer, setRideTimer] = useState(0);
  const mapRef = useRef<MapView>(null);

  // UPDATED: This function now has a fallback for timeout errors.
  const getCurrentLocation = useCallback(() => {
    const handleSuccess = (position: any) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setLocation(newLocation);
      if (onLocationUpdate) {
        onLocationUpdate(newLocation);
      }
      if (mapRef.current) {
        mapRef.current.animateToRegion(newLocation, 1000);
      }
    };

    const handleError = (error: any) => {
      console.error('High-accuracy location error:', error);
      // If the high-accuracy request times out, try again with lower accuracy.
      if (error.code === 3) { // Code 3 is TIMEOUT
        // console.log('High-accuracy timed out. Falling back to low-accuracy...');
        Geolocation.getCurrentPosition(
          handleSuccess,
          (lowAccuracyError) => {
            console.error('Low-accuracy location error:', lowAccuracyError);
            // Alert.alert('Location Error', 'Unable to get current location even with low accuracy. Please check your signal and device settings.');
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 100000 }
        );
      } else {
        // Alert.alert('Location Error', `Unable to get current location. (Code: ${error.code})`);
      }
    };

    // First, try to get a high-accuracy location.
    Geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 15000, // 15 seconds
      maximumAge: 10000,
    });
  }, [onLocationUpdate]);

  // UPDATED: This function correctly handles the permission flow for both platforms.
  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasLocationPermission(true);
          getCurrentLocation();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required.');
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization(
        () => {
          setHasLocationPermission(true);
          getCurrentLocation();
        },
        (error) => {
          console.error("iOS Permission Error:", error);
          Alert.alert('Permission Required', 'Location permission is required.');
        }
      );
    }
  }, [getCurrentLocation]);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  useEffect(() => {
    let locationWatchId: number | null = null;
    if (hasLocationPermission) {
      locationWatchId = Geolocation.watchPosition(
        (position: any) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: location.latitudeDelta,
            longitudeDelta: location.longitudeDelta,
          };
          setLocation(newLocation);
          if (onLocationUpdate) {
            onLocationUpdate(newLocation);
          }
        },
        (error: any) => {
          console.error('Error tracking location:', error);
        },
        { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 }
      );
    }
    
    return () => {
      if (locationWatchId !== null) {
        Geolocation.clearWatch(locationWatchId);
      }
    };
  }, [hasLocationPermission, onLocationUpdate, location.latitudeDelta, location.longitudeDelta]);

  useEffect(() => {
    if (rideRequest && rideRequest.timer > 0) {
      setRideTimer(rideRequest.timer);
      const timer = setInterval(() => {
        setRideTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (onRejectRide) {
              onRejectRide(rideRequest.id);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [rideRequest, onRejectRide]);

  const handleToggleOnlineStatus = () => {
    if (onToggleOnlineStatus) {
      onToggleOnlineStatus();
    }
    setIsLookingForRide(!isOnline);
  };

  const handleAcceptRide = () => {
    if (rideRequest && onAcceptRide) {
      onAcceptRide(rideRequest.id);
    }
  };

  const handleRejectRide = () => {
    if (rideRequest && onRejectRide) {
      onRejectRide(rideRequest.id);
    }
  };

  const renderRideRequestModal = () => {
    if (!rideRequest) return null;

    return (
      <View style={styles.rideRequestModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>New Ride Request</Text>
          
          <View style={styles.timerContainer}>
            <View style={styles.timerCircle}>
              <Text style={styles.timerText}>{rideTimer}</Text>
              <Text style={styles.timerLabel}>sec</Text>
            </View>
          </View>

          <View style={styles.rideDetails}>
            <View style={styles.locationRow}>
              <View style={styles.pickupDot} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Pick Up</Text>
                <Text style={styles.locationAddress}>{rideRequest.pickupLocation.address}</Text>
              </View>
              <Text style={styles.distance}>{rideRequest.distance}</Text>
            </View>

            <View style={styles.locationDivider} />

            <View style={styles.locationRow}>
              <View style={styles.dropDot} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Drop at</Text>
                <Text style={styles.locationAddress}>{rideRequest.dropLocation.address}</Text>
              </View>
            </View>
          </View>

          <View style={styles.rideMetrics}>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Potential Earning:</Text>
              <Text style={styles.metricValue}>{rideRequest.earnings}</Text>
            </View>
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Customer Rating:</Text>
              <View style={styles.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text
                    key={star}
                    style={[
                      styles.star,
                      star <= rideRequest.customerRating ? styles.starFilled : styles.starEmpty
                    ]}
                  >
                    ★
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.skipButton} onPress={handleRejectRide}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptRide}>
              <Text style={styles.acceptButtonText}>Accept Ride</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {showHeader && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          
          <View style={styles.earningsContainer}>
            <Text style={styles.earnings}>{currentEarnings}</Text>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
      )}

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={location}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        showsTraffic={false}
        onMapReady={requestLocationPermission}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
        />

        {isOnline && (
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={2000}
            fillColor="rgba(74, 144, 226, 0.2)"
            strokeColor="rgba(74, 144, 226, 0.5)"
            strokeWidth={2}
          />
        )}

        {rideRequest && (
          <>
            <Marker
              coordinate={rideRequest.pickupLocation}
              title="Pickup Location"
              pinColor="orange"
            />
            <Marker
              coordinate={rideRequest.dropLocation}
              title="Drop Location"
              pinColor="green"
            />
          </>
        )}
      </MapView>

      <View style={styles.bottomContent}>
        <View style={styles.statusSection}>
          <Text style={styles.greeting}>Good Morning! {driverName}</Text>
          <TouchableOpacity 
            style={[styles.statusButton, isOnline ? styles.onlineButton : styles.offlineButton]}
            onPress={handleToggleOnlineStatus}
          >
            <Text style={styles.statusText}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <Text style={styles.statusToggle}>
              {isOnline ? 'Go offline' : 'Go online'}
            </Text>
          </TouchableOpacity>
        </View>

        {isOnline && !rideRequest && (
          <View style={styles.lookingForRideSection}>
            <View style={styles.lookingAnimation}>
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>🚗</Text>
                <Text style={styles.placeholderSubtext}>Looking for rides...</Text>
              </View>
            </View>
            <Text style={styles.lookingTitle}>Looking for a Ride</Text>
            <Text style={styles.lookingSubtitle}>
              You will soon get a ride, please wait for few minutes
            </Text>
            
            <View style={styles.tipContainer}>
              <Text style={styles.tipIcon}>💡</Text>
              <View>
                <Text style={styles.tipTitle}>Tip to Remember</Text>
                <Text style={styles.tipText}>
                  Make sure to "Go Offline" when taking a break.
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, styles.activeNavIcon]}>🏠</Text>
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📍</Text>
          <Text style={styles.navLabel}>Nearby</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navLabel}>Support</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {renderRideRequestModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#333333',
  },
  earningsContainer: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  earnings: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notificationButton: {
    padding: 8,
  },
  notificationIcon: {
    fontSize: 24,
  },
  map: {
    flex: 1,
  },
  bottomContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: height * 0.6,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#333333',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  onlineButton: {
    backgroundColor: '#4CAF50',
  },
  offlineButton: {
    backgroundColor: '#FF6B35',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
  statusToggle: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  lookingForRideSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  lookingAnimation: {
    marginBottom: 20,
  },
  lookingImage: {
    width: 150,
    height: 150,
  },
  lookingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  lookingSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#666666',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#CCCCCC',
  },
  activeNavIcon: {
    color: '#FF6B35',
  },
  navLabel: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  activeNavLabel: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  rideRequestModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  timerLabel: {
    fontSize: 12,
    color: '#FF6B35',
  },
  rideDetails: {
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
    marginRight: 15,
  },
  dropDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 15,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  distance: {
    fontSize: 12,
    color: '#666666',
  },
  locationDivider: {
    width: 2,
    height: 20,
    backgroundColor: '#E0E0E0',
    marginLeft: 5,
    marginVertical: 5,
  },
  rideMetrics: {
    marginBottom: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#333333',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  starRating: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    marginHorizontal: 1,
  },
  starFilled: {
    color: '#FF6B35',
  },
  starEmpty: {
    color: '#E0E0E0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF6B35',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  acceptButton: {
    flex: 2,
    paddingVertical: 15,
    backgroundColor: '#FF6B35',
    borderRadius: 25,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholderImage: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 75,
  },
  placeholderText: {
    fontSize: 40,
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default MapComponent;

