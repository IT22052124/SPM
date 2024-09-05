import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, Button, Modal, Alert } from "react-native";
import axios from 'axios';
import * as Speech from "expo-speech";

export default function ListItems({ route }) {
  const { listId, listName } = route.params;
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch existing items for the list
    axios.get(`http://192.168.43.79:5000/api/shopping-lists/${listId}`)
      .then(response => setItems(response.data.products))
      .catch(error => console.error(error));
  }, [listId]);

  const handleAddNewItem = () => {
    if (newItem.name.trim() && newItem.quantity.trim()) {
      axios.post(`http://192.168.43.79:5000/api/shopping-lists/${listId}/items`, newItem)
        .then(response => {
          setItems(response.data.products);
          setNewItem({ name: "", quantity: "" });
          setModalVisible(false);
          Speech.speak(`${newItem.name}, ${newItem.quantity} added`);
        })
        .catch(error => console.error(error));
    } else {
      Alert.alert("Error", "Please fill out all fields.");
    }
  };

  const handleDeleteItem = (id) => {
    axios.delete(`http://192.168.43.79:5000/api/shopping-lists/${listId}/items/${id}`)
      .then(response => {
        setItems(items.filter(item => item._id !== id));
        Speech.speak('Item deleted');
      })
      .catch(error => console.error(error));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.quantity}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteItem(item._id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{listName}</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      <Button title="Add New Item" onPress={() => setModalVisible(true)} />

      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={newItem.name}
              onChangeText={(text) => setNewItem({ ...newItem, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={newItem.quantity}
              onChangeText={(text) => setNewItem({ ...newItem, quantity: text })}
            />
            <Button title="Add Item" onPress={handleAddNewItem} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    marginLeft: 16,
    padding: 8,
    backgroundColor: "red",
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#fff",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    width: "100%",
    paddingHorizontal: 8,
  },
});
  
