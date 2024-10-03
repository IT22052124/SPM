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
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import axios from "axios";
import * as Speech from "expo-speech";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { IPAddress } from "../../globals";

const { width } = Dimensions.get("window");

export default function UserRegistration() {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isEmailValid, setIsEmailValid] = useState(true); // State for email validation
  const [emailErrorMessage, setEmailErrorMessage] = useState(""); // State for email error message

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    const isValid = regex.test(email); // Validate email format
    setIsEmailValid(isValid);
    setEmailErrorMessage(isValid ? "" : "Invalid email format."); // Set error message
  };

  const handleRegister = () => {
    if (
      password &&
      confirmPassword &&
      name &&
      phoneNumber &&
      email &&
      address &&
      isEmailValid // Ensure email is valid
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
  
      // Send registration request
      axios
        .post(`http://${IPAddress}:5000/user`, userDetails)
        .then((response) => {
          Alert.alert("Success", "User registered successfully.", [
            { 
              text: "OK", 
              onPress: () => {
                Speech.speak("Registration successful");
                navigation.navigate("UserLoginScreen"); // Navigate after alert dismissal
                Toast.show({
                  type: "success",
                  position: "top",
                  text1: "Registration Success",
                  visibilityTime: 4000,
                  autoHide: true,
                });
                navigation.navigate("UserLoginScreen"); // Navigate after alert dismissal
              }
            },
          ]);
        })
        .catch((error) => {
          // Handle specific errors based on the response
          if (error.response) {
            // Check for duplicate email error
            if (error.response.data.message.includes("Email already in use.")) {
              Alert.alert("Sorry", "This email is already registered. Please use a different email.");
            } else {
              Alert.alert("Error", error.response.data.message); // Display other error messages
            }
          } else {
            Alert.alert("Error", "An unexpected error occurred. Please try again later.");
          }
        });
    } else {
      if (!isEmailValid) {
        Alert.alert("Error", "Please enter a valid email address."); // Show alert for invalid email
      } else {
        Alert.alert("Error", "Please fill out all fields.");
      }
    }
  };
  
  
  const renderInput = (
    icon,
    placeholder,
    value,
    setValue,
    keyboardType = "default",
    secureTextEntry = false
  ) => (
    <View
      style={[
        styles.inputContainer,
        placeholder === "Email" && !isEmailValid && styles.invalidInputContainer, // Highlight email input container if invalid
      ]}
    >
      <Ionicons name={icon} size={24} color="#007AFF" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          if (placeholder === "Email") {
            validateEmail(text); // Validate email on change
          }
        }}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onFocus={() => Speech.speak(placeholder)}
      />
      {/* Show error message if email is invalid */}
      {placeholder === "Email" && !isEmailValid && (
        <Text style={styles.errorMessage}>{emailErrorMessage}</Text>
      )}
    </View>
  );

  const isFormValid = password && confirmPassword && name && phoneNumber && email && address && isEmailValid;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Image
            source={require("../assets/welcome.png")}
            style={styles.image}
          />
          <Text style={styles.header}>Create Account</Text>
          {renderInput("person-outline", "Full Name", name, setName)}
          {renderInput("home-outline", "Address", address, setAddress)}
          {renderInput(
            "call-outline",
            "Phone Number",
            phoneNumber,
            setPhoneNumber,
            "phone-pad"
          )}
          {renderInput(
            "mail-outline",
            "Email",
            email,
            setEmail,
            "email-address"
          )}
          {renderInput(
            "lock-closed-outline",
            "Password",
            password,
            setPassword,
            "default",
            true
          )}
          {renderInput(
            "lock-closed-outline",
            "Confirm Password",
            confirmPassword,
            setConfirmPassword,
            "default",
            true
          )}

          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]} // Disable button if form is invalid
            onPress={handleRegister}
            disabled={!isFormValid} // Disable button if form is invalid
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("UserLoginScreen")}
            style={styles.link}
          >
            <Text style={styles.linkText}>
              Already have an account?{" "}
              <Text style={styles.signInText}>Sign In</Text>
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
    height: width * 0.5,
    resizeMode: "contain",
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#007AFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: "#F8F8F8",
    position: "relative", // Added for positioning the error message
  },
  invalidInputContainer: {
    borderColor: "red", // Red border for invalid email
  },
  errorMessage: {
    color: "red", // Red color for error message
    fontSize: 12,
    position: "absolute", // Absolute positioning to overlap with input
    bottom: -20, // Adjust position below the input
    left: 10, // Adjust position for alignment
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
  buttonDisabled: {
    backgroundColor: "#A0A0A0", // Grey background for disabled button
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  link: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#333333",
    fontSize: 16,
  },
  signInText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});
