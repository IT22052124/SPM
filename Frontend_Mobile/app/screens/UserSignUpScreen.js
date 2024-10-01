import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as Speech from "expo-speech";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

export default function UserRegistration() {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

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
        return;
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
            text1: "Registration Success",
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("../assets/welcome.png")} // Load image from assets
          style={styles.image} // Ensure this style exists in your stylesheet
        />
        <Text style={styles.header}>Sign up</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            onFocus={() => Speech.speak("Enter your Name")}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="home-outline"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            onFocus={() => Speech.speak("Enter your Address")}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="call-outline"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            onFocus={() => Speech.speak("Enter your phone number")}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            onFocus={() => Speech.speak("Enter your Email")}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onFocus={() => Speech.speak("Password")}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => Speech.speak("Confirm password")}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("UserLoginScreen")}
          style={styles.link}
        >
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  image: {
    width: 400,
    height: 220,
    alignSelf: "center",
    marginBottom: 5,
    marginTop: -10,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 38,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 10,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
