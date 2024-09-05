import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function ShoppingList() {
  const navigation = useNavigation();
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('list 01');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch existing lists from backend
    axios.get('http://192.168.43.79:5000/api/shopping-lists')
      .then(response => setLists(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleCreateNewList = () => {
    if (newListName.trim()) {
      axios.post('http://192.168.43.79:5000/api/shopping-lists', { listname: newListName })
        .then(response => {
          setLists([...lists, response.data]);
          setNewListName('list 01');
          setModalVisible(false);
        })
        .catch(error => console.error(error));
    } else {
      Alert.alert('Error', 'List name cannot be empty.');
    }
  };

  const handleListClick = (list) => {
    navigation.navigate('ItemScreen', { listId: list._id, listName: list.listname });
  };

  const handleDeleteList = (id) => {
    axios.delete(`http://192.168.43.79:5000/api/shopping-lists/${id}`)
      .then(() => {
        setLists(lists.filter(list => list._id !== id));
      })
      .catch(error => console.error(error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Shopping Lists</Text>
      <FlatList
        data={lists}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity onPress={() => handleListClick(item)}>
              <Text style={styles.listName}>{item.listname}</Text>
            </TouchableOpacity>
            <Button title="Delete" onPress={() => handleDeleteList(item._id)} color="red" />
          </View>
        )}
        keyExtractor={item => item._id}
      />
      <Button title="Create New List" onPress={() => setModalVisible(true)} />
      
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter list name"
              value={newListName}
              onChangeText={setNewListName}
            />
            <Button title="Create List" onPress={handleCreateNewList} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  listName: {
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    width: '100%',
    paddingHorizontal: 8,
  },
});
