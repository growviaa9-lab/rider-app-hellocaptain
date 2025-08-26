import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

// --- TypeScript Interfaces for Type Safety ---
interface Driver {
  driver_name: string;
  rating: string;
  phone_number: string;
}

interface DriverData {
  top_drivers: Driver[];
  current_driver_rating: string;
  current_driver_rank: string;
}

interface ApiResponse {
  code: string;
  message: string;
  data: DriverData;
}

// --- Prop Types for the Component ---
interface DriverRatingsScreenProps {
  onBack: () => void;
}

const DriverRatingsScreen: React.FC<DriverRatingsScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();

  // --- State Management ---
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- API Fetching Logic using Axios ---
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setLoading(true);
        setError(null);

        // This should be the actual ID of the logged-in driver
        const driverId = 'D1744731155';
        
        // This is the Basic Auth token from your Postman screenshot.
        const basicAuthToken = 'YWJjZDo=';

        const response = await axios.post<ApiResponse>(
          'https://app.hellocaptain.in/api/driver/top_drivers_and_rank',
          {
            driver_id: driverId,
          },
          {
            headers: {
              // The API requires Basic Authentication.
              Authorization: `Basic ${basicAuthToken}`,
            },
          },
        );

        const result = response.data;

        if (result.code === '200' && result.data) {
          setDriverData(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch leaderboard data');
        }
      } catch (e: any) {
        if (axios.isAxiosError(e)) {
          if (e.response?.status === 401) {
            setError('Authentication failed. The provided Basic Auth token is incorrect.');
          } else {
            setError(e.response?.data?.message || e.message);
          }
        } else {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, []);

  // --- Helper to get Rank-Specific Styles and Emojis ---
  const getRankDetails = (index: number) => {
    switch (index) {
      case 0: // 1st Place
        return {
          background: styles.gold,
          textColor: styles.darkText,
          stars: '⭐⭐⭐',
        };
      case 1: // 2nd Place
        return {
          background: styles.silver,
          textColor: styles.darkText,
          stars: '⭐⭐',
        };
      case 2: // 3rd Place
        return {
          background: styles.bronze,
          textColor: styles.lightText,
          stars: '⭐',
        };
      default: // 4th and below
        return {
          background: styles.other,
          textColor: styles.darkText,
          stars: '',
        };
    }
  };
  
  // --- Component to render the header of the list ---
  const ListHeader = () => (
    <>
      {/* Current Driver's Stats Card */}
      <View style={[styles.card, styles.yourStatsCard]}>
        <Text style={styles.cardTitle}>Your Current Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Your Rank</Text>
            <Text style={styles.statValue}>
              #{driverData?.current_driver_rank}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Your Rating</Text>
            <Text style={styles.statValue}>
              {driverData?.current_driver_rating}
            </Text>
          </View>
        </View>
      </View>
      {/* Top Drivers List Title */}
      <Text style={styles.leaderboardTitle}>Top 10 Drivers</Text>
    </>
  );

  // --- Component to render each driver in the list ---
  const renderDriverItem = ({ item, index }: { item: Driver, index: number }) => {
    const rankDetails = getRankDetails(index);
    return (
      <View style={[styles.card, styles.driverRow]}>
        <View style={[styles.rankCircle, rankDetails.background]}>
          <Text style={[styles.rankText, rankDetails.textColor]}>
            {index + 1}
          </Text>
        </View>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{item.driver_name}</Text>
          <Text style={styles.driverPhone}>{item.phone_number}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text>{rankDetails.stars}</Text>
        </View>
      </View>
    );
  };


  const renderContent = () => {
    // --- Loading State ---
    if (loading) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.statusText, { color: theme.colors.onSurface }]}>
            Loading Leaderboard...
          </Text>
        </View>
      );
    }

    // --- Error State ---
    if (error) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={[styles.errorTitle, { color: theme.colors.error }]}>
            An Error Occurred
          </Text>
          <Text style={[styles.statusText, { color: theme.colors.onSurface }]}>
            {error}
          </Text>
        </View>
      );
    }

    // --- Success State ---
    if (driverData) {
      return (
        <FlatList
          data={driverData.top_drivers}
          renderItem={renderDriverItem}
          keyExtractor={(item) => item.phone_number}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.scrollContent}
        />
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title="Driver Leaderboard" />
      </Appbar.Header>
      {/* This wrapper View ensures the content below the Appbar has a defined space to fill */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  yourStatsCard: {
    backgroundColor: '#E8EAF6', // A light, professional blue
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A237E', // A deep blue
  },
  leaderboardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  driverPhone: {
    fontSize: 12,
    color: '#777',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 4,
  },
  // Medal and Rank Colors
  gold: { backgroundColor: '#FFD700' },
  silver: { backgroundColor: '#C0C0C0' },
  bronze: { backgroundColor: '#CD7F32' },
  other: { backgroundColor: '#F0F0F0' },
  // Text Colors for Contrast
  lightText: { color: '#FFFFFF' },
  darkText: { color: '#333333' },
});

export default DriverRatingsScreen;
