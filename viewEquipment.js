import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';

export default function ViewEquipment() {
    //Define state variables
    const [equipment, setEquipment] = useState([]);
    const [name, setName] = useState('');
    const [partCode, setPartCode] = useState('');
    const [price, setPrice] = useState('');
    const [inStock, setInStock] = useState(true);
    const [lastServiced, setLastServiced] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    //useEffect hook to fetch equipment data
    useEffect(() => {
        fetchEquipment();
    }, []);

    //Function to fetch equipment data from the API
    const fetchEquipment = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/equipment`);
            setEquipment(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    //Function to handle adding or updating equipment
    const addOrUpdate = async () => {
        try {
            if (selectedId) {
                //Update equipment
                await axios.put(`http://localhost:3000/equipment/${selectedId}`, {
                    name, partCode, price: parseFloat(price), inStock, lastServiced
                });
            } else {
                //Add new equipment
                await axios.post(`http://localhost:3000/equipment`, {
                    name, partCode, price: parseFloat(price), inStock, lastServiced
                });
            }
            fetchEquipment(); //Refresh the list
            clearForm(); //Crear form inputs
        } catch (error) {
            console.error(error);
        }
    };

    //Function to delete an equipment record by ID
    const deleteEquipment = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/equipment/${id}`);
            fetchEquipment();
        } catch (error) {
            console.error(error);
        }
    };

    //Function to clear form inputs and reset the selected ID
    const clearForm = () => {
        setName('');
        setPartCode('');
        setPrice('');
        setInStock(true);
        setLastServiced('');
        setSelectedId(null);
    }

    //Function to handle editing an equipment item
    const handleEdit = (item) => {
        setName(item.name);
        setPartCode(item.partCode);
        setPrice(item.price.toString());
        setInStock(item.inStock);
        setLastServiced(item.lastServiced);
        setSelectedId(item.id);
    };

    return (
        <View style={styles.container}>
            <View style={styles.boxContainer}>
                <View style={styles.inputBox}>
                    <Text style={styles.header}>Equipment Management</Text>
                    <TextInput placeholder="ID (Auto-generated)" value={selectedId ? selectedId.toString() : ''} editable={false} style={styles.input} />
                    <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
                    <TextInput placeholder="Part Code" value={partCode} onChangeText={setPartCode} style={styles.input} />
                    <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
                    <TextInput placeholder="In Stock" value={inStock ? 'Yes' : 'No'} onChangeText={() => setInStock(!inStock)} style={styles.input} />
                    <TextInput placeholder="Last Serviced Date" value={lastServiced} onChangeText={setLastServiced} style={styles.input} />
                    <Button title={selectedId ? "Update Equipment" : "Add Equipment"} onPress={addOrUpdate} />
                </View>

                <View style={styles.displayBox}>
                    <FlatList
                        data={equipment}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text style={styles.itemText}><Text style={styles.label}>ID:</Text> {item.id}</Text>
                                <Text style={styles.itemText}><Text style={styles.label}>Name:</Text> {item.name}</Text>
                                <Text style={styles.itemText}><Text style={styles.label}>Part Code:</Text> {item.partCode}</Text>
                                <Text style={styles.itemText}><Text style={styles.label}>Price:</Text> ${item.price || 'N/A'}</Text>
                                <Text style={styles.itemText}><Text style={styles.label}>In Stock:</Text> {item.inStock ? 'Yes' : 'No'}</Text>
                                <Text style={styles.itemText}><Text style={styles.label}>Last Serviced:</Text> {item.lastServiced ? new Date(item.lastServiced).toISOString().split('T')[0] : 'N/A'}</Text>
                                <View style={styles.buttonContainer}>
                                    <Button title="Edit" onPress={() => handleEdit(item)} />
                                    <Button title="Delete" onPress={() => deleteEquipment(item.id)} />
                                </View>
                            </View>
                        )}
                        style={styles.flatlist}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    boxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        maxWidth: 800,
    },
    inputBox: {
        width: '45%',
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        minHeight: 450,
        justifyContent: 'space-between',
    },
    displayBox: {
        width: '45%',
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        height: 450,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    item: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007BFF',
        marginHorizontal: 5,
        flex: 1,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    flatList: {
        maxHeight: '100%',
    },
});
