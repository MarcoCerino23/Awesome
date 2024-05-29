
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { FIREBASE_DB } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { exercisesData } from './Exercises';  // Assicurati che il percorso sia corretto

function WorkoutDetails({ route }) {
    const { workout, userId } = route.params;  // Aggiungi userId ai params
    const [workoutDetails, setWorkoutDetails] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        // Aggiorna il percorso con userId
        const workoutRef = ref(FIREBASE_DB, `workouts/${userId}/${workout.id}`);
        const unsubscribe = onValue(workoutRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Arricchisce ogni esercizio con i dati da exercisesData, inclusa la gif
                const enrichedExercises = data.exercises.map(ex => {
                    const exerciseInfo = exercisesData.find(ed => ed.id === ex.id);
                    return { ...ex, gif: exerciseInfo ? exerciseInfo.gif : undefined };
                });
                setWorkoutDetails({...data, exercises: enrichedExercises});
            }
        });

        return () => unsubscribe();
    }, [userId, workout.id]);
    

    if (!workoutDetails) {
        return (
            <View style={styles.centered}>
                <Text>Caricamento dei dettagli dell'allenamento...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{workoutDetails.name}</Text>
            </View>
            {workoutDetails.exercises.map((exercise, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={styles.exerciseContainer}
                    onPress={() => navigation.navigate('SeriesDetails', {
                        userId: userId,  // Passa userId
                        exercise: exercise, 
                        workoutId: workout.id, 
                        exerciseIndex: index
                    })}
                >
                    {exercise.gif && <Image source={exercise.gif} style={styles.gif} />}
                    <View style={styles.SeriesDetails}>
                        <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                        <Text>Sets: {exercise.sets}</Text>
                        <Text>Reps: {exercise.reps}</Text>
                        <Text>Rest: {exercise.rest}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    exerciseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
    },
    gif: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    SeriesDetails: {
        flex: 1,
    },
    exerciseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    }
});

export default WorkoutDetails;



