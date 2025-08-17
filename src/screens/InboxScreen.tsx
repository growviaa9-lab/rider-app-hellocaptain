import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Appbar, List, Avatar, Text, useTheme, Badge } from 'react-native-paper';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// --- TypeScript Types ---
interface InboxEntry {
  id: string; // This will be the other user's ID
  name: string;
  pic: string;
  msg: string;
  date: string;
  status: string;
  timestamp: number;
}

// Define the navigation stack parameters
type RootStackParamList = {
  Inbox: undefined;
  Chat: { receiverId: string; receiverName: string; receiverPic: string; }; // Add receiverPic
};

type InboxScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Inbox'>;

// --- Components ---
const ConversationItem: React.FC<{ item: InboxEntry }> = ({ item }) => {
  const navigation = useNavigation<InboxScreenNavigationProp>();
  const { colors } = useTheme();

  const handlePress = () => {
    // Navigate to the ChatScreen, passing the other user's ID and name
    navigation.navigate('Chat', {
      receiverId: item.id,
      receiverName: item.name,
      receiverPic: item.pic, // Pass the profile picture URL
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <List.Item
        title={item.name}
        description={item.msg}
        titleStyle={{ fontWeight: 'bold' }}
        descriptionStyle={{ color: colors.onSurfaceVariant }}
        left={props => <Avatar.Image {...props} source={{ uri: item.pic }} />}
        right={() => (
          <View style={styles.itemRightContainer}>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>
              {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {item.status === '0' && <Badge style={{ marginTop: 4 }}>New</Badge>}
          </View>
        )}
      />
    </TouchableOpacity>
  );
};

const InboxScreen: React.FC = () => {
  const theme = useTheme();
  // For now, we use the hardcoded user ID. Later, you'll get this from auth.
  const currentUserId = 'D1743823920';

  const [conversations, setConversations] = useState<InboxEntry[]>([]);

  useEffect(() => {
    if (!currentUserId) return;

    const inboxRef = database().ref(`/Inbox/${currentUserId}`);

    const onValueChange = inboxRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const loadedConversations: InboxEntry[] = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key],
          }))
          // Sort by timestamp to show the most recent chats first
          .sort((a, b) => b.timestamp - a.timestamp);
        
        setConversations(loadedConversations);
      } else {
        setConversations([]);
      }
    });

    // Detach the listener when the component unmounts
    return () => inboxRef.off('value', onValueChange);
  }, [currentUserId]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="My Chats" />
      </Appbar.Header>
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ConversationItem item={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{color: theme.colors.onSurfaceVariant}}>No conversations found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemRightContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default InboxScreen;