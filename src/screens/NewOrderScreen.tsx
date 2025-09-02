import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import the firestore library
import firestore from '@react-native-firebase/firestore';

const NewOrderScreen = ({ route }: { route: any }) => {
  const { rideData } = route.params;
  const navigation = useNavigation();
  const [timer, setTimer] = useState(60);
  const [bidAmount, setBidAmount] = useState(0);

  useEffect(() => {
    if (rideData && rideData.price) {
      setBidAmount(parseFloat(rideData.price));
    }
  }, [rideData]);


  const handlePlaceBid = async () => {
    // --- MODIFICATION START ---
    // Using static user data to bypass the "user not found" error for testing.
    
    const staticUser = {
      id: 'D1754461954',       // The static driver ID you provided
      fullName: 'Test Driver',  // A placeholder name
      rating: '4.9',            // A placeholder rating
    };

    /*
    // This section is temporarily commented out to use static data.
    const userData = await AsyncStorage.getItem('user');
    if (!userData) {
      Alert.alert('Error', 'Could not find user data. Please log in again.');
      return;
    }
    const user = JSON.parse(userData);
    */

    // We now use the staticUser object directly.
    const user = staticUser; 
    const driverId = user.id;
    // --- MODIFICATION END ---
    
    const rideId = rideData.id; 
    console.log("driver id: ", driverId);
    if (!rideId) {
        Alert.alert('Error', 'Ride ID is missing from the ride data. Cannot place bid.');
        return;
    }

    const bidData = {
      amount: bidAmount.toFixed(2),
      driver_id: driverId,
      name: user.fullName, // Using name from our static object
      rating: user.rating, // Using rating from our static object
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    console.log(`--- Placing Bid on Ride ID: ${rideId} ---`);
    console.log("Bid Data:", bidData);

    try {
      await firestore()
        .collection('ride_bids')
        .doc(rideId)
        .collection('bids')
        .add(bidData);

      Alert.alert('Success', 'Your bid has been placed successfully!');
      navigation.goBack();

    } catch (error) {
      console.error("Error placing bid in Firestore:", error);
      Alert.alert('Error', 'An error occurred while placing your bid.');
    }
  };

  const handleRejectRide = () => {
    console.log('Ride Rejected');
    navigation.goBack();
  };

  useEffect(() => {
    if (timer === 0) {
      handleRejectRide();
      return;
    }
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleIncreaseBid = () => {
    setBidAmount(prevAmount => prevAmount + 10);
  };

  const handleDecreaseBid = () => {
    const originalPrice = (rideData && parseFloat(rideData.price)) || 0;
    setBidAmount(prevAmount => Math.max(originalPrice, prevAmount - 10));
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {/* UI now uses rideData prop again */}
          <View style={styles.topPanel}>
            <Avatar.Icon size={50} icon="car" style={styles.serviceIcon} color="#FFF" />
            <View style={styles.serviceDetails}>
              <Title style={styles.serviceTitle}>New Booking Request</Title>
              <Paragraph style={styles.serviceDescription}>{rideData.layanan || 'Delivery Service'}</Paragraph>
            </View>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{timer}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Title style={styles.sectionTitle}>Location Details</Title>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>{rideData.pickup_address || 'Pickup address not available'}</Text>
          </View>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>{rideData.destination_address || 'Destination address not available'}</Text>
          </View>
          <View style={styles.divider} />
          <Title style={styles.sectionTitle}>Order Summary</Title>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Distance</Text>
            <Text style={styles.detailValue}>{rideData.distance ? `${rideData.distance} KM` : 'N/A'}</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.detailRow}>
            <Title style={styles.totalLabel}>Original Fare</Title>
            <Title style={styles.totalValue}>₹{rideData.price || '0.00'}</Title>
          </View>

          <View style={styles.divider} />
          <Title style={styles.sectionTitle}>Adjust Fare (Bid)</Title>
          <View style={styles.bidContainer}>
              <Button mode="contained" onPress={handleDecreaseBid} style={styles.bidButton} icon="minus" />
              <Text style={styles.bidAmountText}>₹{bidAmount.toFixed(2)}</Text>
              <Button mode="contained" onPress={handleIncreaseBid} style={styles.bidButton} icon="plus" />
          </View>
          
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button mode="contained" onPress={handleRejectRide} style={[styles.button, styles.rejectButton]} labelStyle={styles.buttonLabel}>
            Reject
          </Button>
          <Button mode="contained" onPress={handlePlaceBid} style={[styles.button, styles.acceptButton]} labelStyle={styles.buttonLabel}>
            Place Bid
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  card: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  topPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  serviceIcon: {
    backgroundColor: '#61dafb',
  },
  serviceDetails: {
    flex: 1,
    marginLeft: 15,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4d4a4a',
  },
  serviceDescription: {
    color: '#4d4a4a',
    fontSize: 14,
  },
  timerContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff4d4f',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 15,
    color: '#4d4a4a',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  locationText: {
    fontSize: 16,
    flex: 1,
    color: '#4d4a4a',
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    color: '#4d4a4a',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4d4a4a',
  },
  totalDivider: {
    height: 2,
    backgroundColor: '#000101',
    marginVertical: 15,
    marginHorizontal: 15,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e4d5f',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e4d5f',
  },
  bidContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bidButton: {
    borderRadius: 20,
    minWidth: 50,
  },
  bidAmountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e4d5f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 120,
    textAlign: 'center',
  },
  actions: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  rejectButton: {
    backgroundColor: '#ff4d4f',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  buttonLabel: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NewOrderScreen;
