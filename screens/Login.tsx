import { signInWithEmailAndPassword } from "firebase/auth";

import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import { auth } from "../config/Config";

export default function Login( {navigation}: any) {
    const [correo, setcorreo] = useState('')
    const [contrasenia, setcontrasenia] = useState('')

    function login() {
        signInWithEmailAndPassword(auth, correo, contrasenia)
        .then((userCredential) => {
            const user = userCredential.user;
            navigation.navigate('Home')
            Alert.alert('Acceso Correcto')
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          Alert.alert('Acceso Denegado', `Código: ${errorCode}\nMensaje: ${errorMessage}`, [
            {
                text: 'OK',
                onPress: () => {
                    if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
                        navigation.navigate('Registro');
                    }
                },
            },
        ]);
      });
    }
    

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
            placeholder='Ingrese correo'
            onChangeText={(texto) => setcorreo(texto)}
            style={styles.input}
        />
        <TextInput
            placeholder='Ingrese contrasenia'
            onChangeText={(texto) => setcontrasenia(texto)}
            style={styles.input}
        />
        <View style={styles.buttonContainer}>
            <Button title='Login' onPress={login}/>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
