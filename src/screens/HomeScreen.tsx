import React, { useEffect } from 'react'; // 1. Import useEffect
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';

// 2. Import the Firebase database module
import database from '@react-native-firebase/database';

interface HomeScreenProps {
  onProfilePress: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onProfilePress }) => {
  const { theme } = useTheme();


  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Hello Captain" />
        <TouchableOpacity onPress={onProfilePress} style={{ marginRight: 16 }}>
          <Avatar.Icon size={36} icon="account-circle" />
        </TouchableOpacity>
      </Appbar.Header>
      <View style={[styles.screenContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onBackground }}>Home Screen</Text>
        <Text style={{ color: theme.colors.onBackground, marginTop: 8 }}>
          Check Metro logs for Firebase status.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;