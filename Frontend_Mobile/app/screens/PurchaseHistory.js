import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Animated,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome"; // Importing FontAwesome icons
import { IPAddress } from "../../globals";
import * as Speech from "expo-speech"; // Import Expo Speech module

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const user = await AsyncStorage.getItem("user");

        if (user !== null) {
          const { Phone } = JSON.parse(user);
          const response = await axios.get(
            `http://${IPAddress}:5000/loyalty/purchases?phoneNumber=${Phone}`
          );
          setPurchases(response.data);
        }
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePurchaseSelect = (purchase) => {
    Speech.stop(); // Stop speech when a new purchase is selected
    setSelectedPurchase(purchase);
    setModalVisible(true);
  };

  const closeModal = () => {
    Speech.stop(); // Stop speech when the modal is closed
    setModalVisible(false);
    setSelectedPurchase(null);
  };

  // Function to read out purchase details using Expo Speech
  const longPressInvoiceHandler = (purchase) => {
    Speech.stop(); // Stop any ongoing speech before starting a new one
    const details = `
      Invoice ID: ${purchase.invoiceId}.
      Total: ${purchase.finalTotal} rupees.
      Paid Amount: ${purchase.paidAmount} rupees.
      Balance: ${purchase.balance} rupees.
      Date: ${new Date(purchase.createdAt).toLocaleDateString()}.
    `;
    Speech.speak(details);
  };

  // Function to read out item details inside the modal
  const longPressItemHandler = (item, index) => {
    Speech.stop(); // Stop any ongoing speech before starting a new one
    const productDetails = `
      Product ${index + 1}: ${
      item.pId && item.pId.name ? item.pId.name : "N/A"
    }.
      Quantity: ${item.quantity} ${item.unit}.
      Price: ${item.price.toFixed(2)} rupees.
      Total: ${item.total.toFixed(2)} rupees.
      ${
        item.promoName
          ? `Promo Name: ${item.promoName}.
        Discounted Total: ${item.DiscountedTotal}.`
          : ""
      }
    `;
    Speech.speak(productDetails);
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#1e90ff" style={styles.loader} />
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <FlatList
        data={purchases}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePurchaseSelect(item)}
            onLongPress={() => longPressInvoiceHandler(item)} // Long press handler for invoices
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Icon
                name="file-text"
                size={20}
                color="#1e90ff"
                style={styles.icon}
              />
              <View>
                <Text style={styles.invoiceId}>
                  Invoice ID: {item.invoiceId}
                </Text>
                <Text style={styles.total}>
                  Total: RS.{item.finalTotal.toFixed(2)}
                </Text>
                <Text style={styles.total}>
                  Date: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {selectedPurchase && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Invoice ID: {selectedPurchase.invoiceId}
              </Text>
              <Text>Customer: {selectedPurchase.LoyaltyName}</Text>
              <Text>Total: RS.{selectedPurchase.finalTotal.toFixed(2)}</Text>
              <Text>
                Paid Amount: RS.{selectedPurchase.paidAmount.toFixed(2)}
              </Text>
              <Text>Balance: RS.{selectedPurchase.balance.toFixed(2)}</Text>
              <Text>
                Date:{" "}
                {new Date(selectedPurchase.createdAt).toLocaleDateString()}
              </Text>

              <Text style={styles.modalSubtitle}>Items:</Text>
              <FlatList
                data={selectedPurchase.CartItems}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onLongPress={() => longPressItemHandler(item, index)} // Long press handler for items
                    style={styles.itemContainer}
                  >
                    <View style={styles.itemHeader}>
                      <Icon
                        name="shopping-cart"
                        size={20}
                        color="#1e90ff"
                        style={styles.icon}
                      />
                      <Text style={styles.itemTitle}>
                        Product {index + 1}:{" "}
                        {item.pId && item.pId.name ? item.pId.name : "N/A"}
                      </Text>
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemDetail}>
                        Quantity: {item.quantity} {item.unit}
                      </Text>
                      <Text style={styles.itemDetail}>
                        Price: RS.{item.price.toFixed(2)}
                      </Text>
                      <Text style={styles.itemDetail}>
                        Total: RS.{item.total.toFixed(2)}
                      </Text>
                      {item.promoName && (
                        <>
                          <Text style={styles.itemDetail}>
                            Promo: {item.promoName}
                          </Text>
                          <Text style={styles.itemDetail}>
                            Discounted Total: RS
                            {item.DiscountedTotal.toFixed(2)}
                          </Text>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  invoiceId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e90ff",
    marginBottom: 5,
    left: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e90ff",
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  itemContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  itemDetails: {
    marginTop: 5,
  },
  itemDetail: {
    fontSize: 16,
    color: "#666",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  icon: {
    marginRight: 10,
  },
});

export default PurchaseHistory;
