import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from "axios";
import * as Speech from 'expo-speech';
import { IPAddress } from "../../globals";
export default function ProductDetails({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://${IPAddress}:5000/product/products/${productId}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error(error));
  }, [productId]);

  const speakProductDetails = () => {
    if (product) {
      const speechString = `Product Name: ${product.name}. Price: ${product.BasePrice} rupees. Available Quantity: ${product.Quantity}. Description: ${product.Description}.`;
      Speech.speak(speechString);
    }
  };

  const stockIndicatorStyle = {
    color: product?.Quantity < 10 ? 'red' : 'green',
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
          <Text style={styles.price}>$ {product.BasePrice} per {product.Unit} </Text>
          <Text  style={stockIndicatorStyle}>
            {product.Quantity < 10 ? 'Low Stock' : 'In Stock'} ({product.Quantity} available)
          </Text>
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.Description}</Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.speakButton} onPress={speakProductDetails}>
          <AntDesign name="sound" size={26} color="white" />
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
    alignItems:"center"
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    color:"red"
  },
  stockText: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop:18,
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
    marginLeft:5,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: "center",
    width: '20%',
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
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 60,
    alignItems: "center",
    width: '75%',
  },
  speakButtonText: {
    color: "white",
    fontSize: 15,
    marginLeft: 8,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginTop:10,
    marginBottom:-10,
    
  },
});
