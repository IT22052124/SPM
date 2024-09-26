import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = async () => {
    try {
      // Send login request to server
      const response = await axios.post('http://192.168.8.195:5000/loyalty/login', {
        phoneNumber,
      });

      if (response.data.success) {
        // Store user details in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

        // Navigate to the next screen, e.g., home
        navigation.navigate('PurchaseHistory');
      } else {
        Alert.alert('Login Failed', response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
