

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue } from 'firebase/database';
import { FIREBASE_DB } from './firebaseConfig';

function UsersList() {
    const [allUsers, setAllUsers] = useState([]);  // Rinominato per chiarezza
    const [filteredUsers, setFilteredUsers] = useState([]);  // Aggiunto per gestire gli utenti filtrati
    const [searchText, setSearchText] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const usersRef = ref(FIREBASE_DB, 'users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            const usersList = data ? Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })) : [];
            setAllUsers(usersList);
            setFilteredUsers(usersList);  // Imposta anche gli utenti filtrati inizialmente a tutti gli utenti
        });
        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
            style={styles.userItem}
        >
            <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
        </TouchableOpacity>
    );

    const handleSearch = (text) => {
        setSearchText(text);
        if (text === '') {
            setFilteredUsers(allUsers);  // Mostra tutti gli utenti se la barra di ricerca è vuota
        } else {
            const filtered = allUsers.filter(user =>
                user.firstName.toLowerCase().includes(text.toLowerCase()) ||
                user.lastName.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search by name..."
                onChangeText={handleSearch}
                value={searchText}
            />
            <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    userItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userName: {
        fontSize: 16,
    },
    searchBar: {
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default UsersList;
