
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, remove } from 'firebase/database';
import { FIREBASE_DB } from './firebaseConfig';
import { getAuth, signOut } from "firebase/auth";
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function HomePage() {
  const [workouts, setWorkouts] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const isTrainer = user && user.email === 'matamattia@gmail.com';

    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          {isTrainer && (
            <TouchableOpacity onPress={() => navigation.navigate('CreateWorkout')}>
              <Icon name="plus-box" size={24} color="#000" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="logout" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const workoutsRef = ref(FIREBASE_DB, `workouts/${userId}`);
      const unsubscribe = onValue(workoutsRef, (snapshot) => {
        const data = snapshot.val();
        const loadedWorkouts = data ? Object.keys(data).map(key => ({
          id: key,
          name: data[key].name,
          exercises: data[key].exercises,
        })) : [];
        setWorkouts(loadedWorkouts);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      navigation.replace('Login'); // Assuming you have a login screen
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Errore', 'Impossibile effettuare il logout. Riprova più tardi.');
    }
  };

  const handleDeleteWorkout = (workoutId) => {
    Alert.alert(
      "Conferma Eliminazione",
      "Sei sicuro di voler eliminare questo allenamento?",
      [
        {
          text: "Annulla",
          style: "cancel",
        },
        {
          text: "Elimina",
          style: "destructive",
          onPress: () => {
            const workoutRef = ref(FIREBASE_DB, `workouts/${getAuth().currentUser.uid}/${workoutId}`);
            remove(workoutRef)
              .then(() => {
                Alert.alert("Eliminato", "L'allenamento è stato eliminato correttamente.");
                setWorkouts(currentWorkouts => currentWorkouts.filter(workout => workout.id !== workoutId));
              })
              .catch(error => {
                console.error("Delete failed: ", error);
                Alert.alert("Errore", "Non è stato possibile eliminare l'allenamento. Errore: " + error.message);
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  const renderWorkoutItem = ({ item }) => {
    const isExpanded = activeSections.includes(item.id);
    const userId = getAuth().currentUser.uid;

    return (
      <View style={styles.workoutItem}>
        <View style={styles.workoutHeader}>
          <TouchableOpacity
            onPress={() => navigation.navigate('WorkoutDetails', {
                                      workout: item,
                                      userId: userId // Passa l'userId insieme a workout
                                    })}
            style={styles.workoutTitleContainer}
          >
            <Text style={styles.workoutTitle}>{item.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showOptions(item.id)} style={styles.optionsButton}>
            <Icon name="dots-vertical" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <Collapsible collapsed={!isExpanded} style={styles.collapsibleContent}>
          {item.exercises && item.exercises.map((exercise, index) => (
            <Text key={index} style={styles.exerciseText}>{exercise.title}</Text>
          ))}
        </Collapsible>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={item => item.id}
        renderItem={renderWorkoutItem}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  list: {
    // Personalizza come necessario
  },
  workoutItem: {
    backgroundColor: '#FFF',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
    elevation: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F7F7',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  workoutTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  collapsibleContent: {
    padding: 20,
    backgroundColor: '#FFF', // Assicura che il contenuto del collapsible abbia uno sfondo uniforme
  },
  exerciseText: {
    fontSize: 16,
    color: '#555',
    paddingVertical: 5,
  },
  optionsButton: {
    padding: 10, // Facilita l'interazione
  },
  workoutTitleContainer: {
      flex: 1, // Assicura che il contenitore del titolo utilizzi lo spazio disponibile
  },
  headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  logoutButton: {
      marginLeft: 15, // Aggiunge spazio tra le icone del pulsante più e logout
  },
  // Stili aggiuntivi se necessari
});

export default HomePage;
