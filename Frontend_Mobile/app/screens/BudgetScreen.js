import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import * as Speech from "expo-speech";

const budgetOptions = [
  { id: "1", name: "Expensive", image: require("../assets/expensive.jpg") },
  { id: "2", name: "Cheap", image: require("../assets/cheap.jpg") },
];

const BudgetScreen = ({ route, navigation }) => {
  const { flavor } = route.params; // Get the selected flavor from the previous screen
  const [selectedBudget, setSelectedBudget] = useState(null);

  useEffect(() => {
    Speech.speak(`You selected ${flavor}. Now choose your budget. Is it expensive or cheap?`);
  }, [flavor]);

  const handleBudgetPress = (budgetName) => {
    setSelectedBudget(budgetName);
    Speech.speak(budgetName);
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedBudget === item.name;
    const imageSize = isSelected ? styles.selectedImage : styles.image;
    const textSize = isSelected ? styles.selectedItemText : styles.itemText;

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => handleBudgetPress(item.name)}
      >
        <Image source={item.image} style={imageSize} />
        <Text style={textSize}>{item.name}</Text>
        {isSelected && <View style={styles.overlay}></View>}
      </TouchableOpacity>
    );
  };

  const handleContinue = () => {
    if (selectedBudget) {
      navigation.navigate("RecommendationScreen", { flavor, budget: selectedBudget });
    } else {
      Speech.speak("Please select a budget to continue");
    }
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

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
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
    borderWidth: 4,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  selectedImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
  },
  itemText: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  selectedItemText: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 165, 0, 0.5)",
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
