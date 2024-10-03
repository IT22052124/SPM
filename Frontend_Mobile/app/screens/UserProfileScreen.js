import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { IPAddress } from "../../globals";
const { width } = Dimensions.get("window");
import { useUser } from "../components/UserContext";
import * as Speech from "expo-speech";
export default function ProfileScreen() {
  const { username } = useUser();
  const navigation = useNavigation();
  const route = useRoute();
  const email = username;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [cusID, setID] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isEditing]);

  const fetchUserData = () => {
    axios
      .get(`http://${IPAddress}:5000/user/${email}`)
      .then((response) => {
        if (response.data) {
          setUserData(response.data);
          setName(response.data.name);
          setPhoneNumber(response.data.phoneNumber);
          setAddress(response.data.address);
          setID(response.data.userID);
          setProfilePicture(response.data.profilePicture);
        } else {
          Alert.alert("Error", "User not found");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data.");
        setLoading(false);
      });
  };

  const logout = () => {
    navigation.navigate("UserLoginScreen");
  };

  const goReport = () => {
     Speech.speak("generate report");
    navigation.navigate("ReportGenerator", { username });
  };

  const handleUpdate = () => {
    const updatedDetails = { name, phoneNumber, address, profilePicture };
    axios
      .put(`http://${IPAddress}:5000/user/${email}`, updatedDetails)
      .then((response) => {
        Alert.alert("Success", "Profile updated successfully.");
         Speech.speak("Profile updated successfully")
        setUserData(response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        Alert.alert("Error", "Failed to update profile.");
      });
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setProfilePicture(selectedImage);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  const InfoCard = ({ icon, label, value, bgColor, showArrow }) => (
    <View style={styles.infoCard}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        {value ? <Text style={styles.infoValue}>{value}</Text> : null}
      </View>
      {showArrow && (
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#6200EE"
          style={styles.arrowIcon}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.header}
      >
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={isEditing ? pickImage : null}>
            <Image
              source={
                profilePicture
                  ? { uri: profilePicture }
                  : { uri: "https://via.placeholder.com/150" }
              }
              style={styles.profileImage}
            />
            {isEditing && (
              <View style={styles.editOverlay}>
                <Ionicons name="camera" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.username}>{userData.name}</Text>

          {!isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {isEditing ? (
          <View>
            <Text style={styles.editHeading}>Edit personal info</Text>
            <View style={styles.editForm}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={24} color="#6200EE" />
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  value={name}
                  onChangeText={setName}
                  
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={24} color="#6200EE" />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  value={email}
                  editable={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={24} color="#6200EE" />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={24} color="#6200EE" />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdate}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.infoContainer}>
              <InfoCard
                icon="person-circle-outline"
                label="Name"
                value={userData.name}
                bgColor="grey" // Orange
              />
            </View>
            <View style={styles.infoContainer}>
              <InfoCard
                icon="location-outline"
                label="Address"
                value={userData.address}
                bgColor="#03A9F4" // Light Blue
              />
            </View>
            <View style={styles.infoContainer}>
              <InfoCard
                icon="call-outline"
                label="Phone"
                value={userData.phoneNumber}
                bgColor="#8BC34A" // Green
              />
            </View>
            <View style={styles.infoContainer}>
              <InfoCard
                icon="mail-outline"
                label="Email"
                value={userData.email}
                bgColor="red" // Yellow
              />
            </View>
            <View style={styles.infoContainer}>
              <TouchableOpacity onPress={goReport}>
                <InfoCard
                  icon="receipt-outline"
                  label="Generate Report"
                  bgColor="orange" // Yellow
                  showArrow={true} // Show the arrow for navigation
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
  <View style={styles.logoutButtonContent}>
    <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
    <Text style={styles.logoutButtonText}>Logout</Text>
  </View>
</TouchableOpacity>

          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 15,
    paddingTop: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginBottom: 0,
  },
  editOverlay: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(98, 0, 238, 0.8)",
    borderRadius: 20,
    padding: 8,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
    marginBottom: 10,
  },
  userHandle: {
    fontSize: 16,
    color: "#E1E1E1",
    marginBottom: 20,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 15,
  },
  editHeading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  editForm: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 10,
    fontSize: 16,
    color: "#333333",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 16,
    color: "#333333",
  },
  reportButton: {
    flexDirection: "row",
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  reportButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row", // This aligns items in a row
    justifyContent: "center", // Centers the content horizontally
  },
  logoutButtonContent: {
    flexDirection: "row", // For icon and text to be in a row
    alignItems: "center", // Vertically center the icon and text
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10, // Add space between icon and text
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#CF6679",
    fontSize: 18,
    textAlign: "center",
  },
});
