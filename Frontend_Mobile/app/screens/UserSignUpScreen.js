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
import Toast from "react-native-toast-message";

export default function UserRegistration({ navigation }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(""); // State for address

  const handleRegister = () => {
    if (
      password &&
      confirmPassword &&
      name &&
      phoneNumber &&
      email &&
      address
    ) {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return; // Stop execution if passwords do not match
      }

      const userDetails = {
        password,
        name,
        phoneNumber,
        email,
        address,
      };

      axios
        .post("http://192.168.1.3:5000/user", userDetails)
        .then((response) => {
          Alert.alert("Success", "User registered successfully.");
          Speech.speak("Registration successful");
          Toast.show({
            type: "success",
            position: "top",
            text1: "Registation Success",
            // text2: `Report for the .`,
            visibilityTime: 4000,
            autoHide: true,
          });
          navigation.navigate("UserLoginScreen");
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
      <Text style={styles.header}>User Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        onFocus={() => Speech.speak("Enter your Name")}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        onFocus={() => Speech.speak("Enter your Address")} // Update state for address
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        onFocus={() => Speech.speak("Enter your phone number")}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        onFocus={() => Speech.speak("Enter your Email")}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        onFocus={() => Speech.speak("Password")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onFocus={() => Speech.speak("confirm password")}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("UserLoginScreen")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
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
    height: 50,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  radioContainer: {
    marginBottom: 12,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radioText: {
    marginRight: 10,
    fontSize: 16,
  },
  radioChecked: {
    fontSize: 16,
    color: "#007bff",
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
