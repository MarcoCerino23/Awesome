import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Import Firebase storage

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

// Initialize Firebase Auth with persistence via AsyncStorage
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const FIREBASE_DB = getDatabase(FIREBASE_APP); // Get instance of the Realtime Database
const FIREBASE_STORAGE = getStorage(FIREBASE_APP); // Initialize Firebase Storage

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE };
