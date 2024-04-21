// import React, { useState } from 'react';
// import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
// import { auth } from './firebaseConfig';
// import { firestore } from './firebaseConfig'; // Assicurati che l'importazione sia corretta
// import { collection, addDoc } from 'firebase/firestore';
// import { FIREBASE_APP, FIREBASE_AUTH} from './firebaseConfig';


// const logo = require("./assets/favicon.png");

// export default function SignUpForm() {
//     const navigation = useNavigation();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const auth = FIREBASE_AUTH;

//     const signUp = async () =>{
//         setLoading(true);
//         try{
//             const response = await createUserWithEmailAndPassword(auth,email,password);
//             await sendEmailVerification(response.user);  // Invia un'email di verifica all'utente
//             console.log(response);
//             alert('Check your emails!')
//         } catch(error){
//             console.log(error);
//             alert('Sign in failed: ' + error.message)
//         }finally{
//             setLoading(false);
//         }
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <Image source={logo} style={styles.image} resizeMode='contain' />
//             <Text style={styles.title}>Sign Up</Text>
//             <View style={styles.inputView}>
//                 <TextInput
//                     style={styles.input}
//                     placeholder='EMAIL'
//                     value={email}
//                     onChangeText={setEmail}
//                     autoCorrect={false}
//                     autoCapitalize='none'
//                 />
//                 <TextInput
//                     style={styles.input}
//                     placeholder='PASSWORD'
//                     secureTextEntry
//                     value={password}
//                     onChangeText={setPassword}
//                     autoCorrect={false}
//                     autoCapitalize='none'
//                 />
//             </View>
//             <Pressable style={styles.button} onPress={signUp}>
//                 <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
//             </Pressable>
//             <Text style={styles.footerText}>Already have an account?
//                 <Text style={styles.signup} onPress={() => navigation.navigate('Login')}> Log In</Text>
//             </Text>
//         </SafeAreaView>
//     );
// }



// const styles = StyleSheet.create({
//     container: {
//         alignItems: 'center',
//         paddingTop: 70,
//     },
//     image: {
//         height: 160,
//         width: 170,
//     },
//     title: {
//         fontSize: 30,
//         fontWeight: 'bold',
//         textTransform: 'uppercase',
//         textAlign: 'center',
//         paddingVertical: 40,
//         color: 'red',
//     },
//     inputView: {
//         gap: 15,
//         width: '100%',
//         paddingHorizontal: 40,
//         marginBottom: 5,
//     },
//     input: {
//         height: 50,
//         paddingHorizontal: 20,
//         borderColor: 'red',
//         borderWidth: 1,
//         borderRadius: 7,
//     },
//     button: {
//         backgroundColor: 'red',
//         height: 45,
//         borderColor: 'gray',
//         borderWidth: 1,
//         borderRadius: 5,
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '80%', // Aggiunto per rendere il bottone più grande
//         marginTop: 10, // Aggiunto per spazio sopra il bottone
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     footerText: {
//         textAlign: 'center',
//         color: 'gray',
//         marginTop: 20, // Aggiunto per spazio sopra il testo
//     },
//     signup: {
//         color: 'red',
//         fontSize: 13,
//     }
// });



import React, { useState } from 'react';
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DB } from './firebaseConfig';

const logo = require("./assets/favicon.png");

export default function SignUpForm() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);

    const signUp = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const user = userCredential.user;
            await sendEmailVerification(user);
            const userRef = ref(FIREBASE_DB, 'users/' + user.uid);
            // Salva i dati aggiuntivi nel Realtime Database
            set(userRef, {
                firstName: firstName,
                lastName: lastName,
                email: email
            });
            Alert.alert('Success', 'Check your email for verification!');
            navigation.navigate('Login'); // Naviga alla pagina di login dopo la registrazione
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={logo} style={styles.image} resizeMode='contain' />
            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    placeholder='First Name'
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Last Name'
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
            </View>
            <Pressable style={styles.button} onPress={signUp} disabled={loading}>
                <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
            </Pressable>
            <Text style={styles.footerText}>Already have an account?
                <Text style={styles.signup} onPress={() => navigation.navigate('Login')}> Log In</Text>
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: 70,
    },
    image: {
        height: 160,
        width: 170,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        paddingVertical: 40,
        color: 'red',
    },
    inputView: {
        gap: 15,
        width: '100%',
        paddingHorizontal: 40,
        marginBottom: 5,
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 7,
    },
    button: {
        backgroundColor: 'red',
        height: 45,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 20,
    },
    signup: {
        color: 'red',
        fontSize: 13,
    }
});
