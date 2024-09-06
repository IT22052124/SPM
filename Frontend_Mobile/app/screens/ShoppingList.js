import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Speech from "expo-speech";

export default function ShoppingList() {
  const navigation = useNavigation();
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch existing lists from backend
    axios
      .get("http://172.20.10.3:5000/shoppinglist/shopping-lists")
      .then((response) => {
        setLists(response.data);
        updateNewListName(response.data); // Set the default name when lists are loaded
      })
      .catch((error) => console.error(error));
  }, []);

  const updateNewListName = (lists) => {
    const defaultName = "list ";
    const listNumbers = lists
      .map((list) => {
        const match = list.listname.match(/list (\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .sort((a, b) => b - a);

    const nextListNumber = listNumbers.length > 0 ? listNumbers[0] + 1 : 1;
    setNewListName(`${defaultName}${"0" + nextListNumber}`);
  };

  const handleCreateNewList = () => {
    if (newListName.trim()) {
      axios
        .post("http://172.20.10.3:5000/shoppinglist/shopping", {
          listname: newListName,
          products: "hello",
        })
        .then((response) => {
          const updatedLists = [...lists, response.data];
          setLists(updatedLists);
          updateNewListName(updatedLists); // Update the name for the next list
          setModalVisible(false);
          setTimeout(() => {
            // Use Text-to-Speech to announce the deletion with adjusted speed
            Speech.speak(`New list created: ${newListName}`);
          }, 500);
        })
        .catch((error) => console.error(error.response.data));
    } else {
      Alert.alert("Error", "List name cannot be empty.");
    }
  };

  const handleListClick = (list) => {
    navigation.navigate("ItemScreen", {
      listId: list._id,
      listName: list.listname,
    });
  };

  const handleDeleteList = (id) => {
    const listToDelete = lists.find((list) => list._id === id);

    axios
      .delete(`http://172.20.10.3:5000/shoppinglist/shopping-lists/${id}`)
      .then(() => {
        const updatedLists = lists.filter((list) => list._id !== id);
        setLists(updatedLists);
        updateNewListName(updatedLists); // Update the name after deletion

        setTimeout(() => {
          // Use Text-to-Speech to announce the deletion with adjusted speed
          Speech.speak(`List ${listToDelete.listname} deleted.`, {
            rate: 0.9, // Adjust the rate here
          });
        }, 500); // 500ms delay
      })
      .catch((error) => console.error(error));
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
            <Button
              title="Delete"
              onPress={() => handleDeleteList(item._id)}
              color="red"
            />
          </View>
        )}
        keyExtractor={(item) => item._id}
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
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="red"
            />
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
    fontWeight: "bold",
    marginBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 8,
  },
  listName: {
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    width: "100%",
    paddingHorizontal: 8,
  },
});
