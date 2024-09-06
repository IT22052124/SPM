import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ShoppingList from "./app/screens/ShoppingList";
import ItemScreen from "./app/screens/ListItems";
import FlavorProfileScreen from "./app/screens/FlavorProfileScreen";
import BudgetScreen from "./app/screens/BudgetScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ShoppingList">
        <Stack.Screen
          name="ShoppingList"
          component={ShoppingList}
          options={{ title: "Shopping Lists" }}
        />
        <Stack.Screen
          name="ItemScreen"
          component={ItemScreen}
          options={{ title: "Items" }}
        />
        <Stack.Screen
          name="Flavor"
          component={FlavorProfileScreen}
          options={{ title: "Flavor", presentation: "modal" }} // Display as modal
        />
        <Stack.Screen
          name="BudgetScreen"
          component={BudgetScreen}
          options={{ title: "Budget" }} // Add new screen
        />
      </Stack.Navigator>
    </NavigationContainer>
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
