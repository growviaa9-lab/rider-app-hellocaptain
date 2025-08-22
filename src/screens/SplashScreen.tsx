import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';

interface SplashScreenProps {
  onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      // onFinish();
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]); 

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={[styles.backgroundContainer, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.logoContainer}>
          {/* Logo Text */}
          <Text style={[styles.logoTextHello, { color: theme.colors.onPrimary }]}>
            Hello
          </Text>
          <Text style={[styles.logoTextCaptain, { color: theme.colors.onPrimary }]}>
            captain
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextHello: {
    fontSize: 55,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: -8,
  },
  logoTextCaptain: {
    fontSize: 55,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 1,
  },
});

export default SplashScreen;
