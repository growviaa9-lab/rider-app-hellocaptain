import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
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

  const handlePermissionRequest = () => {
    // In a real app, you would request location permission here
    // For now, we'll just simulate permission granted
    onPermissionGranted();
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
            style={[styles.permissionButton, { backgroundColor: theme.colors.primary }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            {t('givePermission')}
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
