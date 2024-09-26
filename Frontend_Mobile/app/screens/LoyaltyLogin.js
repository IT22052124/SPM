import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleCheckUser = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert(
        "Invalid Phone Number",
        "Phone number must be exactly 10 digits long."
      );
      return;
    }

    try {
      // Check if user exists on the server
      const response = await axios.post(
        "http://192.168.8.195:5000/loyalty/login",
        { phoneNumber }
      );

      if (response.data.success) {
        // User exists, send OTP
        handleSendOtp();
      } else {
        Alert.alert(
          "User Not Found",
          "No account found for this phone number. Please check and try again."
        );
      }
    } catch (error) {
      console.error("Error checking user:", error);
      Alert.alert(
        "Error",
        "An error occurred while checking user. Please try again."
      );
    }
  };

  const handleSendOtp = async () => {
    try {
      // Send OTP request to server
      const response = await axios.post(
        "http://192.168.8.195:5000/loyalty/send-otp",
        { phoneNumber }
      );

      if (response.data.success) {
        Alert.alert("OTP Sent", "Please check your phone for the OTP.");
        setIsOtpSent(true);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert(
        "Error",
        "An error occurred while sending OTP. Please try again."
      );
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "OTP must be exactly 6 digits long.");
      return;
    }

    try {
      // Verify OTP with server
      const response = await axios.post(
        "http://192.168.8.195:5000/loyalty/verify-otp",
        { phoneNumber, otp }
      );

      if (response.data.success) {
        // Store user details in AsyncStorage if available in the response
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(response.data.user || {})
        );
        navigation.navigate("PurchaseHistory");
      } else {
        Alert.alert("Verification Failed", response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert(
        "Error",
        "An error occurred while verifying OTP. Please try again."
      );
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        maxLength={10} // Limit input to 10 characters
        style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: "#ccc" }}
      />
      <Button title="Check User" onPress={handleCheckUser} />

      {isOtpSent && (
        <>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6} // Limit input to 6 characters
            style={{
              margin: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: "#ccc",
            }}
          />
          <Button title="Verify OTP" onPress={handleVerifyOtp} />
        </>
      )}
    </View>
  );
};

export default LoginScreen;
