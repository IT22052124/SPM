import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Modal,
  Alert,
} from "react-native";
import * as Speech from "expo-speech"; // Import the Speech module
//to add item
export default function ListItems({ route }) {
  const { listName } = route.params;
  const [items, setItems] = useState([
    {
      id: "1",
      name: "Banana",
      quantity: "500 gms",
      image: require("../assets/icon.png"), // Local image
    },
    {
      id: "2",
      name: "Apple",
      quantity: "1 kg",
      image: require("../assets/icon.png"), // Local image
    },
    {
      id: "3",
      name: "Strawberry",
      quantity: "1.5 kg",
      image: require("../assets/icon.png"), // Local image
    },
  ]);

  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddNewItem = () => {
    if (newItem.name.trim() && newItem.quantity.trim()) {
      const item = {
        id: Date.now().toString(),
        name: newItem.name,
        quantity: newItem.quantity,
        image: require("../assets/icon.png"), // Local image
      };
      setItems([...items, item]);
      setNewItem({ name: "", quantity: "" });
      setModalVisible(false);
      Speech.speak(`${newItem.name}, ${newItem.quantity} added`); // Speak the item details
    } else {
      Alert.alert("Error", "Please fill out all fields.");
    }
  };

  const handleDeleteItem = (id) => {
    const itemToDelete = items.find((item) => item.id === id);
    setItems(items.filter((item) => item.id !== id));
    Speech.speak(`${itemToDelete.name} deleted`); // Speak the item deletion
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.quantity}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteItem(item.id)}
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
        keyExtractor={(item) => item.id}
      />
      <Button title="Add New Item" onPress={() => setModalVisible(true)} />

      {/* Modal for adding a new item */}
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
              onChangeText={(text) =>
                setNewItem({ ...newItem, quantity: text })
              }
            />

            <Button title="Add Item" onPress={handleAddNewItem} />
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="red"
            />
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
