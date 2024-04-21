
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth"; // Importa le funzioni necessarie per l'autenticazione
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKTW_W1E_vQcAKu8qTfyZG3cJp5PyEj3M",
  authDomain: "appfitness-b867c.firebaseapp.com",
  projectId: "appfitness-b867c",
  storageBucket: "appfitness-b867c.appspot.com",
  messagingSenderId: "287379358567",
  appId: "1:287379358567:web:7fe78a3aa4a9017cc6e5c2",
  measurementId: "G-WYRXZ1Z193",
  databaseURL: "https://appfitness-b867c-default-rtdb.europe-west1.firebasedatabase.app/"
};

const FIREBASE_APP = initializeApp(firebaseConfig);

// Inizializza Firebase Auth con persistenza tramite AsyncStorage
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const FIREBASE_DB = getDatabase(FIREBASE_APP); // Ottieni l'istanza del Realtime Database

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB};


