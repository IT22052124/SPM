import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { IPAddress } from "../../globals";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function SearchResults() {
  const navigation = useNavigation();
  const route = useRoute(); // Get the route object
  const { categoryName } = route.params; // Get the categoryName from parameters
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        let url;
        if (categoryName === "All Products") {
          url = `http://${IPAddress}:5000/product/products`;
        } else {
          url = `http://${IPAddress}:5000/product/products/category/${categoryName}`;
        }
        const response = await axios.get(url);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to load product data"); // Set error state
        setLoading(false); // Set loading to false on error
      }
    };

    fetchProductData();
  }, [categoryName]);

  const HandleClick = async (id) => {
    const url = `http://${IPAddress}:5000/product/products/${id}`;

    try {
      const response = await axios.get(url);

      if (response.data && response.data._id) {
        navigation.navigate("DisplayProduct", {
          productId: response.data._id,
        });
      } else {
        Alert.alert("No product found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      Alert.alert(
        "Error",
        "There was a problem retrieving the product. Please try again."
      );
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity onPress={() => HandleClick(item._id)}>
      <View style={styles.productBox}>
        <Image source={{ uri: item.imageUrl[0] }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productSku}>SKU: {item.SKU}</Text>
          <Text style={styles.productPrice}>
            LKR {item.BasePrice.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.categoryNameContainer}>
          <Text style={styles.categoryName}>{categoryName}</Text>
        </View>
      </View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.productList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    backgroundColor: "#5A464C",
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Add space between elements
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginLeft: 16,
  },
  categoryNameContainer: {
    flex: 1, // Allow this container to grow
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  categoryName: {
    fontSize: 20,
    paddingRight: 40,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  productList: {
    padding: 16,
  },
  productBox: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productSku: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a90e2",
  },
});
