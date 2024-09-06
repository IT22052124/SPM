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

const budgetOptions = [
  { id: "1", name: "Expensive", image: require("../assets/expensive.jpg") },
  { id: "2", name: "Cheap", image: require("../assets/cheap.jpg") },
];

const BudgetScreen = ({ route, navigation }) => {
  const { flavor } = route.params;
  const [selectedBudget, setSelectedBudget] = useState(null);

  useEffect(() => {
    Speech.speak(
      `You selected ${flavor}. Now choose your budget. Is it expensive or cheap?`
    );
  }, [flavor]);

  const handleBudgetPress = (budgetName) => {
    setSelectedBudget(budgetName);
    Speech.speak(budgetName);
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedBudget === item.name; // Check if this budget is selected
    const imageSize = isSelected ? styles.selectedImage : styles.image; // Set dynamic image size
    const textSize = isSelected ? styles.selectedItemText : styles.itemText; // Set dynamic text size
    
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}  // Apply selected style if selected
        onPress={() => handleBudgetPress(item.name)}
      >
        <Image source={item.image} style={imageSize} />
        <Text style={textSize}>{item.name}</Text>

        {/* Show overlay if this budget is selected */}
        {isSelected && <View style={styles.overlay}></View>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's your budget?</Text>
      <FlatList
        data={budgetOptions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() =>
          selectedBudget
            ? navigation.navigate("NextPage", { flavor, budget: selectedBudget })
            : Speech.speak("Please select a budget to continue")
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
    textAlign: "center",
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
    borderWidth: 4,  // Add border to indicate selection
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  selectedImage: {
    width: 180,  // Increased width when selected
    height: 180, // Increased height when selected
    borderRadius: 10,
  },
  itemText: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  selectedItemText: {
    marginTop: 10,
    fontSize: 28,  // Increased font size when selected
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 165, 0, 0.5)",  // Orange translucent overlay
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

export default BudgetScreen;
