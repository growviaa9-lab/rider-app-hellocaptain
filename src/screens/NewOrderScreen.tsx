import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Buffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Optional: for playing a sound
// import SoundPlayer from 'react-native-sound-player';

const API_CONFIG = {
  AUTH_USER: 'hellocaptain',
  AUTH_PASS: 'hellocaptain@123',
};

const NewOrderScreen = ({ route }: { route: any }) => {
  const { rideData } = route.params;
  const navigation = useNavigation();
  const [timer, setTimer] = useState(60); // Timer is now 60 seconds

  // --- Sound Effect on Screen Load ---
  useEffect(() => {
    try {
      // Uncomment this line if you add a sound library
      // SoundPlayer.playSoundFile('notification_sound', 'mp3');
    } catch (e) {
      console.log(`cannot play sound file`, e);
    }

    // Cleanup sound on unmount
    return () => {
      try {
        // SoundPlayer.stop();
      } catch(e) {
        console.log('cannot stop sound', e);
      }
    };
  }, []);


  const handleAcceptRide = async () => {
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const driverId = user ? user.id : 'D1754461954';

    const basicAuthToken = Buffer.from(`${API_CONFIG.AUTH_USER}:${API_CONFIG.AUTH_PASS}`).toString('base64');

    try {
      const response = await fetch('https://app.hellocaptain.in/api/driver/accept', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${basicAuthToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: driverId, transaction_id: rideData.transaction_id }),
      });
      const result = await response.json();
      if (result.message === 'berhasil') {
        Alert.alert('Success', 'Ride has been accepted!');
        navigation.goBack();
      } else {
        Alert.alert('Failed', `Could not accept ride: ${result.message}`);
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while accepting the ride.');
      navigation.goBack();
    }
  };

  const handleRejectRide = () => {
    // In a full implementation, you might want to call a 'reject' API here
    console.log('Ride Rejected');
    navigation.goBack();
  };

  // Countdown timer effect
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

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Top Panel */}
          <View style={styles.topPanel}>
            <Avatar.Icon size={50} icon="car" style={styles.serviceIcon} />
            <View style={styles.serviceDetails}>
              <Title style={styles.serviceTitle}>Booking</Title>
              <Paragraph style={styles.serviceDescription}>Delivery Service</Paragraph>
            </View>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{timer}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Location Details */}
          <Title style={styles.sectionTitle}>Location</Title>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>{rideData.pickup_address}</Text>
          </View>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>{rideData.destination_address}</Text>
          </View>

          <View style={styles.divider} />
          
          {/* Order Details */}
          <Title style={styles.sectionTitle}>Order Detail</Title>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Distance</Text>
            <Text style={styles.detailValue}>{rideData.distance} KM</Text>
          </View>
          
          <View style={styles.totalDivider} />

          <View style={styles.detailRow}>
            <Title style={styles.totalLabel}>Total</Title>
            <Title style={styles.totalValue}>₹{rideData.price}</Title>
          </View>

        </Card.Content>

        {/* Action Buttons */}
        <Card.Actions style={styles.actions}>
          <Button 
            mode="contained" 
            onPress={handleRejectRide} 
            style={[styles.button, styles.rejectButton]}
            labelStyle={styles.buttonLabel}
          >
            Reject
          </Button>
          <Button 
            mode="contained" 
            onPress={handleAcceptRide} 
            style={[styles.button, styles.acceptButton]}
            labelStyle={styles.buttonLabel}
          >
            Accept
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Aligns the card to the bottom
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  topPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  serviceIcon: {
    backgroundColor: '#f0f0f0',
  },
  serviceDetails: {
    flex: 1,
    marginLeft: 15,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  serviceDescription: {
    color: 'grey',
  },
  timerContainer: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes it a circle
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  locationIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
  },
  locationText: {
    fontSize: 15,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 15,
    color: 'grey',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  totalDivider: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    height: 45,
    justifyContent: 'center',
  },
  rejectButton: {
    backgroundColor: '#E53935', // Red color for reject
    marginRight: 10,
  },
  acceptButton: {
    backgroundColor: '#43A047', // Green color for accept
  },
  buttonLabel: {
    fontSize: 16,
    color: 'white',
  },
});

export default NewOrderScreen;
