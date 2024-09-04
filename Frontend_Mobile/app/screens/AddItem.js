import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as Speech from "expo-speech";
import * as Permissions from "expo-permissions";
import * as SpeechRecognizer from "expo-speech-recognizer";

export default function AddItem({ addItem }) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");

  const startListening = async () => {
    try {
      const { granted } = await Permissions.askAsync(
        Permissions.AUDIO_RECORDING
      );
      if (!granted) {
        alert("Permission to access microphone is required!");
        return;
      }

      SpeechRecognizer.start({
        onSpeechStart: () => console.log("Started listening"),
        onSpeechResults: (results) => {
          setItemName(results[0]?.transcript || "");
        },
        onError: (error) => console.error(error),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    if (itemName.trim() && quantity.trim()) {
      addItem({ name: itemName, quantity });
      setItemName("");
      setQuantity("");
    } else {
      alert("Please enter item name and quantity.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />
      <TouchableOpacity onPress={startListening} style={styles.voiceButton}>
        <Text style={styles.voiceButtonText}>Use Voice</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
      />
      <Button title="Add Item" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  voiceButton: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    alignItems: "center",
  },
  voiceButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
