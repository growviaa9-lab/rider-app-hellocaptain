import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface LocationPermissionScreenProps {
  onPermissionGranted: () => void;
}

const LocationPermissionScreen: React.FC<LocationPermissionScreenProps> = ({
  onPermissionGranted,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [isRequesting, setIsRequesting] = useState(false);

  const handlePermissionRequest = async () => {
    setIsRequesting(true);
    
    try {
      // Request location authorization
      const authStatus = await new Promise<string>((resolve) => {
        Geolocation.requestAuthorization(
          () => resolve('granted'),
          () => resolve('denied')
        );
      });

      console.log('Location authorization status:', authStatus);

      if (authStatus === 'granted') {
        // Permission granted, test location access
        Geolocation.getCurrentPosition(
          (position) => {
            console.log('Location retrieved:', position);
            setIsRequesting(false);
            onPermissionGranted();
          },
          (error) => {
            console.log('Location error:', error);
            setIsRequesting(false);
            Alert.alert(
              'Location Error',
              'Unable to retrieve your location. Please check your location settings.',
              [{ text: 'OK' }]
            );
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      } else {
        setIsRequesting(false);
        // Permission denied
        Alert.alert(
          'Location Permission Required',
          'This app needs location access to show nearby rides and provide navigation. Please enable location access in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Settings', 
              onPress: () => {
                // On iOS, this will open app settings
                if (Platform.OS === 'ios') {
                  // Note: Opening settings requires additional setup
                  Alert.alert('Please go to Settings > Privacy & Security > Location Services to enable location access');
                } else {
                  // On Android, you could use Linking to open app settings
                  Alert.alert('Please enable location access in app settings');
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      setIsRequesting(false);
      console.log('Permission request error:', error);
      Alert.alert(
        'Error',
        'An error occurred while requesting location permission. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image - You'll need to add this image */}
      <ImageBackground
        source={{ uri: 'file://src/assets/images/location_background.jpg' }}
        style={styles.backgroundImage}
        blurRadius={3}
      >
        {/* Overlay */}
        <View style={styles.overlay} />
        
        {/* Logo Card */}
        <View style={styles.logoContainer}>
          <Card style={styles.logoCard}>
            <Card.Content style={styles.logoCardContent}>
              <Text style={[styles.logoText, { color: theme.colors.primary }]}>
                Hello
              </Text>
              <Text style={[styles.logoText, { color: theme.colors.primary }]}>
                Captain
              </Text>
              <Text style={[styles.tagline, { color: theme.colors.secondary }]}>
                "{t('tagline')}"
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Phone mockup area - centered */}
        <View style={styles.phoneMockupContainer}>
          {/* You can add a phone mockup image here */}
        </View>

        {/* Bottom section with permission request */}
        <View style={styles.bottomContainer}>
          <Text style={[styles.enableLocationText, { color: theme.colors.primary }]}>
            {t('enableLocation')}
          </Text>
          
          <Text style={[styles.descriptionText, { color: theme.colors.onSurface }]}>
            {t('locationDescription')}
          </Text>

          <Button
            mode="contained"
            onPress={handlePermissionRequest}
            disabled={isRequesting}
            loading={isRequesting}
            style={[styles.permissionButton, { backgroundColor: theme.colors.primary }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            {isRequesting ? t('requesting') || 'Requesting...' : t('givePermission')}
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  logoCard: {
    elevation: 8,
    borderRadius: 12,
  },
  logoCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  phoneMockupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  bottomContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  enableLocationText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  permissionButton: {
    borderRadius: 25,
    elevation: 4,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LocationPermissionScreen;
