import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        // Retrieve logged-in user's phone number from AsyncStorage
        const user = await AsyncStorage.getItem('user');
        if (user !== null) {
          const { Phone } = JSON.parse(user); // Assuming Phone is the key for the user's phone number
          
          // Fetch purchases filtered by the user's phone number
          const response = await axios.get(`http://192.168.8.195:5000/loyalty/purchases?phoneNumber=${Phone}`);
          
          setPurchases(response.data);
        }
      } catch (error) {
        console.error('Error fetching purchase history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const handlePurchaseSelect = (purchase) => {
    setSelectedPurchase(purchase);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPurchase(null);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <FlatList
        data={purchases}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePurchaseSelect(item)}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
              <Text>Invoice ID: {item.invoiceId}</Text>
              <Text>Total: {item.finalTotal}</Text>
              <Text>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal for Purchase Details */}
      {selectedPurchase && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ margin: 20, backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Invoice ID: {selectedPurchase.invoiceId}</Text>
              <Text>Customer: {selectedPurchase.LoyaltyName}</Text>
              <Text>Total: {selectedPurchase.finalTotal}</Text>
              <Text>Paid Amount: {selectedPurchase.paidAmount}</Text>
              <Text>Balance: {selectedPurchase.balance}</Text>
              <Text>Date: {new Date(selectedPurchase.createdAt).toLocaleDateString()}</Text>

              <Text style={{ fontSize: 16, marginTop: 10, fontWeight: 'bold' }}>Items:</Text>
              <FlatList
                data={selectedPurchase.CartItems}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={{ padding: 5, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                    <Text>Product: {item.pId.name}</Text>
                    <Text>Quantity: {item.quantity} {item.unit}</Text>
                    <Text>Price: {item.price}</Text>
                    <Text>Total: {item.total}</Text>
                    {item.promoName && (
                      <>
                        <Text>Promo: {item.promoName}</Text>
                        <Text>Discounted Total: {item.DiscountedTotal}</Text>
                      </>
                    )}
                  </View>
                )}
              />
              <Button title="Close" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default PurchaseHistory;
