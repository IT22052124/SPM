import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

// Import your screens
import Dashboard from "./app/screens/Dashboard";
import ShoppingList from "./app/screens/ShoppingList";
import Promotions from "./app/screens/Promotions";
import UserProfile from "./app/screens/UserProfileScreen"; // Regular user profile component
import ItemScreen from "./app/screens/ListItems";
import FlavorProfileScreen from "./app/screens/FlavorProfileScreen";
import BudgetScreen from "./app/screens/BudgetScreen";
import Recommendation from "./app/screens/Recommendation";
import DisplayProduct from "./app/screens/DisplayProduct";
import BarcodeScanner from "./app/components/BarcodeScanner";
import ProductDetails from "./app/screens/ProductDetails";
import ReportGenerator from "./app/screens/ReportScreen";
import AuthLoadingScreen from "./app/screens/AuthLoadingScreen";
import LoginScreen from "./app/screens/LoyaltyLogin";
import PurchaseHistory from "./app/screens/PurchaseHistory";
import UserRegistration from "./app/screens/UserSignUpScreen";
import UserLogin from "./app/screens/UserLoginScreen";
import AllUser from "./app/screens/AllUser";
import { UserProvider } from "./app/components/UserContext.js";
import LoyaltyCustomerProfile from "./app/screens/LoyaltyCustomerProfile";
import { LogBox } from "react-native";
import SearchResults from "./app/screens/SearchResults";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator({ route }) {
  const { username, isLoyaltyCustomer } = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "ShoppingList") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Promotions") {
            iconName = focused ? "pricetag" : "pricetag-outline";
          } else if (route.name === "Purchases") {
            iconName = focused ? "time" : "time-outline"; // Change this icon if needed
          } else if (route.name === "UserProfile") {
            // Add this block for UserProfile
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        initialParams={{ username }}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="ShoppingList"
        component={ShoppingList}
        initialParams={{ username }}
      />
      <Tab.Screen
        name="Promotions"
        component={Promotions}
        initialParams={{ username }}
      />
      {isLoyaltyCustomer && ( // Conditionally render Purchases tab
        <Tab.Screen
          name="Purchases"
          component={PurchaseHistory}
          initialParams={{ username }}
        />
      )}
      <Tab.Screen
        name="UserProfile"
        component={isLoyaltyCustomer ? LoyaltyCustomerProfile : UserProfile} // Conditional rendering based on loyalty status
        initialParams={{ username }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="UserLoginScreen">
          <Stack.Screen
            name="AuthLoadingScreen"
            component={AuthLoadingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserRegistrationScreen"
            component={UserRegistration}
            options={{ title: "User Registration" }}
          />
          <Stack.Screen
            name="AllUser"
            component={AllUser}
            options={{ title: "AllUser" }}
          />
          <Stack.Screen
            name="UserLoginScreen"
            component={UserLogin}
            options={{ title: "User Login" }}
          />
          <Stack.Screen
            name="LoyaltyLoginScreen"
            component={LoginScreen}
            options={{ title: "Loyalty Login" }}
          />
          <Stack.Screen
            name="SearchResults"
            component={SearchResults}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ItemScreen"
            component={ItemScreen}
            options={{ title: "Items" }}
          />
          <Stack.Screen
            name="Flavor"
            component={FlavorProfileScreen}
            options={{ title: "Flavor", presentation: "modal" }}
          />
          <Stack.Screen
            name="BudgetScreen"
            component={BudgetScreen}
            options={{ title: "Budget" }}
          />
          <Stack.Screen
            name="RecommendationScreen"
            component={Recommendation}
            options={{ title: "Recommendation" }}
          />
          <Stack.Screen
            name="DisplayProduct"
            component={DisplayProduct}
            options={{ title: "DisplayProduct", headerShown: false }}
          />
          <Stack.Screen
            name="BarcodeScanner"
            component={BarcodeScanner}
            options={{ title: "BarcodeScanner" }}
          />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetails}
            options={{ title: "Product Details" }}
          />
          <Stack.Screen
            name="ReportGenerator"
            component={ReportGenerator}
            options={{ title: "ReportGenerator" }}
          />
          <Stack.Screen
            name="MainTabs"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    </UserProvider>
  );
}

LogBox.ignoreLogs([
  "Warning: Function components cannot be given refs", // Add any warning message here
]);
LogBox.ignoreLogs(["BarCodeScanner has been deprecated"]);
