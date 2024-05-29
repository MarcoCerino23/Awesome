// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
// import { getDatabase, ref, onValue } from 'firebase/database';
// import { FIREBASE_DB } from './firebaseConfig';

// const placeholderImage = require('./assets/icon.png');

// const ChatList = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const usersRef = ref(FIREBASE_DB, 'users');

//     const unsubscribe = onValue(usersRef, (snapshot) => {
//       const loadedUsers = [];
//       snapshot.forEach((childSnapshot) => {
//         loadedUsers.push({
//           uid: childSnapshot.key,
//           ...childSnapshot.val(),
//         });
//       });
//       setUsers(loadedUsers);
//       setLoading(false);
//     }, (errorObject) => {
//       setError(errorObject.message);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   if (error) {
//     return <Text style={styles.errorText}>Error: {error}</Text>;
//   }

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.chatItem}
//       onPress={() => {
//         // TODO: Implementa la navigazione alla chat specifica
//         console.log('Navigazione alla chat di', item.uid);
//       }}
//       accessibilityLabel={`Chat with ${item.firstName} ${item.lastName}`}
//       accessibilityHint="Navigates to the chat screen"
//     >
//       <Image source={placeholderImage} style={styles.avatar} />
//       <View style={styles.chatInfo}>
//         <Text style={styles.chatTitle}>{item.firstName} {item.lastName}</Text>
//         <Text style={styles.lastMessage}>Tocca per chattare con {item.uid}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <FlatList
//       data={users}
//       keyExtractor={(item) => item.uid}
//       renderItem={renderItem}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   chatItem: {
//     flexDirection: 'row',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//     alignItems: 'center',
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 16,
//   },
//   chatInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   chatTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   lastMessage: {
//     color: 'grey',
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 20,
//   }
// });

// export default ChatList;
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { FIREBASE_DB } from './firebaseConfig';

const placeholderImage = require('./assets/icon.png');

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const usersRef = ref(FIREBASE_DB, 'users');

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const loadedUsers = [];
      snapshot.forEach((childSnapshot) => {
        loadedUsers.push({
          uid: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setUsers(loadedUsers);
      setLoading(false);
    }, (errorObject) => {
      setError(errorObject.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        navigation.navigate('ChatScreen', { userId: item.uid, userName: `${item.firstName} ${item.lastName}` });
      }}
      accessibilityLabel={`Chat with ${item.firstName} ${item.lastName}`}
      accessibilityHint="Navigates to the chat screen"
    >
      <Image source={placeholderImage} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatTitle}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.lastMessage}>Tocca per chattare con {item.uid}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.uid}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    color: 'grey',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  }
});

export default ChatList;
