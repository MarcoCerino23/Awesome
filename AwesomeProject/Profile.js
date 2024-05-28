import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Button, Image } from 'react-native';
import { onAuthStateChanged } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { getDownloadURL, uploadBytes, ref as storageRef } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STORAGE } from './firebaseConfig';

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
    const [image, setImage] = useState(null);

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
                    console.error("Error fetching measurements:", error);
                });

                const imageRef = storageRef(FIREBASE_STORAGE, 'profileImages/' + currentUser.uid);
                getDownloadURL(imageRef).then((url) => {
                    setImage(url);
                }).catch((error) => {
                    if (error.code === 'storage/object-not-found') {
                        console.log("Image not found, skipping download URL retrieval.");
                    } else {
                        console.error("Error getting download URL:", error);
                    }
                });
            }
        });
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const handleSave = () => {
        if (user) {
            const userRef = ref(FIREBASE_DB, 'users/' + user.uid + '/measurements');
            set(userRef, measurements)
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            try {
                console.log("Image selected:", result.uri);
                const response = await fetch(result.uri);
                console.log("Response fetched:", response);
                const blob = await response.blob();
                console.log("Blob created:", blob);
                const imageRef = storageRef(FIREBASE_STORAGE, 'profileImages/' + user.uid);
                await uploadBytes(imageRef, blob);
                console.log("Image uploaded successfully");
                const url = await getDownloadURL(imageRef);
                setImage(url);
                console.log("Image URL:", url);
            } catch (error) {
                console.error("Error uploading or getting download URL:", error);
                Alert.alert('Error', 'Failed to upload image or get URL.');
            }
        }
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
            <View style={styles.imagePickerContainer}>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <Button title="Pick an image from gallery" onPress={pickImage} />
            </View>
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
    }
});
