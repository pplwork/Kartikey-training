import "react-native-gesture-handler";
import "react-native-console-time-polyfill";
import { LogBox } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Image, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons";
import inAppMessaging from "@react-native-firebase/in-app-messaging";

//screens
import HomeScreenStack from "./components/HomeScreenStack";
import SearchScreen from "./components/SearchScreen";
import ReelsScreen from "./components/ReelsScreen";
import ActivityScreen from "./components/ActivityScreen";
import ProfileScreen from "./components/ProfileScreen";
import colors from "./constants/colors";

import storage from "@react-native-firebase/storage";
import Analytics from "@react-native-firebase/analytics";
import messaging from "@react-native-firebase/messaging";
import crashlytics from "@react-native-firebase/crashlytics";
import remoteConfig from "@react-native-firebase/remote-config";

LogBox.ignoreLogs(["Setting a timer", "Constants.installationId"]);

export default function App() {
  const isMounted = useRef(true);
  const navRef = useRef(null);
  const [screen, setScreen] = useState("Home");
  const [pfpURI, setPfpURI] = useState(null);
  useEffect(() => {
    crashlytics().log("App Mounted");
    inAppMessaging().setMessagesDisplaySuppressed(false);
    remoteConfig()
      .setDefaults({
        test: "someDefaultValue",
      })
      .then(() => remoteConfig().fetchAndActivate())
      .then(() =>
        console.log(
          "Remote Config Value = ",
          remoteConfig().getValue("test").asString()
        )
      );

    // check for initial notification
    messaging()
      .getInitialNotification()
      .then((msg) => {
        if (msg) console.log(msg);
      })
      .catch((err) => crashlytics().recordError(err));
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    messaging().onNotificationOpenedApp((msg) => {
      if (msg) console.log(msg);
    });
  });
  useEffect(() => {
    (async () => {
      let uri;
      try {
        uri = await storage()
          .refFromURL(
            "gs://instaclone-b124e.appspot.com/images/profiles/pfp.jpg"
          )
          .getDownloadURL();
        if (isMounted.current) setPfpURI(uri);
      } catch (err) {
        crashlytics().recordError(err);
      }
    })();
  }, []);
  return (
    <>
      <StatusBar
        barStyle={screen == "Reels" ? "light-content" : "dark-content"}
        backgroundColor={screen == "Reels" ? colors.black : colors.white}
      />
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
            setScreen(navRef.current.getCurrentRoute().name);
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
    </>
  );
}

const Tab = createBottomTabNavigator();
