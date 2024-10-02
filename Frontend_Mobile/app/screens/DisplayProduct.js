import React, { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { IPAddress } from "../../globals";
import { StatusBar } from "react-native";

const { width } = Dimensions.get("window");

const DisplayProduct = () => {
  const [activePage, setActivePage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listData, setListData] = useState([]); // State for lists data
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [selectedListId, setSelectedListId] = useState(null); // Selected list ID state

  const route = useRoute();
  const { productId } = route.params;

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    if (!modalVisible) {
      fetchListData(); // Fetch list data when opening modal
    }
  };

  const fetchListData = async () => {
    try {
      const url = `http://${IPAddress}:5000/list/lists`;
      const response = await axios.get(url);
      setListData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addToList = async () => {
    if (selectedListId) {
      try {
        const url = `http://${IPAddress}:5000/list/add`;
        await axios.post(url, { listId: selectedListId, productId });
        toggleModal(); // Close the modal after adding
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchProductData = async () => {
    try {
      const url = `http://${IPAddress}:5000/product/products/${productId}`;
      const response = await axios.get(url);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
    );
  }

  if (!product) {
    return <Text style={styles.error}>Product not found</Text>;
  }

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => setSelectedListId(item.id)}
    >
      <Text
        style={[
          styles.listItemText,
          selectedListId === item.id && styles.selectedListItemText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Detail</Text>
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

        <ScrollView horizontal contentContainerStyle={styles.thumbnailContainer}>
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
            <Text style={styles.price}>LKR {product.BasePrice.toFixed(2)}</Text>
          </View>
          <Text style={styles.productSubtitle}>{product.Category}</Text>
          <Text style={styles.ratingContainer}>{product.SKU}</Text>
          <Text style={styles.descriptionTitle}>About the product</Text>
          <Text style={styles.descriptionText}>{product.Description}</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton} onPress={toggleModal}>
          <Text style={styles.addToCartButtonText}>Add to List</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for List Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a List</Text>
            {listData.length > 0 ? (
              <FlatList
                data={listData}
                renderItem={renderListItem}
                keyExtractor={(item) => item.id.toString()}
              />
            ) : (
              <Text>No lists available</Text>
            )}
            <TouchableOpacity style={styles.addToListButton} onPress={addToList}>
              <Text style={styles.addToListButtonText}>Add to Selected List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Close</Text>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeThumbnail: {
    borderColor: "#007BFF",
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: "auto",
  },
  productSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 16,
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
    borderTopColor: "#eee",
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartButtonText: {
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
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listItem: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 8,
    width: "100%",
  },
  listItemText: {
    fontSize: 16,
  },
  selectedListItemText: {
    color: "#007BFF",
  },
  addToListButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
    width: "100%",
  },
  addToListButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 16,
  },
  closeButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
});

export default DisplayProduct;
