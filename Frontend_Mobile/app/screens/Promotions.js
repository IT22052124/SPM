import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import * as Speech from "expo-speech";
import axios from "axios";
import { IPAddress } from "../../globals";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Get YYYY-MM-DD format
};

const PromotionScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [imageIndex, setImageIndex] = useState({}); // Track image index for each promotion

  useEffect(() => {
    // Fetch product data
    axios
      .get(`http://${IPAddress}:5000/promotion/promotions`) // Replace with your local IP address
      .then((response) => {
        setPromotions(response.data);

        // Initialize image index for each promotion
        const initialImageIndex = {};
        response.data.forEach((promotion) => {
          initialImageIndex[promotion._id] = 0; // Start with first image
        });
        setImageIndex(initialImageIndex);
      })
      .catch((error) => console.error(error));
  }, [promotions]);

  useEffect(() => {
    // Set an interval to change the image every 3 seconds
    const intervalId = setInterval(() => {
      setImageIndex((prevIndex) => {
        const newIndex = { ...prevIndex };
        promotions.forEach((promotion) => {
          const imagesLength = promotion.imageUrl.length;
          newIndex[promotion._id] =
            (prevIndex[promotion._id] + 1) % imagesLength; // Cycle through images
        });
        return newIndex;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [promotions]);

  const handlePress = (promotion) => {
    setSelectedPromotion(promotion);
    setModalVisible(true);
  };

  const handleLongPress = (promotion) => {
    const minPurchaseText = promotion.minPurchase
      ? `The minimum purchase required is ${promotion.minPurchase}.`
      : "No minimum purchase required.";

    const sentence = `${promotion.description}. Eligible for ${promotion.eligibility}. Discount percentage is ${promotion.discPercentage}%. ${minPurchaseText}`;
    Speech.speak(sentence);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.promotionCard}
      onPress={() => handlePress(item)}
      onLongPress={() => handleLongPress(item)}
    >
      {item.imageUrl && item.imageUrl.length > 0 ? (
        <Image
          source={{ uri: item.imageUrl[imageIndex[item._id]] }} // Display the current image
          style={styles.image}
        />
      ) : (
        <Text style={styles.imageFallback}>{item.promotionName}</Text> // Show promotion name if image is unavailable
      )}
      <Text style={styles.title}>{item.promotionName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={promotions}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
      />

      {/* Modal to display promotion details */}
      {selectedPromotion && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)} // Close modal when clicking outside
            activeOpacity={1} // Prevent interaction with the background
          >
            <TouchableOpacity
              style={styles.modalContainer}
              activeOpacity={1} // Prevent interaction with the modal content
            >
              <Text style={styles.modalTitle}>
                {selectedPromotion.promotionName}
              </Text>
              <Text style={styles.modalDetails}>
                {selectedPromotion.description}
              </Text>
              <Text style={styles.modalDetails}>
                Eligibility: {selectedPromotion.eligibility}
              </Text>
              <Text style={[styles.modalDetails, { color: "blue" }]}>
                Discount Percentage: {selectedPromotion.discPercentage} %
              </Text>
              <Text style={[styles.modalDetails, { color: "blue" }]}>
                Min Purchase:{" "}
                {selectedPromotion.minPurchase
                  ? `${selectedPromotion.minPurchase}.00`
                  : "N/A"}
              </Text>
              <Text style={styles.modalDetails}>
                {formatDate(selectedPromotion.startDate)} to{" "}
                {formatDate(selectedPromotion.endDate)}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  promotionCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 20,
    margin: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 16,
    marginBottom: 4,
  },
  closeButton: {
    color: "red",
    fontSize: 16,
    marginTop: 13,
  },
  imageFallback: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#e0e0e0", // You can style this as you wish
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    lineHeight: 100, // Vertically center the text
    fontWeight: "bold",
    color: "#000", // Set the text color
  },
});

export default PromotionScreen;
