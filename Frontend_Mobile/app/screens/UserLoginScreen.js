import React, { useState, useEffect } from "react";
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
  Animated,
  Dimensions,
} from "react-native";
import axios from "axios";
import * as Speech from "expo-speech";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../components/UserContext"; // Import the context
import { IPAddress } from "../../globals";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

export default function UserLogin() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));
  const { setUsername: setUserContext } = useUser();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    if (email && password) {
      const loginDetails = {
        email,
        password,
      };

      axios
        .post(`http://${IPAddress}:5000/signin`, loginDetails)
        .then((response) => {
          const username = response.data.username || email;
          console.log(username)
          Toast.show({
            type: "success",
            position: "top",
            text1: "Login Successfull",
            visibilityTime: 4000,
            autoHide: true,
          });
          Speech.speak("Login successful");
          navigation.navigate("MainTabs", {
            screen: "Dashboard",
            params: { username },
          });
          setUserContext(username);
        })
        .catch((error) => {
          console.error(error);
          Alert.alert(
            "Error",
            error.response?.data?.message || "An error occurred"
          );
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
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image source={require("../assets/hell2.png")} style={styles.image} />
        <Text style={styles.header}>Welcome Back</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email ID"
            placeholderTextColor="#a0a0a0"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            onPress={() => Speech.speak("You have pressed the button!")}
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
            placeholderTextColor="#a0a0a0"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("UserRegistrationScreen")}
          style={styles.link}
        >
          <Text style={styles.linkText}>
            Don't have an account?{" "}
            <Text style={styles.registerText}>Register</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("LoyaltyLoginScreen")}
          style={styles.link}
        >
          <Text style={styles.linkText}>
            Login as a <Text style={styles.registerText}>Loyalty Customer</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20, // Add padding to the container
  },
  content: {
    alignItems: "center",
    flex: 1, // Allow the content to use available space
    justifyContent: "flex-start", // Changed to flex-start to move content up
    marginBottom: 30, // Add bottom margin to prevent cutoff
  },
  image: {
    width: width * 0.8,
    height: width * 0.6,
    resizeMode: "contain",
    marginBottom: 10,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#007AFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333333",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  link: {
    marginTop: 10, // Reduced margin to ensure all links fit
    alignItems: "center",
  },
  linkText: {
    color: "#333333",
    fontSize: 16,
  },
  registerText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});
