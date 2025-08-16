import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.colors.background }]}>
      <Text style={{ color: theme.colors.onBackground }}>Chat Screen</Text>
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

export default ChatScreen;
