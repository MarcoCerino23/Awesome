import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import { ref, push, onValue, set as firebaseSet, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { FIREBASE_DB } from './firebaseConfig';

function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const trainerId = 'XRo7JkvYb0gIfzRtmVX0wWKBN853';

  useEffect(() => {
    if (!userId) {
      console.error("User ID not found, user might not be logged in.");
      return;
    }

    const chatPath = `chats/${userId}_${trainerId}/messages`;
    const messagesRef = ref(FIREBASE_DB, chatPath);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const loadedMessages = Object.entries(snapshot.val()).map(([key, value]) => ({
          id: key,
          ...value,
        })).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
        setMessages(loadedMessages);
      } else {
        console.log("No messages found.");
        setMessages([]);
      }
    }, (error) => {
      console.error("Firebase read failed: " + error.message);
    });

    return () => unsubscribe();
  }, [userId, trainerId]);

  const sendMessage = async () => {
    if (!userId || !input.trim()) {
      return;
    }
    const chatPath = `chats/${userId}_${trainerId}/messages`;
    const newMessageRef = push(ref(FIREBASE_DB, chatPath));
    const newMessage = {
      text: input,
      sender_id: userId,
      receiver_id: trainerId,
      timestamp: new Date().toISOString()
    };

    await firebaseSet(newMessageRef, newMessage);

    setMessages(prevMessages => {
      const newMessageWithId = { ...newMessage, id: newMessageRef.key };
      const messageIndex = prevMessages.findIndex(msg => msg.id === newMessageRef.key);
      if (messageIndex === -1) {
        return [...prevMessages, newMessageWithId].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      } else {
        const updatedMessages = [...prevMessages];
        updatedMessages[messageIndex] = newMessageWithId;
        return updatedMessages.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      }
    });
    setInput('');
  };

  const deleteMessage = async (messageId) => {
    if (!userId) {
      return;
    }
    const chatPath = `chats/${userId}_${trainerId}/messages/${messageId}`;
    await remove(ref(FIREBASE_DB, chatPath));

    setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId));
  };

  const isMyMessage = (item) => item.sender_id === userId;

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, isMyMessage(item) ? styles.myMessage : styles.theirMessage]}>
            <Text style={[styles.messageText, isMyMessage(item) && styles.myMessageText]}>
              {item.text}
            </Text>
            {isMyMessage(item) && (
              <TouchableOpacity onPress={() => deleteMessage(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message here..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: '#007bff',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  messageBubble: {
    padding: 10,
    margin: 8,
    borderRadius: 20,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  myMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#e5e5ea',
    alignSelf: 'flex-start',
  },
  myMessageText: {
    color: '#ffffff',
  },
});

export default Chat;


