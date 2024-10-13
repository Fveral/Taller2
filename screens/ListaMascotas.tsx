import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { ref, set, push, onValue } from 'firebase/database';
import { db } from '../config/Config';

export default function AgregarMascota() {
  const [nombre, setnombre] = useState('');
  const [especie, setespecie] = useState('');
  const [raza, setraza] = useState('');
  const [edad, setedad] = useState(0);
  const [dueno, setdueno] = useState('');
  const [contactoDueno, setcontactodueno] = useState('');
  const [historialMedico, sethistorialmedico] = useState('');
  const [mascotas, setmascotas] = useState([]);

  function leerMascotas() {
    const mascotasRef = ref(db, 'mascotas/');
    onValue(mascotasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listTemp = Object.keys(data).map((key) => ({
          codigomascota: key,
          ...data[key],
        }));
        setmascotas(listTemp);
      }
    });
  };

  useEffect(() => {
    leerMascotas();
  }, []);

  const agregarMascota = () => {
    if (!nombre || !especie || !raza || !edad || !dueno || !contactoDueno || !historialMedico) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    const mascotasRef = ref(db, 'mascotas/');
    const nuevaMascotaRef = push(mascotasRef);

    set(nuevaMascotaRef, {
      nombre,
      especie,
      raza,
      edad,
      dueno,
      contactoDueno,
      historialMedico,
    }).then(() => {
      Alert.alert('Éxito', 'Mascota agregada correctamente', [
        {
          text: 'OK',
          onPress: () => {
          },
        },
      ]);
    })
    .catch((error) => {
      Alert.alert('Error', 'No se pudo agregar la mascota: ' + error.message);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Mascota</Text>

      <TextInput
        placeholder="Nombre"
        onChangeText={(texto) => setnombre(texto)}
        style={styles.input}
        value={nombre}
      />
      <TextInput
        placeholder="Especie"
        onChangeText={(texto) => setespecie(texto)}
        style={styles.input}
        value={especie}
      />
      <TextInput
        placeholder="Raza"
        onChangeText={(texto) => setraza(texto)}
        style={styles.input}
        value={raza}
      />
      <TextInput
        placeholder="Edad"
        onChangeText={(texto) => setedad(+texto)}
        keyboardType="numeric"
        style={styles.input}
        value={edad ? edad.toString() : ''}
      />
      <TextInput
        placeholder="Dueño"
        onChangeText={(texto) => setdueno(texto)}
        style={styles.input}
        value={dueno}
      />
      <TextInput
        placeholder="Contacto del Dueño"
        onChangeText={(texto) => setcontactodueno(texto)}
        style={styles.input}
        value={contactoDueno}
      />
      <TextInput
        placeholder="Historial Médico"
        onChangeText={(texto) => sethistorialmedico(texto)}
        style={styles.input}
        value={historialMedico}
      />

      <Button title="Guardar Mascota" onPress={agregarMascota} />

      <Text style={styles.subtitle}>Mascotas Agregadas:</Text>
      <FlatList
        data={mascotas}
        keyExtractor={(item) => item.codigomascota}
        renderItem={({ item }) => (
          <View style={styles.mascotaContainer}>
            <Text style={styles.mascota}>Nombre: {item.nombre}</Text>
            <Text style={styles.mascota}>Especie: {item.especie}</Text>
            <Text style={styles.mascota}>Raza: {item.raza}</Text>
            <Text style={styles.mascota}>Edad: {item.edad}</Text>
            <Text style={styles.mascota}>Dueño: {item.dueno}</Text>
            <Text style={styles.mascota}>Contacto: {item.contactoDueno}</Text>
            <Text style={styles.mascota}>Historial: {item.historialMedico}</Text>
          </View>
        )}
      />
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
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  mascotaContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  mascota: {
    fontSize: 16,
    paddingVertical: 5,
  },
});
