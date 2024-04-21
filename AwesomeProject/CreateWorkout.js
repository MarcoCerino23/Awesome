
import React, { useState } from 'react';
import {
  View, SafeAreaView, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert
} from 'react-native';
import { ref, push, set } from "firebase/database";
import { FIREBASE_DB } from './firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { exercisesData } from './Exercises';
import { getAuth } from "firebase/auth";
function CreateWorkout({ navigation }) {
    const [workoutName, setWorkoutName] = useState('');
    const [selectedExercises, setSelectedExercises] = useState([]);
    
    const handleAddExercise = exercise => {
        const existing = selectedExercises.find(e => e.id === exercise.id);
        if (!existing) {
            setSelectedExercises(prev => [...prev, { ...exercise, sets: 1, reps: 10, rest: '60s' }]);
        }
    };

    const handleChange = (text, index, field) => {
        const updatedExercises = selectedExercises.map((item, idx) => {
            if (idx === index) {
                return { ...item, [field]: text };
            }
            return item;
        });
        setSelectedExercises(updatedExercises);
    };

    

const handleSaveWorkout = async () => {
    const userId = getAuth().currentUser.uid; // Ottieni l'ID dell'utente corrente
    const workoutPath = `workouts/${userId}`; // Crea il percorso del database specifico per l'utente

    if (!workoutName.trim()) {
        Alert.alert('Error', 'Please enter a workout name.');
        return;
    }

    const newWorkoutRef = push(ref(FIREBASE_DB, workoutPath));

    const workoutData = {
        name: workoutName,
        exercises: selectedExercises.map(ex => ({
            id: ex.id,
            title: ex.title,
            sets: ex.sets,
            reps: ex.reps,
            rest: ex.rest
        }))
    };

    try {
        await set(newWorkoutRef, workoutData);
        Alert.alert('Success', 'Workout saved successfully!');
        navigation.goBack();
    } catch (error) {
        Alert.alert('Error', 'Failed to save workout.');
    }
};

    

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="home" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Create Workout</Text>
            </View>
            <TextInput
                style={styles.inputName}
                placeholder="Workout Name"
                placeholderTextColor="#666"
                value={workoutName}
                onChangeText={setWorkoutName}
            />
            <FlatList
                horizontal
                data={exercisesData}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => handleAddExercise(item)}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardList}
            />
            <View style={styles.selectedExercisesContainer}>
                {selectedExercises.map((item, index) => (
                    <View key={index} style={styles.exerciseInputContainer}>
                        <Text style={styles.exerciseTitle}>{item.title}</Text>
                        <TextInput style={styles.input} placeholder="Sets" onChangeText={(text) => handleChange(text, index, 'sets')} value={item.sets.toString()} />
                        <TextInput style={styles.input} placeholder="Reps" onChangeText={(text) => handleChange(text, index, 'reps')} value={item.reps.toString()} />
                        <TextInput style={styles.input} placeholder="Rest" onChangeText={(text) => handleChange(text, index, 'rest')} value={item.rest} />
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
                <Text style={styles.saveButtonText}>Save Workout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f4f7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    screenTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    inputName: {
        fontSize: 16,
        height: 50,
        margin: 20,
        marginBottom: 0,
        paddingHorizontal: 10,
        borderRadius: 25,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardList: {
        paddingVertical: 20,
    },
    card: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectedExercisesContainer: {
        flex: 1,
        margin: 20,
    },
    exerciseInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        flex: 1,
        height: 40,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    saveButton: {
        height: 50,
        borderRadius: 25,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    saveButtonText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
    }
});

export default CreateWorkout;

