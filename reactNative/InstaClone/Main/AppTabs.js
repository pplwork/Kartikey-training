import React, { useRef } from "react";
import { StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons";

//screens
import HomeScreenStack from "../components/HomeScreenStack";
import SearchScreen from "../components/SearchScreen";
import ReelsScreen from "../components/ReelsScreen";
import ActivityScreen from "../components/ActivityScreen";
import ProfileScreen from "../components/ProfileScreen";

import { useSelector, useDispatch } from "react-redux";

import Analytics from "@react-native-firebase/analytics";

import colors from "../constants/colors";

const AppTabs = () => {
  const isMounted = useRef(true);
  const navRef = useRef(null);
  const { screen, user, isLoggedIn } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <NavigationContainer
      ref={navRef}
      onStateChange={(e) => {
        const prevRoute = screen;
        const curRoute = navRef.current.getCurrentRoute().name;
        if (prevRoute != curRoute) {
          Analytics().logScreenView({
            screen_class: curRoute,
            screen_name: curRoute,
          });
          dispatch({
            type: "SET_SCREEN",
            payload: navRef.current.getCurrentRoute().name,
          });
        }
      }}
    >
      <Tab.Navigator
        initialRouteName="HomeStack"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            switch (route.name) {
              case "HomeStack":
                return focused ? (
                  <Ionicons name="home-sharp" size={24} color="black" />
                ) : (
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={screen == "Reels" ? "white" : "black"}
                  />
                );
              case "Search":
                return focused ? (
                  <FontAwesome name="search" size={24} color="black" />
                ) : (
                  <AntDesign
                    name="search1"
                    size={24}
                    color={screen == "Reels" ? "white" : "black"}
                  />
                );
              case "Reels":
                return focused ? (
                  <Image
                    source={require("../assets/icons/reel-white.png")}
                    style={{
                      height: 26,
                      width: 26,
                    }}
                  />
                ) : (
                  <Image
                    source={require("../assets/icons/reelo.png")}
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
                    color={screen == "Reels" ? "white" : "black"}
                  />
                );
              case "Profile":
                return (
                  <Image
                    source={{ uri: pfpURI }}
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
          inactiveBackgroundColor:
            screen == "Reels" ? colors.black : colors.white,
          activeBackgroundColor:
            screen == "Reels" ? colors.black : colors.white,
        }}
      >
        <Tab.Screen name="HomeStack" component={HomeScreenStack} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Reels" component={ReelsScreen} />
        <Tab.Screen name="Activity" component={ActivityScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppTabs;

const styles = StyleSheet.create({});
const Tab = createBottomTabNavigator();
