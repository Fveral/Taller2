import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, Alert } from 'react-native';
import { ref, set, onValue } from "firebase/database";
import { db } from '../config/Config';
import { auth } from "../config/Config";

export default function Perfil() {
  const [nombre, setnombre] = useState('');
  const [telefono, settelefono] = useState('');
  const [correo, setcorreo] = useState('usuario@example.com');


  function guardarPerfil() {
    const userId = auth.currentUser?.uid;
    if (userId) {
      set(ref(db, 'users/' + userId), {
        name: nombre,
        phone: telefono
      }).then(() => {
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
      }).catch((error) => {
        Alert.alert('Error', 'No se pudo actualizar el perfil');
      });
    } else {
      Alert.alert('Error', 'Usuario no autenticado');
    }
}

function leerPerfilUsuario() {
    const userEmail = auth.currentUser?.email;

    if (userEmail) {
      setcorreo(userEmail);
    } else {
      Alert.alert('Error', 'Usuario no autenticado');
    }
}

useEffect(() => {
    leerPerfilUsuario();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modificar Perfil</Text>

      <Text style={styles.label}>Correo Electrónico:</Text>
      <Text style={styles.email}>{correo}</Text>

      <Text>Nombre</Text>
      <TextInput
        placeholder="Ingrese su nombre"
        onChangeText={(texto) => setnombre(texto)}
        style={styles.input}
      />

      <Text>Teléfono</Text>
      <TextInput
        placeholder="Ingrese Telefono"
        onChangeText={(texto) => settelefono(texto)}
        style={styles.input}
      />

      <Button title="Guardar Cambios" onPress={() => guardarPerfil()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
});
