import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IPAddress } from "../../globals";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert(
        "Invalid Phone Number",
        "Phone number must be exactly 10 digits long."
      );
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://${IPAddress}:5000/loyalty/login`,
        { phoneNumber, email }
      );

      if (response.data.success) {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(response.data.user || {})
        );
        Speech.speak("Login successful");
        navigation.navigate("MainTabs", {
          username: response.data,
          isLoyaltyCustomer: true,
          screen: "Dashboard",
        });
      } else {
        Alert.alert("Login Failed", response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert(
        "Error",
        "An error occurred while logging in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Image source={require("../assets/loyal.png")} style={styles.image} />
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
              placeholderTextColor="#a0a0a0"
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
              maxLength={10}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
    marginBottom: 20,
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
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333333",
    left: 10,
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
});

export default LoginScreen;
