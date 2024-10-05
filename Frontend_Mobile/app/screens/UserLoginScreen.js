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
  ScrollView,
} from "react-native";
import axios from "axios";
import * as Speech from "expo-speech";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../components/UserContext"; 
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
          console.log(username);
          Toast.show({
            type: "success",
            position: "top",
            text1: "Login Successful",
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
          // Check if error has a response from server
          if (error.response) {
            const status = error.response.status;
            const message =
              error.response.data?.message || "An unexpected error occurred";
  
            if (status === 401) {
              // Handle incorrect credentials
              Alert.alert("Login Failed", "Invalid email or password.");
              Toast.show({
                type: "error",
                position: "top",
                text1: "Login Failed",
                text2: "Invalid email or password.",
                visibilityTime: 4000,
                autoHide: true,
              });
            } else if (status === 500) {
              // Handle server errors
              Alert.alert("Server Error", "Something went wrong on our end.");
            } else {
              Speech.speak("Invalid email or password.");
              Toast.show({
                type: "error",
                position: "top",
                text1: "Login Failed",
                text2: "Invalid email or password.",
                visibilityTime: 4000,
                autoHide: true,
              });
            }
          } else if (error.request) {
            // Request was made but no response received
            Alert.alert(
              "Network Error",
              "Please check your internet connection and try again."
            );
          } else {
            // Something else happened
            Alert.alert(
              "Error",
              "An unexpected error occurred. Please try again later."
            );
          }
        });
    } else {
      Alert.alert("Error", "Please fill out all fields.");
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100} // Adjust this offset based on your layout
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled" // Allow taps while keyboard is open
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
              onPress={() => Speech.speak("Enter your email address!")}
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
              onPress={() => Speech.speak("Enter your password!")}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {navigation.navigate("UserRegistrationScreen")
              Speech.speak("Registration page")}}
            style={styles.link}
          >
            <Text style={styles.linkText}>
              Don't have an account?{" "}
              <Text style={styles.registerText}>Register</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {navigation.navigate("LoyaltyLoginScreen")
              Speech.speak("Login as loyalty")}}
            style={styles.link}
          >
            <Text style={styles.linkText}>
              Login as a <Text style={styles.registerText}>Loyalty Customer</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
    padding: 20,
  },
  content: {
    alignItems: "center",
  },
  image: {
    width: width * 0.8,
    height: width * 0.6,
    resizeMode: "contain",
    marginBottom: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#007AFF",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    backgroundColor: "rgba(255,255,255,0.8)",
    textShadowRadius: 3,
    borderRadius: 10,
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
    marginTop: 10,
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
