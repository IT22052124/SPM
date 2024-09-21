import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ShoppingList from "./app/screens/ShoppingList";
import ItemScreen from "./app/screens/ListItems";
import FlavorProfileScreen from "./app/screens/FlavorProfileScreen";
import BudgetScreen from "./app/screens/BudgetScreen";
import Recommendation from "./app/screens/Recommendation";
import DisplayProduct from "./app/screens/DisplayProduct";
import Toast from "react-native-toast-message";
import BarcodeScanner from "./app/components/BarcodeScanner";
import Dashboard from "./app/screens/Dashboard";
import Aitest from "./app/screens/Aitest";
import Promotions from "./app/screens/Promotions";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Promotions">
        <Stack.Screen
          name="Aitest"
          component={Aitest}
          options={{ title: "Aitest" }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ title: "Dashboard" }}
        />
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
        <Stack.Screen
          name="RecommendationScreen"
          component={Recommendation}
          options={{ title: "Recommendation" }} // Add new screen
        />
        <Stack.Screen
          name="DisplayProduct"
          component={DisplayProduct}
          options={{ title: "DisplayProduct" }}
        />
        <Stack.Screen
          name="BarcodeScanner"
          component={BarcodeScanner}
          options={{ title: "BarcodeScanner" }}
        />
        <Stack.Screen
          name="Promotions"
          component={Promotions}
          options={{ title: "Promotions" }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
      <Toast ref={(ref) => Toast.setRef(ref)} />
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
