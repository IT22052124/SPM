import React, { useState, useEffect, useRef } from "react";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Animated,
  Easing,
  StyleSheet,
  PanResponder,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Speech from "expo-speech";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MultiSelectComponent from "../components/dropdown";

export default function ShoppingList() {
  const navigation = useNavigation();
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(300)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Return true to capture the touch events
        return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Detect horizontal upward swipe
        if (gestureState.dy < -50 && Math.abs(gestureState.dx) < 50) {
          // Navigate to Flavour Profile
          navigation.navigate("Flavor");
        }
      },
    })
  ).current;

  useEffect(() => {
    axios
      .get("http://192.168.1.7:5000/shoppinglist/shopping-lists")
      .then((response) => {
        setLists(response.data);
        updateNewListName(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const updateNewListName = (lists) => {
    const defaultName = "List ";
    const listNumbers = lists
      .map((list) => {
        const match = list.listname.match(/List (\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .sort((a, b) => b - a);

    const nextListNumber = listNumbers.length > 0 ? listNumbers[0] + 1 : 1;
    setNewListName(`${defaultName}${"0" + nextListNumber}`);
  };

  const handleCreateNewList = () => {
    if (newListName.trim()) {
      axios
        .post("http://192.168.1.7:5000/shoppinglist/shopping", {
          listname: newListName,
          products: "hello",
        })
        .then((response) => {
          const updatedLists = [...lists, response.data];
          setLists(updatedLists);
          updateNewListName(updatedLists);
          handleCloseModal();
          setModalVisible(false);
          setTimeout(() => {
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
      .delete(`http://192.168.1.7:5000/shoppinglist/shopping-lists/${id}`)
      .then(() => {
        const updatedLists = lists.filter((list) => list._id !== id);
        setLists(updatedLists);
        updateNewListName(updatedLists);

        Toast.show({
          type: "success",
          position: "top",
          text1: "Item Deleted",
          text2: `List ${listToDelete.listname} has been deleted.`,
          visibilityTime: 3000,
          autoHide: true,
        });

        setTimeout(() => {
          Speech.speak(`List ${listToDelete.listname} deleted.`, {
            rate: 0.9,
          });
        }, 500);
      })
      .catch((error) => console.error(error));
  };

  const handleOpenModal = () => {
    Speech.speak("creating new list")
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCloseModal = () => {
    
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text style={styles.title}>Shopping Lists</Text>

      <FlatList
        data={lists}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleListClick(item)}>
            <View style={styles.listItem}>
              <Text style={styles.listName}>{item.listname}</Text>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteList(item._id)}
              >
                <MaterialIcons name="delete" size={30} color="red" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleOpenModal}>
        <Text style={styles.createButtonText}>Create New List</Text>
      </TouchableOpacity>

      {modalVisible && (
        <Modal transparent={true} visible={modalVisible} animationType="none">
          <View style={styles.modalBackground}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  opacity: opacityAnim,
                  transform: [{ translateY: translateYAnim }],
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Enter list name"
                value={newListName}
                onChangeText={setNewListName}
              />
              <TouchableOpacity
                style={styles.createButtonModal}
                onPress={handleCreateNewList}
              >
                <Text style={styles.createButtonTextModal}>Create List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButtonModal, { marginTop: 10 }]}
                onPress={handleCloseModal}
              >
                <Text style={styles.deleteButtonTextModal}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // styles remain the same as before
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F2F2F2",
  },
  title: {
    fontFamily: "sans-serif",
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    borderRadius: 100,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
    width: "100%", // Set width to full container width
    height: 70, // Fixed height for each list item
  },
  listName: {
    fontSize: 20,
    color: "#555",
  },
  deleteButton: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
    marginRight: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    width: 350,
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 9,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    width: "100%",
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  createButtonModal: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  createButtonTextModal: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButtonModal: {
    backgroundColor: "#ff5252",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  deleteButtonTextModal: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
