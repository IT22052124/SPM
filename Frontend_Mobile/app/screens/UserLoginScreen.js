import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import * as Speech from "expo-speech";
import { useNavigation } from "@react-navigation/native";


export default function UserLogin({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      const loginDetails = {
        email,
        password,
      };

      axios
        .post("http://192.168.1.3:5000/signin",loginDetails)
        .then((response) => {
          const username = response.data.username || email;
          Alert.alert("Success", "Logged in successfully.");
          Speech.speak("Login successful");
          navigation.navigate("ShoppingList",{username});
          // For example: navigation.navigate("MainApp");
        })
        .catch((error) => {
          console.error(error);
          Alert.alert("Error", error.response.data.message);
        });
    } else {
      Alert.alert("Error", "Please fill out all fields.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("UserRegistrationScreen")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F2F2F2",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  link: {
    marginTop: 10,
    alignItems: "center",
  },
  linkText: {
    color: "#007bff",
  },
});
