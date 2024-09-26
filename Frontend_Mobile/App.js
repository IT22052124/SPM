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
import ProductDetails from "./app/screens/ProductDetails"; // Import the new ProductDetails screen
import Promotions from "./app/screens/Promotions";
import ReportGenerator from "./app/screens/ReportScreen";
import AuthLoadingScreen from './app/screens/AuthLoadingScreen';
import LoginScreen from "./app/screens/LoyaltyLogin";
import PurchaseHistory from "./app/screens/PurchaseHistory";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="AuthLoadingScreen"
          component={AuthLoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "Loyalty Login" }}
        />
        <Stack.Screen
          name="PurchaseHistory"
          component={PurchaseHistory}
          options={{ title: "Purchase History" }}
        />
        <Stack.Screen
          name="ShoppingList"
          component={ShoppingList}
          options={{ title: "Shopping Lists" }}
        />
        <Stack.Screen
          name="Aitest"
          component={Aitest}
          options={{ title: "Aitest" }}
        />
        <Stack.Screen
          name="ReportGenerator"
          component={ReportGenerator}
          options={{ title: "ReportGenerator" }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ title: "Dashboard" }}
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
          name="ProductDetails" // Add ProductDetails screen to the navigator
          component={ProductDetails}
          options={{ title: "Product Details" }}
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
