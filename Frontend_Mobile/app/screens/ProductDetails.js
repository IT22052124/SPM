import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from "axios";
import * as Speech from 'expo-speech';

export default function ProductDetails({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://172.20.10.3:5000/product/products/${productId}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error(error));
  }, [productId]);

  const speakProductDetails = () => {
    if (product) {
      const speechString = `Product Name: ${product.name}. Price: ${product.BasePrice} rupees. Description: ${product.Description}. Available Quantity: ${product.quantity}.`;
      Speech.speak(speechString);
    }
  };

  const stockIndicatorStyle = {
    color: product?.quantity < 10 ? 'red' : 'green',
    fontWeight: 'bold'
  };

  if (!product) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: product.imageUrl[0] }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Ionicons 
                key={index}
                name={index < product.rating ? "star" : "star-outline"} 
                size={16} 
                color="#FFD700" 
              />
            ))}
          </View>
          <Text style={styles.price}>$ {product.BasePrice}</Text>
          <Text style={styles.stockText} style={stockIndicatorStyle}>
            {product.quantity < 10 ? 'Low Stock' : 'In Stock'} ({product.Quantity} available)
          </Text>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.Description}</Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.speakButton} onPress={speakProductDetails}>
          <AntDesign name="sound" size={20} color="white" />
          <Text style={styles.speakButtonText}> Speak Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  stockText: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop:14,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  fixedButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  backButton: {
    backgroundColor: "#007bff",
    flexDirection: 'row',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    width: '39%',
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
  speakButton: {
    backgroundColor: "#4CAF50",
    flexDirection: 'row',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    width: '60%',
  },
  speakButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
});
