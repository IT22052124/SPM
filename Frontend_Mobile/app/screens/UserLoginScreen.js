import React, { useState } from 'react';
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
} from 'react-native';
import axios from 'axios';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function UserLogin() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      const loginDetails = {
        email,
        password,
      };

      axios
        .post('http://192.168.1.3:5000/signin', loginDetails)
        .then((response) => {
          const username = response.data.username || email;
          Alert.alert('Success', 'Logged in successfully.');
          Speech.speak('Login successful');
          navigation.navigate('ShoppingList', { username });
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('Error', error.response.data.message);
        });
    } else {
      Alert.alert('Error', 'Please fill out all fields.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image
          source={require("../assets/hell2.png")} // Load image from assets
          style={styles.image} // Ensure this style exists in your stylesheet
        />
        <Text style={styles.header}>SignIn</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#007AFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email ID"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserRegistrationScreen')}
          style={styles.link}
        >
          <Text style={styles.linkText}>
          Don't have an account? <Text style={styles.registerText}>Register</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 400,
    height: 300,
    marginLeft:10,
    alignSelf: 'center',
    marginBottom: 15,
    marginTop:-60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  forgotText: {
    color: '#007AFF',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 17,
    alignItems: 'center',
  },
  linkText: {
    color: '#000000',
    fontSize: 16,
  },
  registerText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});