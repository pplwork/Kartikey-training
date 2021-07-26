import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MaterialIcons,
  AntDesign,
  Foundation,
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

//screens
import HomeScreen from "./components/HomeScreen";
import SearchScreen from "./components/SearchScreen";
import ReelsScreen from "./components/ReelsScreen";
import ActivityScreen from "./components/ActivityScreen";
import ProfileScreen from "./components/ProfileScreen";

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            switch (route.name) {
              case "Home":
                return focused ? (
                  <Ionicons name="home-sharp" size={24} color="black" />
                ) : (
                  <Ionicons name="home-outline" size={24} color="black" />
                );
              case "Search":
                return focused ? (
                  <FontAwesome name="search" size={24} color="black" />
                ) : (
                  <AntDesign name="search1" size={24} color="black" />
                );
              case "Reels":
                return focused ? (
                  <Image
                    source={require("./assets/icons/reel.png")}
                    style={{
                      height: 26,
                      width: 26,
                    }}
                  />
                ) : (
                  <Image
                    source={require("./assets/icons/reelo.png")}
                    style={{
                      height: 22,
                      width: 22,
                    }}
                  />
                );
              case "Activity":
                return focused ? (
                  <AntDesign name="heart" size={24} color="black" />
                ) : (
                  <AntDesign name="hearto" size={24} color="black" />
                );
              case "Profile":
                return (
                  <Image
                    source={require("./assets/images/profiles/pfp.jpg")}
                    style={{
                      height: 28,
                      width: 28,
                      borderRadius: 100,
                      borderColor: "rgba(0,0,0,0.5)",
                      borderWidth: focused ? 2 : 0,
                    }}
                  />
                );
            }
          },
        })}
        tabBarOptions={{
          showLabel: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Reels" component={ReelsScreen} />
        <Tab.Screen name="Activity" component={ActivityScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({});
