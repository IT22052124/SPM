import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";

export default function App() {
  const [num, setNum] = useState(0);
  const inc = () => {
    setNum(num + 1);
  };
  return (
    <View style={styles.container}>
      <Text>{num}</Text>
      <Button title="Hello" onPress={inc} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
