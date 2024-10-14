import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { ref, set, push, onValue, update, remove } from 'firebase/database';
import { auth, db } from '../config/Config';
import { signOut } from 'firebase/auth';

export default function ListaMascotas({ navigation }: any) {
  const [nombre, setnombre] = useState('');
  const [especie, setespecie] = useState('');
  const [raza, setraza] = useState('');
  const [edad, setedad] = useState(0);
  const [dueno, setdueno] = useState('');
  const [contactoDueno, setcontactodueno] = useState('');
  const [historialMedico, sethistorialmedico] = useState('');
  const [mascotas, setmascotas] = useState([]);
  const [selectedMascota, setSelectedMascota] = useState(null);

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
  }

  useEffect(() => {
    leerMascotas();
  }, []);

  function agregarMascota() {
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
      Alert.alert('Éxito', 'Mascota agregada correctamente');
      resetForm();
    })
    .catch((error) => {
      Alert.alert('Error', 'No se pudo agregar la mascota: ' + error.message);
    });
  };

  function actualizarMascota() {
    if (!selectedMascota) return;
    const mascotaRef = ref(db, `mascotas/${selectedMascota.codigomascota}`);

    update(mascotaRef, {
      nombre,
      especie,
      raza,
      edad,
      dueno,
      contactoDueno,
      historialMedico,
    }).then(() => {
      Alert.alert('Éxito', 'Mascota actualizada correctamente');
      resetForm();
    }).catch((error) => {
      Alert.alert('Error', 'No se pudo actualizar la mascota: ' + error.message);
    });
  };

  function eliminarMascota(codigomascota) {
    const mascotaRef = ref(db, `mascotas/${codigomascota}`);
    
    remove(mascotaRef).then(() => {
      Alert.alert('Éxito', 'Mascota eliminada correctamente');
    }).catch((error) => {
      Alert.alert('Error', 'No se pudo eliminar la mascota: ' + error.message);
    });
  };

  function seleccionarMascota(mascota) {
    setSelectedMascota(mascota);
    setnombre(mascota.nombre);
    setespecie(mascota.especie);
    setraza(mascota.raza);
    setedad(mascota.edad);
    setdueno(mascota.dueno);
    setcontactodueno(mascota.contactoDueno);
    sethistorialmedico(mascota.historialMedico);
  };

  function resetForm() {
    setnombre('');
    setespecie('');
    setraza('');
    setedad(0);
    setdueno('');
    setcontactodueno('');
    sethistorialmedico('');
    setSelectedMascota(null);
  };

  function cerrarSesion() {
    signOut(auth).then(() => {
      Alert.alert('Éxito', 'Has cerrado sesión correctamente.');
      navigation.navigate('Login');
    }).catch((error) => {
      Alert.alert('Error', 'No se pudo cerrar sesión: ' + error.message);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informacion Mascotas</Text>

      <View style={styles.inputContainer}>
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
      </View>
      <View style={styles.inputContainer}>
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
      </View>
      <View style={styles.inputContainer}>
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
      </View>
      <TextInput
        placeholder="Historial Médico"
        onChangeText={(texto) => sethistorialmedico(texto)}
        style={[styles.historialInput]}
        numberOfLines={2}
        value={historialMedico}
      />

      <Button title="Guardar Mascota" onPress={agregarMascota} />
      <Button title="Actualizar Mascota" onPress={actualizarMascota} disabled={!selectedMascota} />
      <Button title="Cerrar Sesión" onPress={cerrarSesion} color="#FF0000" />

      <Text style={styles.subtitle}>Mascotas Agregadas:</Text>
      <FlatList
        data={mascotas}
        keyExtractor={(item) => item.codigomascota}
        renderItem={({ item }: {item: any}) => (
          <View style={styles.mascotaContainer}>
            <Text style={styles.mascota}>Nombre: {item.nombre}</Text>
            <Text style={styles.mascota}>Especie: {item.especie}</Text>
            <Text style={styles.mascota}>Raza: {item.raza}</Text>
            <Text style={styles.mascota}>Edad: {item.edad}</Text>
            <Text style={styles.mascota}>Dueño: {item.dueno}</Text>
            <Text style={styles.mascota}>Contacto: {item.contactoDueno}</Text>
            <Text style={styles.mascota}>Historial: {item.historialMedico}</Text>
            <Button title="Seleccionar" onPress={() => seleccionarMascota(item)} />
            <Button title="Eliminar" onPress={() => eliminarMascota(item.codigomascota)} />
          </View>
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        style={{ marginVertical: 10 }}
        getItemLayout={(data, index) => (
          { length: 120, offset: 120 * index, index }
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
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    flex: 1,
    backgroundColor: '#fff',
  },
  mascotaContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  mascota: {
    fontSize: 16,
    paddingVertical: 5,
  },
  historialInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});
