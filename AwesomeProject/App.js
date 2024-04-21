
import React from 'react';
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

import CreateWorkout from './CreateWorkout'
import WorkoutDetails from './WorkoutDetails';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Componente per i tab della home


function HomeTabs() {
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
          }

          // Puoi ritornare qualsiasi componente qui, nel caso usiamo Icon di Ionicons
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
      <Tab.Screen name="ChatList" component={ChatList} options={{ title: 'ChatList' }} />
    </Tab.Navigator>
  );
}

// Navigatore principale dell'app
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpForm} options={{ headerShown: false }} />
        <Stack.Screen 
          name="Home" 
          component={HomeTabs} 
          options={{ headerShown: false }}  // Nasconde l'intestazione nel Tab Navigator
        />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetail} options={{ title: 'Details' }} />
        <Stack.Screen name="CreateWorkout" component={CreateWorkout} options={{ title: 'Create Workout' }} />
        <Stack.Screen name="WorkoutDetails" component={WorkoutDetails} options={{ title: 'Workout Details' }} />
        <Stack.Screen name="SeriesDetails" component={SeriesDetails} options={{ title: 'SeriesDetails' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
