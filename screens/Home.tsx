import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { ref, onValue } from "firebase/database";
import { db } from '../config/Config';

export default function Home({ navigation }: any) {
    const [mascotas, setmascotas] = useState([]);

    function agregarMascota() {
        navigation.navigate('ListaMascotas');
    }

    function leerMascotas() {
        const mascotasRef = ref(db, 'mascotas/');
        onValue(mascotasRef, (snapshot) => {
            const data = snapshot.val(); 
            if (data) {
               
                const listTemp = Object.keys(data).map((key) => ({
                    codigomascota: key, 
                    ...data[key], 
                }));
    
                
                const uniqueList = listTemp.filter((item, index, self) =>
                    index === self.findIndex((t) => t.codigomascota === item.codigomascota)
                );
    
                
                setmascotas(uniqueList);
                console.log("Datos obtenidos: ", uniqueList); 
            } else {
                console.log("No se encontraron mascotas.");
                setmascotas([]); 
            }
        }, (error) => {
            console.error("Error al leer datos: ", error); 
        });
    }
    
    
    useEffect(() => {
        leerMascotas();
    }, []);

    function editarPerfil() {
        navigation.navigate('Perfil');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido al Home</Text>

            <View style={styles.buttonContainer}>
                <Button title="Editar Perfil de Usuario" onPress={editarPerfil} />
            </View>

            <Button title="Agregar Mascota Atendida" onPress={agregarMascota} />

            <Text style={styles.subtitle}>Mascotas Atendidas</Text>
            <FlatList
                data={mascotas}
                keyExtractor={(item) => item.codigomascota}
                renderItem={({ item }: { item: any }) => (
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
    mascota: {
        fontSize: 16,
        paddingVertical: 5,
    },
    buttonContainer: {
        marginBottom: 20,
    },
    mascotaContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 5,
        borderColor: '#ccc',
        borderWidth: 1,
    },
});
