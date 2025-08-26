import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Text } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen1Props {
  onContinue: () => void;
}

const OnboardingScreen1: React.FC<OnboardingScreen1Props> = ({ onContinue }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      
      {/* Background Image - leave src blank as requested */}
      <ImageBackground
        source={{}} // Leave blank as requested - will show person with OK gesture and phone
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient overlay for text readability */}
        <View style={styles.gradientOverlay} />
        
        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Bottom Content */}
          <View style={styles.bottomContent}>
            {/* Main Heading */}
            <Text style={styles.mainHeading}>
              Get Nearby Rides
            </Text>
            
            {/* Subtitle */}
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>
                Easily get nearby ride with
              </Text>
              <Text style={styles.appName}>
                "Hello Captain Rider"
              </Text>
            </View>
            
            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            
            {/* Continue Button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={onContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6, // Cover bottom 60% of screen
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark gradient for text readability
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  bottomContent: {
    alignItems: 'center',
    zIndex: 2, // Ensure content is above overlay
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FF6B35', // Orange color matching the design
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  appName: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 24, // Elongated active dot
  },
  continueButton: {
    backgroundColor: '#FF6B35', // Orange button color
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    width: width - 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingScreen1;
