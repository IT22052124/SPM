import React, { useState, useEffect } from "react";
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
import axios from "axios";
import * as Speech from "expo-speech";
import DropdownComponent from "../components/dropdown";

export default function ListItems({ route }) {
  const { listId, listName } = route.params;
  const [items, setItems] = useState([]);
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch existing items for the list
    axios
      .get(`http://172.20.10.3:5000/shoppinglist/shopping-lists/${listId}`)
      .then((response) => setItems(response.data.products))
      .catch((error) => console.error(error));
  }, [listId, newItem]);

  useEffect(() => {
    // Fetch product data
    axios
      .get(`http://172.20.10.3:5000/product/products`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleAddNewItem = () => {
    if (newItem.name && newItem.quantity.trim()) {
      const selectedProduct = data.find(
        (product) => product.name === newItem.name
      );

      if (selectedProduct) {
        const itemDetails = {
          productId: selectedProduct._id,
          name: selectedProduct.name,
          category: selectedProduct.Category,
          quantity: newItem.quantity,
          price: selectedProduct.price,
        };

        axios
          .post(
            `http://172.20.10.3:5000/shoppinglist/shopping-lists/${listId}/items`,
            itemDetails
          )
          .then((response) => {
            setNewItem({ name: "", quantity: "" });
            setModalVisible(false);
            Speech.speak(`${newItem.name}, ${newItem.quantity} added`);
          })
          .catch((error) => console.error(error));
      } else {
        Alert.alert("Error", "Selected product not found.");
      }
    } else {
      Alert.alert("Error", "Please fill out all fields.");
    }
  };

  const handleDeleteItem = (id) => {
    axios
      .delete(
        `http://172.20.10.3:5000/shoppinglist/shopping-lists/${listId}/items/${id}`
      )
      .then((response) => {
        setItems(items.filter((item) => item._id !== id));
        Speech.speak("Item deleted");
      })
      .catch((error) => {
        console.error(
          "Error deleting item:",
          error.response ? error.response.data : error.message
        );
      });
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => Speech.speak(item.quantity + item.name)} // Read out product name on long press
      style={styles.card}
    >
      <Image source={{ uri: item.product.imageUrl[0] }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.price}>Per: {item.product.BasePrice}/-</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteItem(item._id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{listName}</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModalVisible(true) + Speech.speak("Add new Item");
        }}
      >
        <Text style={styles.addButtonText}>Add New Item</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Item</Text>
            <DropdownComponent
              data={data}
              setNewItem={setNewItem}
              newItem={newItem}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={newItem.quantity}
              onChangeText={(text) =>
                setNewItem({ ...newItem, quantity: text })
              }
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAddNewItem}
              >
                <Text style={styles.modalButtonText}>Add Item</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false); // Close the modal
                  Speech.speak("canceled"); // Speak the message
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  quantity: {
    fontSize: 13,
    fontWeight: "bold",
    color: "green",
    marginBottom: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: "bold",
    color: "red",
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F2F2F2", // Light gradient background
  },
  header: {
    borderColor: "#007bff", // Border color
    borderWidth: 0.5, //
    fontFamily: "monospace",
    borderColor: "#007bff",
    fontSize: 24,
    marginTop: -10,
    backgroundColor: "white",
    fontWeight: "bold",
    marginBottom: 16,
    padding: 10,
    borderRadius: 20,
    textAlign: "center",
    color: "black", // Darker teal for the header
  },
  listContainer: {
    backgroundColor: "#F2F2F2", // Set the background color to red
    padding: 6,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff", // White card background
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 15,
    alignItems: "center",
    shadowColor: "#000", // Shadow for card
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#333", // Darker text color
  },
  details: {
    fontSize: 14,
    color: "#555", // Slightly lighter text color
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "red", // Red color for delete button
    borderRadius: 6,
    shadowColor: "#000", // Shadow for button
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 15,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#007bff", // Dark teal background
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000", // Shadow for button
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 320,
    padding: 24,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#00796b",
  },
  input: {
    height: 50,
    borderColor: "#007bff",
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 12,
    backgroundColor: "#e0f2f1", // Light teal background
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#00796b", // Dark teal background for buttons
    alignItems: "center",
    shadowColor: "#000", // Shadow for button
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "red", // Red color for cancel button
  },
});
