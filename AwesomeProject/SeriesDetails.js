// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
// import { ref, update, onValue } from 'firebase/database';
// import { FIREBASE_DB } from './firebaseConfig';

// function SeriesDetails({ route }) {
//     const { exercise, workoutId, exerciseIndex } = route.params; 
//     // Usa uno stato separato per il numero di serie se questo può cambiare.
//     const [numOfSets, setNumOfSets] = useState(exercise.sets);
//     const [weights, setWeights] = useState([]);

//     useEffect(() => {
//         const weightsRef = ref(FIREBASE_DB, `workouts/${workoutId}/exercises/${exerciseIndex}/weights`);
//         const unsubscribe = onValue(weightsRef, (snapshot) => {
//             const weightsData = snapshot.val() || [];
//             // Crea un nuovo array con un numero di elementi basato sul numero di serie.
//             // Se ci sono dei pesi salvati, usali; altrimenti usa una stringa vuota.
//             setWeights(Array.from({ length: numOfSets }, (_, index) => weightsData[index] || ''));
//         });

//         return () => unsubscribe();
//     }, [workoutId, exerciseIndex, numOfSets]);

//     const handleWeightChange = (text, index) => {
//         const newWeights = [...weights];
//         newWeights[index] = text;
//         setWeights(newWeights);
//     };

//     const saveWeights = () => {
//         const weightsPath = `workouts/${workoutId}/exercises/${exerciseIndex}/weights`;
//         const weightsUpdate = {};
//         weights.forEach((weight, index) => {
//             weightsUpdate[`${weightsPath}/${index}`] = weight;
//         });
    
//         update(ref(FIREBASE_DB), weightsUpdate)
//             .then(() => alert("Pesi salvati con successo!"))
//             .catch(error => alert("Errore nel salvataggio: " + error.message));
//     };

//     return (
//         <ScrollView style={styles.container}>
//             <Text style={styles.header}>{exercise.title}</Text>
//             {Array.from({ length: numOfSets }).map((_, index) => (
//                 <View key={index} style={styles.inputContainer}>
//                     <Text>Serie {index + 1}: </Text>
//                     <TextInput
//                         style={styles.input}
//                         onChangeText={(text) => handleWeightChange(text, index)}
//                         value={weights[index] || ''}
//                         keyboardType="numeric"
//                         placeholder="Peso (kg)"
//                     />
//                 </View>
//             ))}
//             <Button title="Salva Pesi" onPress={saveWeights} />
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         padding: 10,
//     },
//     header: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     input: {
//         borderBottomWidth: 1,
//         borderBottomColor: '#cccccc',
//         flex: 1,
//         marginRight: 10,
//         padding: 5,
//     }
// });

// export default SeriesDetails;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { ref, update, onValue } from 'firebase/database';
import { FIREBASE_DB } from './firebaseConfig';

function SeriesDetails({ route }) {
    const { userId, exercise, workoutId, exerciseIndex } = route.params; // Includi userId nei params

    const [numOfSets, setNumOfSets] = useState(exercise.sets);
    const [weights, setWeights] = useState([]);

    useEffect(() => {
        // Aggiorna il percorso con userId
        const weightsRef = ref(FIREBASE_DB, `workouts/${userId}/${workoutId}/exercises/${exerciseIndex}/weights`);
        const unsubscribe = onValue(weightsRef, (snapshot) => {
            const weightsData = snapshot.val() || [];
            setWeights(Array.from({ length: numOfSets }, (_, index) => weightsData[index] || ''));
        });

        return () => unsubscribe();
    }, [userId, workoutId, exerciseIndex, numOfSets]);

    const handleWeightChange = (text, index) => {
        const newWeights = [...weights];
        newWeights[index] = text;
        setWeights(newWeights);
    };

    const saveWeights = () => {
        // Aggiorna il percorso con userId
        const weightsPath = `workouts/${userId}/${workoutId}/exercises/${exerciseIndex}/weights`;
        const weightsUpdate = {};
        weights.forEach((weight, index) => {
            weightsUpdate[`${weightsPath}/${index}`] = weight;
        });
    
        update(ref(FIREBASE_DB), weightsUpdate)
            .then(() => alert("Pesi salvati con successo!"))
            .catch(error => alert("Errore nel salvataggio: " + error.message));
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>{exercise.title}</Text>
            {Array.from({ length: numOfSets }).map((_, index) => (
                <View key={index} style={styles.inputContainer}>
                    <Text>Serie {index + 1}: </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleWeightChange(text, index)}
                        value={weights[index] || ''}
                        keyboardType="numeric"
                        placeholder="Peso (kg)"
                    />
                </View>
            ))}
            <Button title="Salva Pesi" onPress={saveWeights} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        flex: 1,
        marginRight: 10,
        padding: 5,
    }
});

export default SeriesDetails;
