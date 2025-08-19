import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Appbar, Text, useTheme, Card, Divider } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import base64 from 'base-64';

// --- Type Definitions ---

// --- FIX: Expanded the Ride interface to include all necessary data ---
// This now includes coordinates and other details for the detail screen.
interface Ride {
  id: string;
  pickup_address: string;
  destination_address: string;
  order_time: string;
  price: string;
  status: string;
  service: string;
  start_latitude: string;
  start_longitude: string;
  end_latitude: string;
  end_longitude: string;
  // You can add any other fields from the API you might need
}

// The params for ALL screens in your stack
type RootStackParamList = {
  RideHistory: undefined;
  RidesDetail: { ride: Ride }; // RidesDetail expects the full Ride object
};

// Props for the RideItem component
interface RideItemProps {
  ride: Ride;
  onPress: () => void;
}

// --- Helper Function ---

const getStatusText = (status: string) => {
  switch (status) {
    case '2': return 'Accepted';
    case '3': return 'In Progress';
    case '4': return 'Finished';
    case '5': return 'Canceled';
    default: return 'Pending';
  }
};

// --- UI Components ---

const RideItem: React.FC<RideItemProps> = ({ ride, onPress }) => {
  const { colors } = useTheme();
  
  const rideDate = new Date(ride.order_time).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Title
        title={ride.service}
        subtitle={rideDate}
        right={(props) => <Text {...props} style={styles.price}>{`₹${ride.price}`}</Text>}
      />
      <Card.Content>
        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>From:</Text>
          <Text style={styles.addressText}>{ride.pickup_address}</Text>
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>To: </Text>
          <Text style={styles.addressText}>{ride.destination_address}</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <Text style={[styles.status, { color: getStatusText(ride.status) === 'Finished' ? 'green' : 'red' }]}>
          {getStatusText(ride.status)}
        </Text>
      </Card.Actions>
    </Card>
  );
};


// --- Main Screen Component ---

const RidesScreen: React.FC<StackScreenProps<RootStackParamList, 'RideHistory'>> = ({ navigation }) => {
  const theme = useTheme();
  const driverId = 'D1754461954'; 

  
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRides = async () => {
      if (!driverId) {
        setError("Driver ID not found.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('https://app.hellocaptain.in/api/driver/history_progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + base64.encode('user:pass'), // Replace with actual credentials
          },
          body: JSON.stringify({ id: driverId }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ride history. Server responded with ${response.status}`);
        }

        const json = await response.json();

        if (json.status === true && Array.isArray(json.data)) {
          setRides(json.data);
        } else {
          throw new Error(json.message || 'API returned an unexpected data format.');
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [driverId]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (error) {
    return <View style={styles.center}><Text style={styles.errorText}>Error: {error}</Text></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Ride History" />
      </Appbar.Header>

      <FlatList
        data={rides}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <RideItem
            ride={item}
            // This function calls navigate and passes the entire ride object.
            onPress={() => navigation.navigate('RidesDetail', { ride: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<View style={styles.center}><Text>No rides found.</Text></View>}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  listContent: { paddingVertical: 8 },
  card: { marginVertical: 4, marginHorizontal: 12 },
  price: { fontSize: 16, fontWeight: 'bold', marginRight: 16 },
  addressContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  addressLabel: { fontWeight: 'bold', marginRight: 8 },
  addressText: { flex: 1, color: '#666' },
  status: { marginLeft: 8, fontWeight: 'bold' },
  errorText: { textAlign: 'center' },
});

export default RidesScreen;
