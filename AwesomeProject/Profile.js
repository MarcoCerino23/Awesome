
import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { onAuthStateChanged } from "firebase/auth";
import { ref, set, push, onValue, update, remove } from "firebase/database";
import { FIREBASE_DB, FIREBASE_AUTH } from './firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Assicurati di avere installato questo pacchetto
=======
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Button, Image } from 'react-native';
import { onAuthStateChanged } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STORAGE } from './firebaseConfig';
>>>>>>> origin/cre

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
<<<<<<< HEAD
    const [editingMeasurement, setEditingMeasurement] = useState(null);
    const [expandedMeasurements, setExpandedMeasurements] = useState({});
=======
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
>>>>>>> origin/cre

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async currentUser => {
            console.log("Current user UID:", currentUser ? currentUser.uid : "No user logged in");
            setUser(currentUser);
            if (currentUser) {
<<<<<<< HEAD
                const userMeasurementsRef = ref(FIREBASE_DB, `users/${currentUser.uid}/measurements`);
                onValue(userMeasurementsRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setMeasurements(Object.entries(data));
=======
                const userRef = ref(FIREBASE_DB, 'users/' + currentUser.uid + '/measurements');
                try {
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        setMeasurements(snapshot.val());
>>>>>>> origin/cre
                    } else {
                        setMeasurements([]);
                    }
<<<<<<< HEAD
                });
=======
                } catch (error) {
                    console.error("Error fetching measurements:", error);
                }

                try {
                    const url = await getDownloadURL(storageRef(FIREBASE_STORAGE, 'profileImages/' + currentUser.uid));
                    setImage(url);
                } catch (error) {
                    if (error.code === 'storage/object-not-found') {
                        console.log("Image not found, skipping download URL retrieval.");
                    } else {
                        console.error("Error getting download URL:", error);
                    }
                }
>>>>>>> origin/cre
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
<<<<<<< HEAD
        if (!user) {
=======
        if (user) {
            const userRef = ref(FIREBASE_DB, 'users/' + user.uid + '/measurements');
            try {
                await set(userRef, measurements);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        } else {
>>>>>>> origin/cre
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

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
            console.log("Image selection canceled or no assets");
            return;
        }

        const uri = result.assets[0].uri;
        console.log("ImagePicker result:", result);
        console.log("Image selected:", uri);

        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const imageRef = storageRef(FIREBASE_STORAGE, 'profileImages/' + user.uid);
            const uploadTask = uploadBytesResumable(imageRef, blob);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Progress monitoring
                    console.log('Upload is ' + (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '% done');
                },
                (error) => {
                    console.error("Error during image upload:", error);
                    Alert.alert('Error', 'Failed to upload image: ' + error.message);
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setImage(url);
                    console.log("Download URL retrieved:", url);
                }
            );
        } catch (error) {
            console.error("Error during image upload and retrieval:", error);
            Alert.alert('Error', 'Failed to upload image or retrieve download URL: ' + error.message);
        }
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
<<<<<<< HEAD
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
=======
                        onBlur={handleBlur}
                    />
                </View>
            ))}
            <View style={styles.imagePickerContainer}>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <Button title="Pick an image from gallery" onPress={pickImage} />
            </View>
        </ScrollView>
>>>>>>> origin/cre
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
<<<<<<< HEAD
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
=======
        padding: 10
    },
    label: {
        fontSize: 16,
        marginBottom: 5
    },
    imagePickerContainer: {
        alignItems: 'center',
        marginVertical: 20
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 10
>>>>>>> origin/cre
    }
});









