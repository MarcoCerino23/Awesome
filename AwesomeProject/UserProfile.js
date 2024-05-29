
// components/UserProfile.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { FIREBASE_DB } from './firebaseConfig';

function UserProfile({ route }) {
    const { userId } = route.params;
    const [measurements, setMeasurements] = useState(null);

    useEffect(() => {
        const userRef = ref(FIREBASE_DB, `users/${userId}/measurements`);
        const unsubscribe = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setMeasurements(Object.entries(data));
            } else {
                setMeasurements([]);
            }
        });
        return () => unsubscribe();
    }, [userId]);

    if (!measurements) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {measurements.map(([key, measurement]) => (
                <View key={key} style={styles.measurementItem}>
                    <Text>Date: {new Date(measurement.timestamp).toLocaleDateString()}</Text>
                    <Text>Weight: {measurement.weight} kg</Text>
                    <Text>Height: {measurement.height} cm</Text>
                    <Text>Body Fat: {measurement.bodyFat} %</Text>
                    <Text>Neck: {measurement.neck} cm</Text>
                    <Text>Shoulders: {measurement.shoulders} cm</Text>
                    <Text>Chest: {measurement.chest} cm</Text>
                    <Text>Waist: {measurement.waist} cm</Text>
                    <Text>Biceps: {measurement.biceps} cm</Text>
                    <Text>Forearm: {measurement.forearm} cm</Text>
                    <Text>Wrist: {measurement.wrist} cm</Text>
                    <Text>Glutes: {measurement.glutes} cm</Text>
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
    measurementItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f8f9fa',
        borderRadius: 5
    }
});

export default UserProfile;
