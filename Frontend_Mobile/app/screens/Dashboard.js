import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Searchbar, Card, Title, Paragraph } from "react-native-paper";
import BarcodeScanner from "../components/BarcodeScanner";
import { useNavigation } from "@react-navigation/native";
import { IPAddress } from "../../globals";
import axios from "axios";

export default function SupermarketDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      const url = `http://${IPAddress}:5000/product/products`;
      try {
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        Alert.alert(
          "Error",
          "There was a problem retrieving the product. Please try again."
        );
      }
    };
    fetchProductData();
  });

  useEffect(() => {
    // Fetch product data
    axios
      .get(`http://${IPAddress}:5000/promotion/promotions`) // Replace with your local IP address
      .then((response) => {
        setPromotions(response.data);
      })
      .catch((error) => console.error(error));
  }, [promotions]);

  const categories = [
    "Fruits",
    "Vegetable",
    "Dairy",
    "Meat",
    "Beverage",
    "Snacks",
    "Pantry Staples",
    "Household Goods",
    "All Products",
  ];

  const recentPurchases = ["Bananas", "Bread", "Eggs", "Tomatoes", "Cereal"];

  const filteredResults = products.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDealItem = ({ item }) => (
    <Card
      style={styles.dealCard}
      onPress={() =>
        navigation.navigate("ProductDetails", { productId: item.productID._id })
      }
    >
      <Card.Cover source={{ uri: item.imageUrl[0] }} />
      <Card.Content>
        <Title>{item.promotionName}</Title>
      </Card.Content>
    </Card>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryButton}
      onPress={() =>
        navigation.navigate("SearchResults", { categoryName: item })
      }
    >
      <Text style={styles.categoryButtonText}>{item}</Text>
    </TouchableOpacity>
  );

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const renderRecentPurchases = () => (
    <Card>
      <Card.Content>
        {recentPurchases.map((item, index) => (
          <Text key={index} style={styles.recentPurchaseItem}>
            • {item}
          </Text>
        ))}
      </Card.Content>
    </Card>
  );

  // Combine all sections into one data array
  const sections = [
    {
      title: "Promotions",
      data: promotions,
      renderItem: renderDealItem,
      key: "promotions",
    },
    {
      title: "Categories",
      data: categories,
      renderItem: renderCategoryItem,
      key: "categories",
    },
    {
      title: "Recent Purchases",
      data: recentPurchases,
      renderItem: renderRecentPurchases,
      key: "purchases",
    },
  ];

  const renderSection = ({ item }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{item.title}</Text>
      {item.key === "purchases" ? (
        item.renderItem()
      ) : (
        <FlatList
          data={item.data}
          renderItem={item.renderItem}
          keyExtractor={(item, index) =>
            item.id ? item._id.toString() : index.toString()
          }
          horizontal={item.key === "promotions"}
          showsHorizontalScrollIndicator={item.key === "promotions"}
          numColumns={item.key === "categories" ? 2 : 1}
        />
      )}
    </View>
  );

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => HandleClick(item._id)}
    >
      <Text style={styles.suggestionText}>
        {item.name} - {item.Category}
      </Text>
    </TouchableOpacity>
  );

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Image source={require("../assets/Logo.png")} style={styles.LogoIcon} />
        <Text style={styles.headerTitle}>ShopX</Text>
      </View>

      <Searchbar
        placeholder="Search products..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      {/* Display Search Suggestions */}
      {searchQuery && filteredResults.length > 0 ? (
        <FlatList
          data={filteredResults}
          renderItem={renderSuggestionItem}
          keyExtractor={(item) => item._id || item.name}
          style={styles.suggestionsList}
        />
      ) : null}

      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.key}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.floatingScannerButton}
        onPress={toggleModal}
      >
        <Image
          source={require("../assets/barcode-scanning-icon.png")}
          style={styles.scannerIcon}
        />
      </TouchableOpacity>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <BarcodeScanner />
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeButtonText} onPress={toggleModal}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  searchBar: {
    margin: 16,
    backgroundColor: "#fff",
  },
  suggestionsList: {
    position: "absolute",
    top: 190, // Adjust based on the height of the search bar
    left: 16,
    right: 16,
    maxHeight: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4, // Shadow for Android
    zIndex: 10, // Ensures it overlays other elements
    borderWidth: 1,
    borderColor: "#ddd",
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 8,
  },
  dealCard: {
    width: 160,
    marginHorizontal: 8,
  },
  discountText: {
    color: "green",
  },
  categoryButton: {
    flex: 1,
    margin: 5,
    padding: 16,
    backgroundColor: "#383B53",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  recentPurchaseItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  floatingScannerButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 50,
    position: "absolute",
    bottom: 32,
    right: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  scannerIcon: {
    width: 45,
    height: 45,
    tintColor: "#fff",
  },
  LogoIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 8,
  },
  modalContent: {
    backgroundColor: "#fff",
    height: "80%",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  closeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    position: "absolute",
    bottom: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
