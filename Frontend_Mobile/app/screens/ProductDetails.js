import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import * as Speech from 'expo-speech';

export default function ProductDetails({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://192.168.1.7:5000/product/products/${productId}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error(error));
  }, [productId]);

  const speakProductDetails = () => {
    if (product) {
      const speechString = `Product Name: ${product.name}. Description: ${product.Description}. Available Quantity: ${product.Quantity}.`;
      Speech.speak(speechString);
    }
  };

  const renderStockWarning = (quantity) => {
    if (quantity < 20) {
      return <Text style={styles.stockWarning}>Low Stock!</Text>;
    }
    return null;
  };

  if (!product) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.imageUrl[0] }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.Description}</Text>
        <Text style={styles.quantity}>Available Quantity: {product.Quantity}</Text>
        {renderStockWarning(product.Quantity)}
        <TouchableOpacity style={styles.speakButton} onPress={speakProductDetails}>
          <Text style={styles.speakButtonText}>Speak Details</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9F9",
    
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  detailsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    paddingTop:5,
    elevation: 2,
    marginBottom: 5,
    alignItems: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  quantity: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000", // Keep quantity color as black
  },
  stockWarning: {
    color: "red",
    fontWeight: "bold",
    marginTop: 5,
  },
  speakButton: {
    backgroundColor: "#28a745",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 7,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  speakButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#007bff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 5,
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
