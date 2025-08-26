import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: typeof MD3LightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom theme colors
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF6B35', // Orange color from the design
    primaryContainer: '#FFE6DC',
    secondary: '#4CAF50', // Green accent  
    secondaryContainer: '#E8F5E8',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#2D1B00',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#002114',
    onSurface: '#1A1A1A',
    onSurfaceVariant: '#757575',
    onBackground: '#1A1A1A',
    outline: '#E0E0E0',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F7F7F7',
      level3: '#F0F0F0',
      level4: '#EEEEEE',
      level5: '#EBEBEB',
    },
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF8A5B', // Slightly lighter orange for dark mode
    primaryContainer: '#8B3000',
    secondary: '#66BB6A', // Lighter green for dark mode
    secondaryContainer: '#00331D',
    surface: '#1E1E1E',
    surfaceVariant: '#2A2A2A',
    background: '#121212',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#FFE6DC',
    onSecondary: '#FFFFFF', 
    onSecondaryContainer: '#E8F5E8',
    onSurface: '#E0E0E0',
    onSurfaceVariant: '#BDBDBD',
    onBackground: '#E0E0E0',
    outline: '#424242',
    elevation: {
      level0: 'transparent',
      level1: '#2A2A2A',
      level2: '#2F2F2F',
      level3: '#333333',
      level4: '#363636',
      level5: '#3A3A3A',
    },
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
