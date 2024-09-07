import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, PanResponder } from "react-native";
import * as Speech from "expo-speech";
import axios from "axios";

export default function RecommendedProductsScreen({ route }) {
  const { flavor, budget } = route.params; // Get selected flavor and budget
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          showNextProduct(); // Swipe right to show next product
        }
      },
    })
  ).current;

  useEffect(() => {
    // Fetch recommended products based on flavor and budget
    axios
      .get(`http://localhost:5000/products/recommendations`, {
        params: { tags: [flavor, budget] },
      })
      .then((response) => setProducts(response.data))
      .catch((error) => console.error(error));
  }, [flavor, budget]);

  const showNextProduct = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Speech.speak("No more products available");
    }
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
      axios
        .post("http://localhost:5000/shoppinglist/add-to-list", { productId: currentProduct.ID })
        .then(() => {
          Alert.alert("Success", `${currentProduct.name} added to your shopping list`);
          Speech.speak(`${currentProduct.name} added to shopping list`);
        })
        .catch((error) => console.error(error));
    }
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

  let lastTap = useRef(0);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {products.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            lastTap.current = handleSingleTap(lastTap.current);
          }}
        >
          <Image source={{ uri: products[currentIndex].imageUrl }} style={styles.productImage} />
          <Text style={styles.productName}>{products[currentIndex].name}</Text>
        </TouchableOpacity>
      )}
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
});
