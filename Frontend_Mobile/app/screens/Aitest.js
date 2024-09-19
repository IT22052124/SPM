import React, { useState } from "react";
import { TextInput, Button, View, Text, StyleSheet } from "react-native";
import axios from "axios";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    try {
      const result = await axios.post("http://localhost:5000/chatgpt", {
        prompt,
      });
      setResponse(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ask ChatGPT something..."
        value={prompt}
        onChangeText={(text) => setPrompt(text)}
      />
      <Button title="Send" onPress={handleSend} />
      <Text style={styles.response}>{response}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  response: {
    marginTop: 16,
    fontSize: 16,
  },
});
