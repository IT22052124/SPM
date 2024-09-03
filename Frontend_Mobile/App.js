import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import ShoppingList from "./app/screens/ShoppingList";

export default function App() {
  const [num, setNum] = useState(0);
  const inc = () => {
    setNum(num + 1);
  };
  return <ShoppingList />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
