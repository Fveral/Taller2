import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/Config';

export default function Registro({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  function validarCorreo(email: string) {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  }

  function registro() {
    if (!validarCorreo(correo)) {
      Alert.alert('Correo inválido', 'Por favor ingrese un correo electrónico válido.');
      return;
    }

    if (contrasenia.length < 6) {
      Alert.alert('Contraseña inválida', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    createUserWithEmailAndPassword(auth, correo, contrasenia)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert('Registro exitoso!', 'Ahora puedes iniciar sesión.', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ]);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert('Error de registro');
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        placeholder='Ingrese correo'
        onChangeText={(texto) => setCorreo(texto)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder='Ingrese contraseña'
        onChangeText={(texto) => setContrasenia(texto)}
        style={styles.input}
        secureTextEntry={true}
      />
      <View style={styles.buttonContainer}>
        <Button title='Registro' onPress={registro} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
