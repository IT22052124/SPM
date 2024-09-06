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
import MultiSelectComponent from "../components/dropdown";
import DropdownComponent from "../components/dropdown";

export default function ListItems({ route }) {
  const { listId, listName } = route.params;
  const [items, setItems] = useState([]);
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch existing items for the list
    axios
      .get(`http://localhost:5000/shoppinglist/shopping-lists/${listId}`)
      .then((response) => setItems(response.data.products))
      .catch((error) => console.error(error));
  }, [listId]);

  useEffect(() => {
    // Fetch existing items for the list
    axios
      .get(`http://localhost:5000/product/products`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, [listId]);

  const handleAddNewItem = () => {
    if (newItem.name && newItem.quantity.trim()) {
      // Fetch the selected product details
      const selectedProduct = data.find(
        (product) => product.name === newItem.name
      );
      console.log(selectedProduct);
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
            `http://localhost:5000/shoppinglist/shopping-lists/${listId}/items`,
            itemDetails
          )
          .then((response) => {
            setItems(response.data.products);
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
    console.log(`Deleting item with ID: ${id} from list: ${listId}`);
    axios
      .delete(`http://localhost:5000/shoppinglist/shopping-lists/${listId}/items/${id}`)
      .then((response) => {
        setItems(items.filter((item) => item._id !== id));
        Speech.speak("Item deleted");
      })
      .catch((error) => {
        console.error('Error deleting item:', error.response ? error.response.data : error.message);
      });
  };
  
  

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Select Items</Text>

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
          <View style={styles.buttonContainer}>
            <Button title="Add Item" onPress={handleAddNewItem} />
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="red"
            />
          </View>
          <View style={styles.modalContainer}>
            <DropdownComponent data={data} setNewItem={setNewItem} newItem={newItem}/>
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={newItem.quantity}
              onChangeText={(text) =>
                setNewItem({ ...newItem, quantity: text })
              }
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
    height: 300,
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
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    width: "100%",
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
