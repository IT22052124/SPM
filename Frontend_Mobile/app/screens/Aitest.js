import React, { useState } from "react";
import { TextInput, Button, View, Text, StyleSheet } from "react-native";
import axios from "axios";
import { IPAddress } from "../../globals";

// GKS2LH29L13GRTVF9HF4J7UC;

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  async function query(data) {
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/google/flan-t5-base",
        data,
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error querying the model:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  const handleSend = async () => {
    query({
      inputs: "Tell me about banana in full detail",
    }).then((response) => {
      setResponse(response[0].generated_text);
      console.log(JSON.stringify(response));
    });
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
