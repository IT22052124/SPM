import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import * as Speech from "expo-speech";

const flavorOptions = [
  { id: "1", name: "Spicy", image: require("../assets/spicy.jpg") },
  { id: "2", name: "Sweet", image: require("../assets/sweet.webp") },
  { id: "3", name: "Sour", image: require("../assets/Sour.webp") },
  { id: "4", name: "Salty", image: require("../assets/salty.jpg") },
];

const FlavorProfileScreen = ({ navigation }) => {
  const [selectedFlavor, setSelectedFlavor] = useState(null);

  useEffect(() => {
    Speech.speak(
      "Choose your flavor profile. Select one of the options you want. From top left, you have Spicy, Sweet, Sour, and Salty."
    );
  }, []);

  const handleFlavorPress = (flavorName) => {
    setSelectedFlavor(flavorName); // Store the selected flavor
    Speech.speak(flavorName);
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedFlavor === item.name; // Check if this item is selected
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]} // Apply selected style if selected
        onPress={() => handleFlavorPress(item.name)}
      >
        <Image source={item.image} style={styles.image} />
        <Text style={styles.itemText}>{item.name}</Text>

        {/* Show overlay if this flavor is selected */}
        {isSelected && <View style={styles.overlay}></View>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your flavor profile</Text>
      <FlatList
        data={flavorOptions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() =>
          selectedFlavor
            ? navigation.navigate("BudgetScreen", { flavor: selectedFlavor })
            : Speech.speak("Please select a flavor to continue")
        }
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    justifyContent: "space-between",
  },
  item: {
    flex: 1,
    margin: 10,
    alignItems: "center",
    position: "relative",
  },
  selectedItem: {
    borderColor: "#FF9800",
    borderWidth: 4, // Add border to indicate selection
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  itemText: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 165, 0, 0.5)", // Orange translucent overlay
    borderRadius: 10,
  },
  continueButton: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default FlavorProfileScreen;
