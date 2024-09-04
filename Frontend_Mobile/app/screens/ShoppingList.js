import React, { Component } from "react";
import { Text, View, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Card, Icon } from "react-native-elements";

export default class ShoppingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { id: '1', name: 'Banana', quantity: '500 gms', price: '$3.50', pricePerUnit: '$7/kg', image: 'https://link-to-banana-image' },
        { id: '2', name: 'Apple', quantity: '1 kg', price: '$4.00', pricePerUnit: '$4/kg', image: 'https://link-to-apple-image' },
        { id: '3', name: 'Strawberry', quantity: '1.5 kg', price: '$6.00', pricePerUnit: '$4/kg', image: 'https://link-to-strawberry-image' }
      ],
    };
  }

  renderItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardContent}>
        <Image source={{ uri: item }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPricePerUnit}>{item.pricePerUnit}</Text>
          <Text style={styles.itemPrice}>{item.price}</Text>
        </View>
        <View style={styles.itemQuantity}>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <View style={styles.quantityButtons}>
            <TouchableOpacity style={styles.button}>
              <Icon name="minus" type="feather" size={20} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Icon name="plus" type="feather" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.listTitle}>Weekend List</Text>
        
        <View style={styles.sharedBy}>
          <Text>Shared by: </Text>
          <Text style={styles.sharedName}>Julie Turner</Text>
          <Text>, </Text>
          <Text style={styles.sharedName}>Robert Daniel</Text>
        </View>

        <FlatList
          data={this.state.items}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.checkoutContainer}>
          <Text style={styles.totalText}>Total: $13.50</Text>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  listTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sharedBy: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sharedName: {
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 8,
    borderColor: 'transparent',
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPricePerUnit: {
    fontSize: 14,
    color: 'gray',
  },
  itemPrice: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  itemQuantity: {
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
  },
  quantityButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 10,
  },
  checkoutContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 16,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
