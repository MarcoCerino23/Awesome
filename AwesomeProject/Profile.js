import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { onAuthStateChanged } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { FIREBASE_DB, FIREBASE_AUTH } from './firebaseConfig';

export default function Profile() {
    const [measurements, setMeasurements] = useState({
        height: '',
        weight: '',
        neck: '',
        shoulders: '',
        bicep: '',
        tricep: '',
        forearm: '',
        calf: ''
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, currentUser => {
            setUser(currentUser);
            if (currentUser) {
                const userRef = ref(FIREBASE_DB, 'users/' + currentUser.uid + '/measurements');
                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        setMeasurements(snapshot.val());
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        });
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const handleSave = () => {
        if (user) {
            const userRef = ref(FIREBASE_DB, 'users/' + user.uid + '/measurements');
            set(userRef, measurements)
                // .then(() => Alert.alert('Success', 'Measurements saved successfully!'))
                .catch(error => Alert.alert('Error', error.message));
        } else {
            Alert.alert('Error', 'No user logged in!');
        }
    };

    const handleChange = (name, value) => {
        setMeasurements(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleBlur = () => {
        handleSave();
    };

    return (
        <ScrollView style={styles.container}>
            {Object.keys(measurements).map((key) => (
                <View key={key} style={styles.inputGroup}>
                    <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleChange(key, text)}
                        value={measurements[key]}
                        keyboardType="numeric"
                        onBlur={handleBlur}  // Save data when the input loses focus
                    />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    inputGroup: {
        marginBottom: 15
    },
    input: {
        height: 40,
        borderWidth: 1,
        marginBottom: 8,
        padding: 10
    },
    label: {
        fontSize: 16,
        marginBottom: 5
    }
});
