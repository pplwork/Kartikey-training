import "react-native-gesture-handler";
import React, { useState } from "react";
import { Image, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons";

//screens
import HomeScreen from "./components/HomeScreen";
import SearchScreen from "./components/SearchScreen";
import ReelsScreen from "./components/ReelsScreen";
import ActivityScreen from "./components/ActivityScreen";
import ProfileScreen from "./components/ProfileScreen";
import colors from "./constants/colors";

export default function App() {
  const [screen, setScreen] = useState(0);
  return (
    <>
      <StatusBar
        barStyle={screen == 2 ? "light-content" : "dark-content"}
        backgroundColor={screen == 2 ? colors.black : colors.white}
      />
      <NavigationContainer onStateChange={(e) => setScreen(e.index)}>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
              switch (route.name) {
                case "Home":
                  return focused ? (
                    <Ionicons name="home-sharp" size={24} color="black" />
                  ) : (
                    <Ionicons
                      name="home-outline"
                      size={24}
                      color={screen == 2 ? "white" : "black"}
                    />
                  );
                case "Search":
                  return focused ? (
                    <FontAwesome name="search" size={24} color="black" />
                  ) : (
                    <AntDesign
                      name="search1"
                      size={24}
                      color={screen == 2 ? "white" : "black"}
                    />
                  );
                case "Reels":
                  return focused ? (
                    <Image
                      source={require("./assets/icons/reel-white.png")}
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
                    <AntDesign
                      name="hearto"
                      size={24}
                      color={screen == 2 ? "white" : "black"}
                    />
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
            inactiveBackgroundColor: screen == 2 ? colors.black : colors.white,
            activeBackgroundColor: screen == 2 ? colors.black : colors.white,
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Reels" component={ReelsScreen} />
          <Tab.Screen name="Activity" component={ActivityScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

const Tab = createBottomTabNavigator();
