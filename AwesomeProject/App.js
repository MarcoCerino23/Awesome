
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import HomePage from './HomePage';
import Exercises from './Exercises';
import Profile from './Profile';
import Chat from './Chat';
import SeriesDetails from './SeriesDetails';
import ExerciseDetail from './ExerciseDetail';
import Icon from 'react-native-vector-icons/Ionicons'; // Assicurati di importare la famiglia di icone desiderata
import ChatList from './ChatList';
import CreateWorkout from './CreateWorkout';
import WorkoutDetails from './WorkoutDetails';
import UsersList from './UsersList';  // Nuova schermata per la lista degli utenti
import UserProfile from './UserProfile';  // Schermata per visualizzare il profilo dell'utente
import { FIREBASE_AUTH } from './firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Funzione per verificare se l'utente è l'istruttore
const isInstructor = (email) => email === 'matamattia@gmail.com';

// Componente per i tab della home
function HomeTabs({ user }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomePage') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Exercises') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="HomePage" component={HomePage} options={{ title: 'Home' }} />
      <Tab.Screen name="Exercises" component={Exercises} options={{ title: 'Esercizi' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profilo' }} />
      <Tab.Screen name="Chat" component={Chat} options={{ title: 'Chat' }} />
      {isInstructor(user.email) && (
        <Tab.Screen name="Users" component={UsersList} options={{ title: 'Utenti' }} />
      )}
      <Tab.Screen name="ChatList" component={ChatList} options={{ title: 'ChatList' }} />
    </Tab.Navigator>
  );
}

// Wrapper per HomeTabs per evitare di passare una funzione inline
function HomeTabsWrapper({ user }) {
  return <HomeTabs user={user} />;
}

// Navigatore principale dell'app
function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, currentUser => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    return () => unsubscribe();
  }, [initializing]);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginForm} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpForm} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Home" 
              options={{ headerShown: false }}
            >
              {props => <HomeTabsWrapper {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="ExerciseDetail" component={ExerciseDetail} options={{ title: 'Details' }} />
            <Stack.Screen name="CreateWorkout" component={CreateWorkout} options={{ title: 'Create Workout' }} />
            <Stack.Screen name="WorkoutDetails" component={WorkoutDetails} options={{ title: 'Workout Details' }} />
            <Stack.Screen name="SeriesDetails" component={SeriesDetails} options={{ title: 'SeriesDetails' }} />
            <Stack.Screen name="UserProfile" component={UserProfile} options={{ title: 'User Profile' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
