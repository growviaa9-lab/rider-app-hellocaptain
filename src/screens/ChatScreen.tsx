import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform,Image} from 'react-native';
import { Appbar, TextInput, IconButton, Text, useTheme } from 'react-native-paper';
import database from '@react-native-firebase/database';
import { StackScreenProps } from '@react-navigation/stack';

// --- TypeScript types ---
interface MessageType {
  id: string;
  text: string;
  sender_id: string;
  timestamp: number; // Timestamps are now consistently numbers
  receiver_id?: string;
  status?: string;
  type?: string;
}
interface MessageBubbleProps {
  message: MessageType;
  isCurrentUser: boolean;
}
type RootStackParamList = {
  Inbox: undefined;
  Chat: { receiverId: string; receiverName: string,receiverPic: string; }; // Add receiverPic
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessageContainer : styles.otherUserMessageContainer]}>
      <View style={[styles.messageBubble, { backgroundColor: isCurrentUser ? colors.primary : colors.surfaceVariant }]}>
        <Text style={{ color: isCurrentUser ? colors.onPrimary : colors.onSurfaceVariant }}>
          {message.text}
        </Text>
      </View>
    </View>
  );
};

const ChatScreen: React.FC<StackScreenProps<RootStackParamList, 'Chat'>> = ({ route, navigation }) => {
  const theme = useTheme();
  const { receiverId, receiverName,receiverPic} = route.params; 
  const senderId = 'D1743823920';

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  // --- FIX 1: Create a ref for the FlatList for stability ---
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!senderId || !receiverId) return;

    const chatID = [senderId, receiverId].sort().join('-');
    const messagesRef = database().ref(`/chat/${chatID}`);

    const onValueChange = messagesRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages: MessageType[] = Object.keys(data)
          .map(key => {
            const message = data[key];
            const timestampAsNumber = typeof message.timestamp === 'string' 
              ? new Date(message.timestamp).getTime() 
              : message.timestamp;
            
            return {
              id: key,
              ...message,
              timestamp: timestampAsNumber,
            };
          })
          .sort((a, b) => a.timestamp - b.timestamp); // Sort oldest to newest
        
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
    });

    return () => messagesRef.off('value', onValueChange);
  }, [senderId, receiverId]);

  const handleSend = useCallback(async () => {
    if (inputText.trim().length === 0 || !senderId) return;
    const chatID = [senderId, receiverId].sort().join('-');
    const newMessageRef = database().ref(`/chat/${chatID}`).push();

    try {
      await newMessageRef.set({
        text: inputText,
        sender_id: senderId,
        receiver_id: receiverId,
        timestamp: database.ServerValue.TIMESTAMP, // Use the reliable server timestamp
        status: '0',
        type: 'text',
      });
      setInputText('');
    } catch (error) { console.error("Failed to send message:", error); }
  }, [inputText, senderId, receiverId]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Image src={receiverPic} style={{ width: 40, height: 40, borderRadius: 20,marginRight: 10}}/>
        <Appbar.Content title={receiverName || "Chat"} />
      </Appbar.Header>

      <KeyboardAvoidingView
  style={styles.flex}
  behavior={Platform.OS === 'ios' ? 'padding' :'padding'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 10}  // adjust offset for Appbar
  enabled
>
<FlatList
  ref={flatListRef}
  data={messages}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <MessageBubble message={item} isCurrentUser={item.sender_id === senderId} />
  )}
  style={styles.messageList}
  contentContainerStyle={{ paddingVertical: 10 }}
  onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
  onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
/>
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
          <TextInput style={styles.textInput} value={inputText} onChangeText={setInputText} placeholder="Type a message..." mode="outlined" dense />
          <IconButton icon="send" size={24} onPress={handleSend} containerColor={theme.colors.primary} iconColor={theme.colors.onPrimary} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  messageList: { flex: 1 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, elevation: 4 },
  textInput: { flex: 1, marginRight: 8 },
  messageContainer: { marginVertical: 4, marginHorizontal: 12, flexDirection: 'row' },
  currentUserMessageContainer: { justifyContent: 'flex-end' },
  otherUserMessageContainer: { justifyContent: 'flex-start' },
  messageBubble: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, maxWidth: '80%' },
});

export default ChatScreen;