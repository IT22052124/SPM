import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import Modal from "react-native-modal";
import BarcodeScanner from "../components/BarcodeScanner";

const ProductCard = ({ image, name, price }) => (
  <View style={styles.productCard}>
    <Image source={{ uri: image }} style={styles.productImage} />
    <Text style={styles.productName}>{name}</Text>
    <Text style={styles.productPrice}>{price}</Text>
  </View>
);

export default function Dashboard() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Dummy data for products
  const recommendedProducts = [
    {
      image: "https://via.placeholder.com/150",
      name: "Product 1",
      price: "$10",
    },
    {
      image: "https://via.placeholder.com/150",
      name: "Product 2",
      price: "$15",
    },
    {
      image: "https://via.placeholder.com/150",
      name: "Product 3",
      price: "$20",
    },
    {
      image: "https://via.placeholder.com/150",
      name: "Product 1",
      price: "$10",
    },
    {
      image: "https://via.placeholder.com/150",
      name: "Product 2",
      price: "$15",
    },
    {
      image: "https://via.placeholder.com/150",
      name: "Product 3",
      price: "$20",
    },
  ];

  const offerProducts = [
    { image: "https://via.placeholder.com/150", name: "Offer 1", price: "$5" },
    { image: "https://via.placeholder.com/150", name: "Offer 2", price: "$8" },
    { image: "https://via.placeholder.com/150", name: "Offer 3", price: "$12" },
    { image: "https://via.placeholder.com/150", name: "Offer 1", price: "$5" },
    { image: "https://via.placeholder.com/150", name: "Offer 2", price: "$8" },
    { image: "https://via.placeholder.com/150", name: "Offer 3", price: "$12" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {recommendedProducts.map((product, index) => (
            <ProductCard
              key={index}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))}
        </ScrollView>
        <Text style={styles.sectionTitle}>Special Offers</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {offerProducts.map((product, index) => (
            <ProductCard
              key={index}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))}
        </ScrollView>
      </ScrollView>
      <TouchableOpacity style={styles.actionButton} onPress={toggleModal}>
        <Text style={styles.actionButtonText}>Scan</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <BarcodeScanner />
          <Button
            style={styles.modalText}
            title="Close"
            onPress={toggleModal}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: "#ffffff",
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 50,
    position: "absolute",
    bottom: 32,
    left: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  modalText: {
    fontSize: 18,
    bottom: 0,
  },
});
