
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { onAuthStateChanged } from "firebase/auth";
import { ref, set, push, onValue, update, remove } from "firebase/database";
import { FIREBASE_DB, FIREBASE_AUTH } from './firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Assicurati di avere installato questo pacchetto

export default function Profile() {
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [measurements, setMeasurements] = useState([]); // Aggiunto per memorizzare e visualizzare tutte le misurazioni
    const [newMeasurement, setNewMeasurement] = useState({
        weight: '',
        height: '',
        bodyFat: '',
        neck: '',
        shoulders: '',
        chest: '',
        waist: '',
        biceps: '',
        forearm: '',
        wrist: '',
        glutes: ''
    });
    const [editingMeasurement, setEditingMeasurement] = useState(null);
    const [expandedMeasurements, setExpandedMeasurements] = useState({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, currentUser => {
            setUser(currentUser);
            if (currentUser) {
                const userMeasurementsRef = ref(FIREBASE_DB, `users/${currentUser.uid}/measurements`);
                onValue(userMeasurementsRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setMeasurements(Object.entries(data));
                    } else {
                        setMeasurements([]);
                    }
                });
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        if (!user) {
            Alert.alert('Error', 'No user logged in!');
            return;
        }
    
        const timestamp = new Date().toISOString();
        const measurementWithTimestamp = { ...newMeasurement, timestamp: timestamp };
    
        const userMeasurementsRef = ref(FIREBASE_DB, `users/${user.uid}/measurements`);
        try {
            const newMeasurementRef = push(userMeasurementsRef);
            await set(newMeasurementRef, measurementWithTimestamp);
            Alert.alert('Success', 'Measurement added successfully!');
            setShowForm(false);
            setNewMeasurement({
                weight: '',
                height: '',
                bodyFat: '',
                neck: '',
                shoulders: '',
                chest: '',
                waist: '',
                biceps: '',
                forearm: '',
                wrist: '',
                glutes: ''
            });
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleUpdate = async () => {
        if (!user || !editingMeasurement) {
            Alert.alert('Error', 'No user logged in or no measurement selected for editing!');
            return;
        }
    
        const updatedMeasurement = { ...editingMeasurement, timestamp: new Date().toISOString() };
    
        const measurementRef = ref(FIREBASE_DB, `users/${user.uid}/measurements/${editingMeasurement.key}`);
        try {
            await update(measurementRef, updatedMeasurement);
            Alert.alert('Success', 'Measurement updated successfully!');
            setEditingMeasurement(null);
            setShowForm(false);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
    
    const handleDelete = async (key) => {
        if (!user) {
            Alert.alert('Error', 'No user logged in!');
            return;
        }

        const measurementRef = ref(FIREBASE_DB, `users/${user.uid}/measurements/${key}`);
        try {
            await remove(measurementRef);
            Alert.alert('Success', 'Measurement deleted successfully!');
            setMeasurements(prevMeasurements => prevMeasurements.filter(([k, _]) => k !== key));
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleChange = (name, value) => {
        if (editingMeasurement) {
            setEditingMeasurement(prev => ({ ...prev, [name]: value }));
        } else {
            setNewMeasurement(prev => ({ ...prev, [name]: value }));
        }
    };

    const toggleExpand = (index) => {
        setExpandedMeasurements(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const handleEdit = (measurement) => {
        setEditingMeasurement(measurement);
        setShowForm(true);
    };

    return (
        <View style={styles.container}>
            {!showForm && (
                <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
                    <Icon name="plus" size={20} color="#fff" />
                </TouchableOpacity>
            )}
            {showForm && (
                <ScrollView style={styles.form}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => handleChange('weight', text)}
                        value={editingMeasurement ? editingMeasurement.weight : newMeasurement.weight}
                        placeholder="Weight (kg)"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => handleChange('height', text)}
                        value={editingMeasurement ? editingMeasurement.height : newMeasurement.height}
                        placeholder="Height (cm)"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => handleChange('bodyFat', text)}
                        value={editingMeasurement ? editingMeasurement.bodyFat : newMeasurement.bodyFat}
                        placeholder="Body Fat (%)"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => handleChange('neck', text)}
                        value={editingMeasurement ? editingMeasurement.neck : newMeasurement.neck}
                        placeholder="Neck (cm)"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => handleChange('shoulders', text)}
                        value={editingMeasurement ? editingMeasurement.shoulders : newMeasurement.shoulders}
                        placeholder="Shoulders (cm)"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => handleChange('chest', text)}
                        value={editingMeasurement ? editingMeasurement.chest : newMeasurement.chest}
                        placeholder="Chest (cm)"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => handleChange('waist', text)}
                        value={editingMeasurement ? editingMeasurement.waist : newMeasurement.waist}
                        placeholder="Waist (cm)"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => handleChange('biceps', text)}
                        value={editingMeasurement ? editingMeasurement.biceps : newMeasurement.biceps}
                        placeholder="Biceps (cm)"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => handleChange('forearm', text)}
                        value={editingMeasurement ? editingMeasurement.forearm : newMeasurement.forearm}
                        placeholder="Forearm (cm)"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => handleChange('wrist', text)}
                        value={editingMeasurement ? editingMeasurement.wrist : newMeasurement.wrist}
                        placeholder="Wrist (cm)"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => handleChange('glutes', text)}
                        value={editingMeasurement ? editingMeasurement.glutes : newMeasurement.glutes}
                        placeholder="Glutes (cm)"
                        keyboardType="numeric"
                    />
                    <Button title={editingMeasurement ? "Update" : "Save"} onPress={editingMeasurement ? handleUpdate : handleSave} />
                </ScrollView>
            )}
            <ScrollView style={styles.measurementList}>
                {measurements.map(([key, measurement], index) => (
                    <TouchableOpacity key={key} onPress={() => toggleExpand(index)}>
                        <View style={styles.measurementItem}>
                            <View style={styles.measurementSummary}>
                                <Text>Date: {new Date(measurement.timestamp).toLocaleDateString()}</Text>
                                <Icon name={expandedMeasurements[index] ? "chevron-up" : "chevron-down"} size={20} color="#000" />
                            </View>
                            {expandedMeasurements[index] && (
                                <View style={styles.measurementDetails}>
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
                                    <Button title="Edit" onPress={() => handleEdit({ key, ...measurement })} />
                                    <Button title="Delete" onPress={() => handleDelete(key)} />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    addButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        width: 50,
        height: 50,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        zIndex: 1000, // Assicurati che sia sopra gli altri elementi
    },
    form: {
        marginTop: 20
    },
    measurementList: {
        flex: 1,
        marginTop: 90 // Aggiungi spazio sufficiente per evitare la sovrapposizione con il pulsante "+"
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10
    },
    measurementItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f8f9fa',
        borderRadius: 5
    },
    measurementSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    measurementDetails: {
        marginTop: 10
    }
});









