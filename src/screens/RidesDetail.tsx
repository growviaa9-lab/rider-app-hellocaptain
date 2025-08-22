import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar, Text, useTheme, Card, Divider, Icon, Button } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

// --- (Your Type Definitions and Helper Functions remain the same) ---
interface Ride {
  id: string;
  pickup_address: string;
  destination_address: string;
  order_time: string;
  finish_time: string;
  price: string;
  status: string;
  service: string;
  start_latitude: string;
  start_longitude: string;
  end_latitude: string;
  end_longitude: string;
  distance: string;
  promo_discount: string;
  wallet_payment: string;
  rate: string;
  transaction_id: string;
  note: string | null;
}

type RootStackParamList = {
  RideHistory: undefined;
  RidesDetail: { ride: Ride };
};

const getStatusText = (status: string) => {
  switch (status) {
    case '2': return 'Accepted';
    case '3': return 'In Progress';
    case '4': return 'Finished';
    case '5': return 'Canceled';
    default: return 'Pending';
  }
};

const formatDistance = (meters: string) => {
    const distanceInKm = parseFloat(meters) / 1000;
    return `${distanceInKm.toFixed(2)} km`;
};

const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    if (!startTime || !endTime || endTime < startTime) return 'N/A';
    const diffInMinutes = Math.round((endTime - startTime) / 60000);
    if (diffInMinutes < 1) return '< 1 minute';
    return `${diffInMinutes} minutes`;
};

const renderRating = (rate: string) => {
    const rating = parseInt(rate, 10);
    if (isNaN(rating) || rating < 1) return 'Not Rated';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};
// --- End of Helper Functions ---


const RidesDetail: React.FC<StackScreenProps<RootStackParamList, 'RidesDetail'>> = ({ route, navigation }) => {
  const theme = useTheme();
  const { ride } = route.params;
  const [isMapFullScreen, setMapFullScreen] = useState(false);
  
  const mapRef = useRef<MapView>(null);

  const GOOGLE_MAPS_APIKEY = 'AIzaSyDkItrax9ZjpfcgfjeqWaBa-jUzuis9Ts8';

  const statusText = getStatusText(ride.status);
  const statusColor = statusText === 'Finished' ? theme.colors.primary : theme.colors.error;

  const origin = {
    latitude: parseFloat(ride.start_latitude),
    longitude: parseFloat(ride.start_longitude),
  };
  const destination = {
    latitude: parseFloat(ride.end_latitude),
    longitude: parseFloat(ride.end_longitude),
  };
  
  const handleMapReady = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([origin, destination], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const MapWithRoute = () => (
    <View style={isMapFullScreen ? styles.fullScreenMapContainer : styles.mapContainer}>
      <MapView
        ref={mapRef}
        onMapReady={handleMapReady}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={false}
      >
        <Marker coordinate={origin} title="Pickup" pinColor="green" />
        <Marker coordinate={destination} title="Drop-off" pinColor="red" />
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor={theme.colors.mapstroke || '#FF6B35'}
        />
      </MapView>
      {!isMapFullScreen && (
        <TouchableOpacity
          style={styles.absFullscreenButton}
          onPress={() => setMapFullScreen(true)}
        >
          <Text style={styles.absFullscreenButtonText}>Fullscreen</Text>
          {/* <Icon source="fullscreen" size={24} color="#333" /> */}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Ride Details" />
      </Appbar.Header>

      {isMapFullScreen ? (
        <View style={styles.fullScreenMap}>
          <MapWithRoute />
          <TouchableOpacity
            style={styles.exitFullscreenButton}
            onPress={() => setMapFullScreen(false)}
          >
            <Icon source="fullscreen-exit" size={24} color="#333" />
            <Text style={{ marginLeft: 8 }}>Exit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <MapWithRoute />
          {/* <Button mode="contained" onPress={() => setMapFullScreen(true)} style={styles.fullscreenButton}>
            Fullscreen Map
          </Button> */}
          <Card style={styles.card}>
            <Card.Title
              title={ride.service}
              titleStyle={styles.cardTitle}
            />
            <Divider />
            <Card.Content style={styles.cardContent}>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                  <Icon source="map-marker-distance" size={24} color={theme.colors.primary}/>
                  <Text style={styles.summaryText}>{formatDistance(ride.distance)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Icon source="clock-outline" size={24} color={theme.colors.primary}/>
                  <Text style={styles.summaryText}>{calculateDuration(ride.order_time, ride.finish_time)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Icon source="star-outline" size={24} color={theme.colors.primary}/>
                  <Text style={styles.summaryText}>{renderRating(ride.rate)}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.label}>From:</Text>
                <Text style={[styles.value, styles.address]}>{ride.pickup_address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>To:</Text>
                <Text style={[styles.value, styles.address]}>{ride.destination_address}</Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.label}>Final Price:</Text>
                <Text style={styles.valuePrice}>{`₹${ride.price}`}</Text>
              </View>
              {parseFloat(ride.promo_discount) > 0 && (
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Discount:</Text>
                  <Text style={styles.value}>{`- ₹${ride.promo_discount}`}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text style={styles.label}>Payment:</Text>
                <Text style={styles.value}>{ride.wallet_payment === '1' ? 'Wallet' : 'Cash'}</Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.label}>Status:</Text>
                <Text style={[styles.value, { color: statusColor, fontWeight: 'bold' }]}>{statusText}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Note:</Text>
                <Text style={[styles.value, styles.address]}>{ride.note ? ride.note : "We hope you had a great ride!"}</Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6e6e6ff' },
  scrollContent: { paddingBottom: 30 },
  mapContainer: {
    height: 300,
    backgroundColor: '#ffffffff',
    position: 'relative', // To position the absolute button
    // top: -50,
  },
  fullScreenMapContainer: {
    ...StyleSheet.absoluteFillObject,
    top: 56,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card: {
    elevation: 3,
    margin: 10,
    marginTop: 0,
    backgroundColor: '#ffffffff', // Light grey background for a 3D feel
    borderRadius: 8,
  },
  cardTitle: { fontSize: 22, fontWeight: 'bold' },
  cardContent: { paddingTop: 16 },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryItem: { alignItems: 'center', width: 100 },
  summaryText: { marginTop: 4, fontSize: 14, fontWeight: '500' },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  label: { fontSize: 16, color: '#666', fontWeight: 'bold', width: '40%' },
  value: { fontSize: 16, color: '#333', flex: 1, textAlign: 'right' },
  valuePrice: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  address: { textAlign: 'right' },
  divider: { marginVertical: 12 },
  fullscreenButton: {
    margin: 16,
  },
  fullScreenMap: {
    flex: 1,
  },
  exitFullscreenButton: {
    position: 'absolute',
    top: 64,
    left: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 3,
  },
  absFullscreenButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default RidesDetail;