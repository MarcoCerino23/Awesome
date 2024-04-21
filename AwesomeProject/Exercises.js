import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

export const exercisesData = [
  {
    id: '1',
    title: 'Bench Press',
    muscle: 'Chest',
    description: 'Lie face up on a flat bench...',
    gif: require('./18670.gif'), // Sostituisci con il tuo percorso locale
  },
  {
    id: '2',
    title: 'Incline Bench Press',
    muscle: 'Chest',
    description: 'Lie back on an incline bench...',
    gif: require('./18670.gif'),
  },
  // Altri esercizi...
];

function Exercises({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
    >
      <Image source={item.gif} style={styles.gif} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.muscle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={exercisesData}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#ffffff',
  },
  item: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    alignItems: 'center',
  },
  gif: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default Exercises;
