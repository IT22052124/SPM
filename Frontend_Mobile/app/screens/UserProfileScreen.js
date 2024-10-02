import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params || {};
  const email = username;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [cusID, setID] = useState('');
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
      .get(`http://192.168.1.3:5000/user/${email}`)
      .then((response) => {
        if (response.data) {
          setUserData(response.data);
          setName(response.data.name);
          setPhoneNumber(response.data.phoneNumber);
          setAddress(response.data.address);
          setID(response.data.userID);
          setProfilePicture(response.data.profilePicture);
        } else {
          Alert.alert('Error', 'User not found');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
        setLoading(false);
      });
  };

  const logout = () => {
    navigation.navigate('UserLoginScreen');
  };

  const goReport = () => {
    navigation.navigate('ReportGenerator', { username });
  };

  const handleUpdate = () => {
    const updatedDetails = { name, phoneNumber, address, profilePicture };
    axios
      .put(`http://192.168.1.3:5000/user/${email}`, updatedDetails)
      .then((response) => {
        Alert.alert('Success', 'Profile updated successfully.');
        setUserData(response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile.');
      });
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
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

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={isEditing ? pickImage : null}>
            <Image
              source={
                profilePicture
                  ? { uri: profilePicture }
                  : { uri: 'https://via.placeholder.com/150' }
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
          <Text style={styles.userHandle}>{userData.email}</Text>
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
            transform: [{ scale: scaleAnim }]
          }
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
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.option}>
                <Ionicons name="person-circle-outline" size={28} color="#4c669f" />
                <Text style={styles.optionText}>{userData.name}</Text>
                <Ionicons name="chevron-forward" size={24} color="#6200EE" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Ionicons name="location-outline" size={28} color="blue" />
                <Text style={styles.optionText}>{userData.address}</Text>
                <Ionicons name="chevron-forward" size={24} color="#6200EE" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Ionicons name="call-outline" size={28} color="green" />
                <Text style={styles.optionText}>{userData.phoneNumber}</Text>
                <Ionicons name="chevron-forward" size={24} color="#6200EE" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Ionicons name="mail-outline" size={28} color="red" />
                <Text style={styles.optionText}>{userData.email}</Text>
                <Ionicons name="chevron-forward" size={24} color="#6200EE" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={goReport}>
                <Ionicons name="receipt-outline" size={28} color="orange" />
                <Text style={styles.optionText}>Generate Report</Text>
                <Ionicons name="chevron-forward" size={24} color="#6200EE" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingTop: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  editOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(98, 0, 238, 0.8)',
    borderRadius: 20,
    padding: 8,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  userHandle: {
    fontSize: 18,
    color: '#E1E1E1',
    marginBottom: 20,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  editHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  editForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 10,
    fontSize: 16,
    color: '#333333',
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333333',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#CF6679',
    fontSize: 18,
    textAlign: 'center',
  },
});