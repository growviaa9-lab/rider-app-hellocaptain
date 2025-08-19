import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Text, useTheme, Card, Divider, Icon } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';

// --- Type Definitions ---
// Expanded to include all useful fields from the API response.
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
  distance: string; // in meters
  promo_discount: string;
  wallet_payment: string; // "1" for true, "0" for false
  rate: string; // e.g., "5"
  transaction_id: string;
  note: string | null;
}

type RootStackParamList = {
  RideHistory: undefined;
  RidesDetail: { ride: Ride };
};

// --- Helper Functions ---
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


// --- Main Screen Component ---
const RidesDetail: React.FC<StackScreenProps<RootStackParamList, 'RidesDetail'>> = ({ route, navigation }) => {
  const theme = useTheme();
  const { ride } = route.params;
  
  const statusText = getStatusText(ride.status);
  const statusColor = statusText === 'Finished' ? theme.colors.primary : theme.colors.error;

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Ride Details" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- Map Placeholder --- */}
        <View style={styles.mapPlaceholder}>
            <Icon source="map-outline" size={60} color={`${theme.colors.primary}60`} />
            <Text style={[styles.mapPlaceholderText, { color: `${theme.colors.primary}90` }]}>
                Your ride map will appear here
            </Text>
        </View>

        <Card style={styles.card}>
          <Card.Title
            title={ride.service}
            subtitle={`ID: ${ride.id}`}
            titleStyle={styles.cardTitle}
          />
          <Divider />
          <Card.Content style={styles.cardContent}>
            {/* --- Ride Summary --- */}
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

            {/* --- Address Details --- */}
            <View style={styles.detailRow}>
              <Text style={styles.label}>From:</Text>
              <Text style={[styles.value, styles.address]}>{ride.pickup_address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>To:</Text>
              <Text style={[styles.value, styles.address]}>{ride.destination_address}</Text>
            </View>
            <Divider style={styles.divider} />

            {/* --- Payment Details --- */}
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

            {/* --- Other Details --- */}
            <View style={styles.detailRow}>
              <Text style={styles.label}>Status:</Text>
              <Text style={[styles.value, { color: statusColor, fontWeight: 'bold' }]}>{statusText}</Text>
            </View>
             <View style={styles.detailRow}>
              <Text style={styles.label}>Transaction ID:</Text>
              <Text style={styles.value}>{ride.transaction_id}</Text>
            </View>
            {ride.note && (
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Note:</Text>
                    <Text style={[styles.value, styles.address]}>{ride.note}</Text>
                </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 16 },
  mapPlaceholder: {
    height: 300,
    backgroundColor: '#F0F4F8', // A light, refreshing blue-gray
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mapPlaceholderText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    elevation: 4,
    margin: 16,
    marginTop: -50, // Overlap the placeholder for a professional look
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
});

export default RidesDetail;
