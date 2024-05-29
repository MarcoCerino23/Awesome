import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Button, Image } from 'react-native';
import { onAuthStateChanged } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage";
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
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async currentUser => {
            console.log("Current user UID:", currentUser ? currentUser.uid : "No user logged in");
            setUser(currentUser);
            if (currentUser) {
                const userRef = ref(FIREBASE_DB, 'users/' + currentUser.uid + '/measurements');
                try {
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        setMeasurements(snapshot.val());
                    } else {
                        console.log("No data available");
                    }
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
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        if (user) {
            const userRef = ref(FIREBASE_DB, 'users/' + user.uid + '/measurements');
            try {
                await set(userRef, measurements);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
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
        <ScrollView style={styles.container}>
            {Object.keys(measurements).map((key) => (
                <View key={key} style={styles.inputGroup}>
                    <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleChange(key, text)}
                        value={measurements[key]}
                        keyboardType="numeric"
                        onBlur={handleBlur}
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
