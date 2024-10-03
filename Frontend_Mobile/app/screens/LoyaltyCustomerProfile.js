import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IPAddress } from "../../globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const LoyaltyCustomerProfile = () => {
  const navigation = useNavigation();
  const [customer, setCustomer] = useState(null); // Initialize with null
  const [loading, setLoading] = useState(true); // Define loading state
  const [error, setError] = useState(null); // Define error state

  const logout = () => {
    navigation.navigate("UserLoginScreen");
  };

  useEffect(() => {
    const fetchLoyaltyCustomer = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user !== null) {
          const { _id } = JSON.parse(user);
          const response = await axios.get(
            `http://${IPAddress}:5000/loyalty/loyalty-customers/${_id}`
          );
          setCustomer(response.data);
        } else {
          setError("User not found.");
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
        setError("Failed to fetch customer details.");
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchLoyaltyCustomer();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return empty string if no date
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading customer profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color="#4A90E2" />
        <Text style={styles.headerText}>{customer?.Name}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="albums-outline" size={28} color="#4c669f" />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Customer ID:</Text>
          <Text style={styles.infoText}>{customer?.ID}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="mail-outline" size={28} color="red" />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Email:</Text>
          <Text style={styles.infoText}>{customer?.Email}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="call-outline" size={28} color="green" />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Phone:</Text>
          <Text style={styles.infoText}>{customer?.Phone}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="location-outline" size={28} color="blue" />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Address:</Text>
          <Text style={styles.infoText}>{customer?.Address}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="calendar-outline" size={28} color="blue" />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Date of Birth:</Text>
          <Text style={styles.infoText}>{formatDate(customer?.DOB)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    textTransform: "capitalize", // Capitalizes the name
  },
  infoContainer: {
    flexDirection: "row", // Aligns icon and text in a row
    alignItems: "center", // Centers vertically
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTextContainer: {
    marginLeft: 10, // Adds space between the icon and the text
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#555",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginTop: 5, // Adds a bit of space above the text
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoyaltyCustomerProfile;
