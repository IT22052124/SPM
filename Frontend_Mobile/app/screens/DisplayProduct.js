import React, { useState, useEffect } from "react";
import { Open_AI_Key } from "@env";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { IPAddress } from "../../globals";
import { StatusBar } from "react-native";
import { useUser } from "../components/UserContext";

const { width } = Dimensions.get("window");

export default DisplayProduct = () => {
  const navigation = useNavigation();
  const [activePage, setActivePage] = useState(0);
  const [product, setProduct] = useState(null); // State for product details
  const [loading, setLoading] = useState(true); // State for loading
  const route = useRoute();
  const { productId } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [SelectedListAndName, setSelectedListAndName] = useState({
    id: "",
    name: "",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [response, setResponse] = useState("");
  const [loadingGPT, setLoadingGPT] = useState(false);
  const { username } = useUser();
  const email = username;
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const getProductDetails = async () => {
      setLoadingGPT(true);
      try {
        if (product) {
          const response = await axios.post(
            "https://api.cohere.ai/generate",
            {
              model: "command-xlarge-nightly",
              prompt: `Generate a detailed description ${product.name} Make sure it's compelling and informative. only give the plain text (less than 75 words)`,
            },
            {
              headers: {
                Authorization: `Bearer ${Open_AI_Key}`,
                "Content-Type": "application/json",
              },
            }
          );
          setResponse(response.data.text);
          setLoadingGPT(false);
        }
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };
    getProductDetails();
  }, [product]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleSpeech = () => {
    if (isPlaying) {
      Speech.stop();
    } else {
      Speech.speak(response, {
        language: "en-US", // Set to US English
        pitch: 1.2, // Adjust pitch for female-sounding voice
        rate: 1.0, // Normal speaking rate
      });
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const url = `http://${IPAddress}:5000/product/products/${productId}`;
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
  }, [productId]);

  useEffect(() => {
    if (email) {
      axios
        .get(
          `http://${IPAddress}:5000/shoppinglist/shopping-lists?email=${email}`
        )
        .then((response) => {
          setLists(response.data);
        })
        .catch((error) => console.error(error));
    }
  }, [email]);

  const stockIndicatorStyle = {
    color: product?.Quantity < 10 ? "red" : "green",
    fontWeight: "bold",
  };

  const handleAddNewItem = () => {
    if (SelectedListAndName.id !== "") {
      const itemDetails = {
        productId: product._id,
        name: product.name,
        category: product.Category,
        quantity: 1,
        price: product.BasePrice,
      };

      axios
        .post(
          `http://${IPAddress}:5000/shoppinglist/shopping-lists/${SelectedListAndName.id}/items`,
          itemDetails
        )
        .then(() => {
          Speech.speak(`${product.name} added to the list`);
          navigation.navigate("ItemScreen", {
            listId: SelectedListAndName.id,
            listName: SelectedListAndName.name,
          });
        })
        .catch((error) => console.error(error));
    } else {
      Alert.alert("Error", "Selected product not found.");
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
    );
  }

  if (!product) {
    return <Text style={styles.error}>Product not found</Text>; // Error handling
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={32} color="blue" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Product Detail</Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.carouselContainer}>
          <PagerView
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
          >
            {product.imageUrl.map((url, index) => (
              <View key={index} style={styles.page}>
                <Image source={{ uri: url }} style={styles.mainImage} />
              </View>
            ))}
          </PagerView>
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.thumbnailContainer} // Apply styles here
        >
          {product.imageUrl.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              style={[
                styles.thumbnail,
                index === activePage && styles.activeThumbnail,
              ]}
            />
          ))}
        </ScrollView>

        <View style={styles.productInfo}>
          <View style={styles.quantityContainer}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.price}>
              LKR {product.BasePrice.toFixed(2)}{" "}
            </Text>
          </View>
          <Text style={stockIndicatorStyle}>
            {product.Quantity < 10 ? "Low Stock" : "In Stock"} (
            {product.Quantity} available)
          </Text>
          <Text style={styles.ratingContainer}>{product.SKU}</Text>
          <Text style={styles.productSubtitle}>{product.Category}</Text>
          <Text style={styles.descriptionTitle}>About the product</Text>
          <Text style={styles.descriptionText}>{product.Description}</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.playPauseButton} onPress={toggleSpeech}>
          {loadingGPT ? (
            <ActivityIndicator size="small" color="black" /> // Show loader if loading
          ) : (
            <Ionicons
              name={isPlaying ? "pause-outline" : "play-outline"}
              size={24}
              color="black"
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToListButton} onPress={toggleModal}>
          <Text style={styles.addToListButtonText}>Add to List</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a List</Text>
            <FlatList
              data={lists}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() =>
                    setSelectedListAndName({
                      id: item._id,
                      name: item.listname,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.listItemText,
                      item._id === SelectedListAndName.id &&
                        styles.selectedListItemText,
                    ]}
                  >
                    {item.listname}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.addToListButton2}
              onPress={() => handleAddNewItem()}
            >
              <Text style={styles.addToListButtonText2}>Add to List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitleContainer: {
    flex: 1, // Allow this container to grow
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  headerTitle: {
    fontSize: 20,
    paddingRight: 40,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
  mainImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  thumbnailContainer: {
    padding: 10,
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center items vertically if needed
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginHorizontal: 8, // Add margin on both sides to prevent clipping
    borderWidth: 2,
    borderColor: "transparent", // Default border color
  },
  activeThumbnail: {
    borderColor: "#007BFF", // Highlight color for active thumbnail
  },
  countdownContainer: {
    backgroundColor: "#ff6b6b",
    padding: 8,
    margin: 16,
    borderRadius: 8,
  },
  countdownText: {
    color: "white",
    textAlign: "center",
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sku: {
    paddingHorizontal: 16,
    color: "#666",
  },
  availability: {
    paddingHorizontal: 16,
    color: "#666",
  },
  activeThumbnail: {
    borderColor: "#007BFF",
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeMore: {
    color: "#4a69bd",
  },
  interestedItem: {
    marginRight: 16,
    width: 120,
  },
  interestedImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  interestedName: {
    marginTop: 4,
  },
  interestedPrice: {
    fontWeight: "bold",
  },
  boughtTogetherItem: {
    marginRight: 16,
  },
  boughtTogetherImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  boughtTogetherPrice: {
    textAlign: "center",
    marginTop: 4,
  },
  boughtTogetherDiscount: {
    marginTop: 8,
    color: "#4a69bd",
  },
  infoStore: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f1f2f6",
  },
  storeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  storeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  storeName: {
    fontWeight: "bold",
  },
  storeFollowers: {
    color: "#666",
  },
  followButton: {
    backgroundColor: "#4a69bd",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: "white",
  },
  viewedItem: {
    marginRight: 16,
  },
  viewedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  viewedPrice: {
    textAlign: "center",
    marginTop: 4,
  },
  payNowButton: {
    backgroundColor: "#4a69bd",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  payNowButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  carouselContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  pagerView: {
    width: "100%",
    height: "100%",
  },
  page: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 16,
  },
  price: {
    marginLeft: "auto",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    color: "red",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  favoriteButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  addToListButtonText2: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addToListButton2: {
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addToListButton: {
    flex: 3,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 5,
  },
  addToListButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  listItemText: {
    fontSize: 16,
  },
  selectedListItemText: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  closeButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 2,
    borderRadius: 5,
    flex: 0, // or just remove it
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  playPauseButton: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginTop: 2,
  },
  backButton: {
    marginLeft: 5,
  },
});
