import React, { useState } from "react";
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
import { PanGestureHandler, State } from "react-native-gesture-handler";

export default function ShoppingList() {
  const navigation = useNavigation();
  const [lists, setLists] = useState([
    { id: "1", name: "Weekend List" },
    { id: "2", name: "Grocery List" },
  ]);
  const [newListName, setNewListName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateNewList = () => {
    if (newListName.trim()) {
      const newList = {
        id: Date.now().toString(), // Unique ID for the new list
        name: newListName,
      };
      setLists([...lists, newList]);
      setNewListName("");
      setModalVisible(false);
    } else {
      Alert.alert("Error", "List name cannot be empty.");
    }
  };

  const handleListClick = (list) => {
    navigation.navigate("ItemScreen", { listId: list.id, listName: list.name });
  };

  // Function to handle swipe gesture
  const handleGesture = (event) => {
    if (event.nativeEvent.translationX > 50) {
      navigation.navigate("Flavor");
    }
  };

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <View style={styles.container}>
        <Text style={styles.title}>My Shopping Lists</Text>
        <FlatList
          data={lists}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => handleListClick(item)}
            >
              <Text style={styles.listName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
        <Button title="Create New List" onPress={() => setModalVisible(true)} />

        {/* Modal for creating a new list */}
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
    </PanGestureHandler>
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
