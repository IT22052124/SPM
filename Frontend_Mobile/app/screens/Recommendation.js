import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  PanResponder,
  FlatList,
  Button,
  TextInput,
} from "react-native";
import * as Speech from "expo-speech";
import axios from "axios";

export default function RecommendedProductsScreen({ route, navigation }) {
  const { flavor, budget } = route.params; // Get selected flavor and budget
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [quantity, setQuantity] = useState("1"); // Default to 1

  // Create a pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          showNextProduct(); // Swipe right to show next product
        } else if (gestureState.dx < -50) {
          showPrevProduct(); // Swipe left to show previous product
        }
      },
    })
  ).current;

  useEffect(() => {
    // Fetch recommended products based on flavor and budget
    axios
      .get(`http://192.168.42.110:5000/product/recommendation`, {
        params: { flavor, budget },
      })
      .then((response) => {
        setProducts(response.data);
        setCurrentIndex(0); // Reset index when new products are fetched
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [flavor, budget]);

  const showNextProduct = () => {
    setProducts((prevProducts) => {
      if (currentIndex < prevProducts.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        Speech.speak("No more products available");
      }
      return prevProducts;
    });
  };

  const showPrevProduct = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex > 0) {
        const newIndex = prevIndex - 1;
        Speech.speak("Showing previous product");
        return newIndex;
      } else {
        Speech.speak("No previous products available");
        return prevIndex;
      }
    });
  };

  const handleProductTap = () => {
    const currentProduct = products[currentIndex];
    if (currentProduct) {
      Speech.speak(
        `Product Name: ${currentProduct.name}. Description: ${currentProduct.Description}. Price: ${currentProduct.BasePrice}`
      );
    }
  };

  const handleDoubleTap = () => {
    const currentProduct = products[currentIndex];
    if (currentProduct) {
      fetchShoppingLists(); // Fetch shopping lists on double-tap
      // No need to show the quantity modal yet
    }
  };

  const fetchShoppingLists = () => {
    axios
      .get("http://192.168.42.110:5000/shoppinglist/shopping-lists")
      .then((response) => {
        setShoppingLists(response.data); // Set fetched lists
        setModalVisible(true); // Open the modal when lists are fetched
      })
      .catch((error) => console.error("Error fetching shopping lists:", error));
  };

  const handleSingleTap = (tapTime) => {
    const now = new Date().getTime();
    if (tapTime && now - tapTime < 300) {
      handleDoubleTap();
    } else {
      handleProductTap();
    }
    return now;
  };

  const addToList = (listId) => {
    if (!listId) {
      Alert.alert("Error", "Please select a valid shopping list.");
      return;
    }

    const currentProduct = products[currentIndex];
    if (currentProduct) {
      axios
        .post(
          `http://192.168.42.110:5000/shoppinglist/shopping-lists/${listId}/items`,
          {
            productId: currentProduct._id,
            name: currentProduct.name,
            category: currentProduct.category || "Uncategorized",
            quantity: quantity, // Use quantity from the state
            price: currentProduct.BasePrice,
          }
        )
        .then(() => {
          Alert.alert(
            "Success",
            `${currentProduct.name} added to ${
              shoppingLists.find((list) => list._id === listId).listname
            }`
          );
          Speech.speak(`${currentProduct.name} added to the list`);
          setModalVisible(false); // Close the modal after adding
          navigation.navigate("ShoppingList"); // Redirect to shopping list screen
        })
        .catch((error) => {
          console.error("Error adding product to list:", error);
          Alert.alert("Error", "Failed to add product to the shopping list.");
        });
    }
  };

  let lastTap = useRef(0);

  const currentProduct = products[currentIndex];

  if (products.length === 0 || currentIndex >= products.length) {
    // Don't render anything if no products or index is out of range
    return null;
  }

  const selectShoppingList = (listId) => {
    setSelectedListId(listId); // Store the selected list ID
    setModalVisible(false); // Close the shopping list modal
    setQuantityModalVisible(true); // Show the quantity modal
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <TouchableOpacity
        onPress={() => {
          lastTap.current = handleSingleTap(lastTap.current);
        }}
      >
        {currentProduct.imageUrl && currentProduct.imageUrl.length > 0 ? (
          <Image
            source={{ uri: currentProduct.imageUrl[0] }}
            style={styles.productImage}
          />
        ) : null}
        <Text style={styles.productName}>{currentProduct.name}</Text>
      </TouchableOpacity>

      {/* Modal to select a shopping list */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Select a Shopping List</Text>
          <FlatList
            data={shoppingLists}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => selectShoppingList(item._id)} // Call selectShoppingList on press
              >
                <Text style={styles.listItem}>{item.listname}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Modal to input quantity */}
      <Modal visible={quantityModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Enter Quantity for {currentProduct.name}</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="Enter quantity"
          />
          <Button
            title="Add to List"
            onPress={() => addToList(selectedListId)}
          />
          <Button
            title="Cancel"
            onPress={() => setQuantityModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listItem: {
    fontSize: 24, // Increased font size for better visibility
    padding: 20, // Increased padding for larger touch targets
    marginVertical: 10, // Increased margin for spacing between items
    backgroundColor: "#d3d3d3", // Slightly darker background for contrast
    width: "100%",
    textAlign: "center",
    borderRadius: 10, // Added rounded corners for aesthetic
    fontWeight: "bold", // Made text bold for emphasis
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 18,
    width: "80%",
    marginVertical: 20,
  },
});
