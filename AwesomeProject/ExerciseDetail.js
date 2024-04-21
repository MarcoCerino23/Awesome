import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

function ExerciseDetail({ route }) {
  const { exercise } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{exercise.title}</Text>
      <Image source={exercise.gif} style={styles.gif} />
      <Text style={styles.descriptionTitle}>EXERCISE DESCRIPTION</Text>
      <Text style={styles.description}>{exercise.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  gif: {
    width: '100%',
    height: 300, // Adjust the height according to your GIF aspect ratio
    resizeMode: 'contain',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
  }
});

export default ExerciseDetail;
