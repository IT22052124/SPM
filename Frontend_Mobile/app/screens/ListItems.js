import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Speech from "expo-speech";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const DropdownComponent = ({ data, newItem, setNewItem }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const formattedItems = data.map((item) => ({
      label: item.name,
      value: item.name,
    }));
    setItems(formattedItems);
  }, [data]);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.dropdownButtonText}>
          {value || "Select an item"}
        </Text>
        <MaterialIcons
          name={open ? "arrow-drop-up" : "arrow-drop-down"}
          size={24}
          color="#007bff"
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownList}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            placeholderTextColor="grey"
            onChangeText={(text) => {
              const filtered = data.filter((item) =>
                item.name.toLowerCase().includes(text.toLowerCase())
              );
              setItems(
                filtered.map((item) => ({
                  label: item.name,
                  value: item.name,
                }))
              );
            }}
          />
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setValue(item.value);
                  setNewItem({ ...newItem, name: item.value });
                  setOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const ListItems = ({ route }) => {
  const { listId, listName } = route.params;
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchProducts();
  }, [listId]);

  const fetchItems = () => {
    axios
      .get(`http://192.168.1.3:5000/shoppinglist/shopping-lists/${listId}`)
      .then((response) => setItems(response.data.products))
      .catch((error) => console.error(error));
  };

  const fetchProducts = () => {
    axios
      .get(`http://192.168.1.3:5000/product/products`)
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
  };

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
            `http://192.168.1.3:5000/shoppinglist/shopping-lists/${listId}/items`,
            itemDetails
          )
          .then(() => {
            setNewItem({ name: "", quantity: "" });
            setModalVisible(false);
            Speech.speak(`${newItem.name}, ${newItem.quantity} added`);
            fetchItems();
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
        `http://192.168.1.3:5000/shoppinglist/shopping-lists/${listId}/items/${id}`
      )
      .then(() => {
        fetchItems();
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
      onLongPress={() => Speech.speak(item.quantity + item.name)}
      onPress={() =>
        navigation.navigate("ProductDetails", { productId: item.product._id })
      }
      style={styles.card}
    >
      <Image source={{ uri: item.product.imageUrl[0] }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.price}>1({item.product.Unit}): {item.product.BasePrice}/-</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteItem(item._id)}
        style={styles.deleteButton}
      >
        <MaterialIcons name="delete-outline" size={24} color="#fff" />
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
          setModalVisible(true);
          Speech.speak("Add new Item");
        }}
      >
        <Text style={styles.addButtonText}>Add New Item</Text>
        <MaterialIcons name="add-shopping-cart" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Item</Text>
            <DropdownComponent
             placeholderTextColor="#888"
              data={data}
              setNewItem={setNewItem}
              newItem={newItem}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="phone-pad"
              placeholderTextColor="#2c3e50" // This ensures the placeholder is visible
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
                  setModalVisible(false);
                  Speech.speak("canceled");
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 30,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: "green",
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    color: "red",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 20,
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  modalBackground: {
    flex: 1,
    
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    
    width: width - 40,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 16,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007bff",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007bff",
    maxHeight: 200,
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height:40,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    color: "black",
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "red",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ListItems;
