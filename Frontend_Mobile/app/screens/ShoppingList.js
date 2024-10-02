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
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as Speech from "expo-speech";
import { MaterialIcons } from "@expo/vector-icons";

export default function Component() {
  const navigation = useNavigation();
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(300)).current;
  const route = useRoute();
  const { username } = route.params || {};
  const email = username;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy < -50 && Math.abs(gestureState.dx) < 50) {
          navigation.navigate("Flavor");
        }
      },
    })
  ).current;

  useEffect(() => {
    if (email) {
      axios
        .get(`http://192.168.1.3:5000/shoppinglist/shopping-lists?email=${email}`)
        .then((response) => {
          setLists(response.data);
          updateNewListName(response.data);
        })
        .catch((error) => console.error(error));
    }
  }, [email]);

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
        .post("http://192.168.1.3:5000/shoppinglist/shopping", {
          listname: newListName,
          email,
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
      .delete(`http://192.168.1.3:5000/shoppinglist/shopping-lists/${id}`)
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
    Speech.speak("creating new list");
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
        toValue: 0,
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
              <View style={styles.listIconContainer}>
                <MaterialIcons name="shopping-cart" size={24} color="#007bff" />
              </View>
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
        <MaterialIcons name="add" size={24} color="#fff" />
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
              <Text style={styles.modalTitle}>Create New List</Text>
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
                style={styles.cancelButtonModal}
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonTextModal}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Bold" : "Roboto",
    fontSize: 34,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 24,
    textAlign: "center",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  listIconContainer: {
    backgroundColor: "#e8f5ff",
    padding: 10,
    borderRadius: 10,
  },
  listName: {
    flex: 1,
    fontSize: 18,
    color: "#34495e",
    marginLeft: 16,
  },
  deleteButton: {
    padding: 8,
  },
  createButton: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Bold" : "Roboto",
    fontSize: 24,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: "#d0d0d0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
  },
  createButtonModal: {
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  createButtonTextModal: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButtonModal: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  cancelButtonTextModal: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});