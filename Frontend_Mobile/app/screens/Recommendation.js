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
import { IPAddress } from "../../globals";
import { useUser } from "../components/UserContext";
import { AntDesign } from "@expo/vector-icons";
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
  const [quantity, setQuantity] = useState("1");
  const { username } = useUser(); // Default to 1
  const email = username;
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
      .get(`http://${IPAddress}:5000/product/recommendation`, {
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
      Speech.stop();
      Speech.speak(
        `Product Name: ${currentProduct.name}. Description: ${currentProduct.Description}. Price: ${currentProduct.BasePrice}`
      );
    }
  };

  const handleDoubleTap = () => {
    const currentProduct = products[currentIndex];
    if (currentProduct) {
      Speech.stop();
      fetchShoppingLists(); // Fetch shopping lists on double-tap
      // No need to show the quantity modal yet
    }
  };

  const fetchShoppingLists = () => {
    axios
      .get(
        `http://${IPAddress}:5000/shoppinglist/shopping-lists?email=${email}`
      )
      .then((response) => {
        setShoppingLists(response.data);
        console.log(response.data, email); // Set fetched lists
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

  const confirmQuantity = () => {
    Speech.stop();
    addToList(selectedListId);
  };

  const addToList = (listId) => {
    const currentProduct = products[currentIndex];
    if (!listId || !currentProduct) {
      Alert.alert("Error", "Invalid list or product.");
      return;
    }

    if (currentProduct) {
      axios
        .post(
          `http://${IPAddress}:5000/shoppinglist/shopping-lists/${listId}/items`,
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

  // Function to handle increasing quantity
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    Speech.speak(`Quantity increased to ${quantity + 1}`);
  };

  // Function to handle decreasing quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      Speech.speak(`Quantity decreased to ${quantity - 1}`);
    }
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
      {/* Modal for selecting quantity */}
      <Modal visible={quantityModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Adjust Quantity for {products[currentIndex]?.name}
          </Text>
          <Text style={styles.quantityText}>{quantity}</Text>

          {/* Icons for adjusting quantity */}
          <View style={styles.quantityControls}>
            <TouchableOpacity onPress={increaseQuantity}>
              <AntDesign name="up" size={50} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={decreaseQuantity}>
              <AntDesign name="down" size={50} color="red" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              const now = Date.now();
              if (now - lastTap.current < 300) {
                confirmQuantity();
              }
              lastTap.current = now;
            }}
          >
            <Text style={styles.confirmText}>Double-tap to confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setQuantityModalVisible(false); // Close the modal
              navigation.navigate("ShoppingList"); // Navigate back to the shopping list
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
    fontSize: 20,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#ff4d4d", // Red background for visibility
    padding: 15, // Padding for larger touch target
    marginVertical: 20, // Space around the button
    borderRadius: 10, // Rounded corners
    alignItems: "center", // Center text horizontally
    width: "100%", // Make it full width
  },
  cancelButtonText: {
    color: "#fff", // White text color for contrast
    fontSize: 18, // Font size for readability
    fontWeight: "bold", // Bold text for emphasis
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // Add padding for better spacing
    backgroundColor: "#fff", // Ensure background is white for contrast
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 18, // Adjusted font size for better readability
    padding: 15, // Larger padding for more space around each item
    marginVertical: 8, // Spacing between list items
    backgroundColor: "#f0f0f0", // Light background for each list item
    width: "100%", // Ensure the list item takes full width
    textAlign: "center", // Center the text
    borderRadius: 8, // Rounded corners for better aesthetics
  },
  quantityText: {
    fontSize: 40, // Enlarged quantity display
    marginVertical: 20,
  },
  quantityControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginTop: 20,
  },
  confirmText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
});
