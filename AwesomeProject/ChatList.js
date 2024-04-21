// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
// import { getDatabase, ref, onValue } from 'firebase/database';
// import { FIREBASE_DB } from './firebaseConfig';

// const placeholderImage = require('./assets/icon.png'); // Sostituisci con il percorso della tua immagine

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
//     }, (errorObject) => {
//       console.log("The read failed: " + errorObject.code);
//     });
  
//     return () => unsubscribe(); // Pulisci il listener quando il componente viene smontato
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   if (error) {
//     return <Text>Error: {error}</Text>;
//   }

//   if (users.length === 0) {
//     return <Text>Non ci sono utenti o chat disponibili.</Text>;
//   }

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.chatItem}
//       onPress={() => {
//         // TODO: implementa la navigazione alla chat specifica
//         console.log('Navigazione alla chat di', item.uid);
//       }}
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
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF', // Telegram ha uno sfondo bianco
//   },
//   chatItem: {
//     flexDirection: 'row',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0', // Telegram ha bordi sottili e leggeri
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   chatInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   chatTitle: {
//     fontWeight: 'bold',
//   },
//   lastMessage: {
//     color: 'grey',
//   },
//   // Aggiungi ulteriori stili se necessario
// });

// export default ChatList;


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { FIREBASE_DB } from './firebaseConfig';

const placeholderImage = require('./assets/icon.png'); 

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

    return () => unsubscribe(); // Funzione di pulizia
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        // TODO: Implementa la navigazione alla chat specifica
        console.log('Navigazione alla chat di', item.uid);
      }}
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
  // Puoi aggiungere altri stili se necessario
});

export default ChatList;
