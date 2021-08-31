import "react-native-gesture-handler";
import "react-native-console-time-polyfill";
import { LogBox } from "react-native";
import React, { useEffect, useRef } from "react";
import { store, persistedStore } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { StatusBar } from "react-native";

import AppTabs from "./Main/AppTabs";
import AuthStack from "./Auth/AuthStack";

import inAppMessaging from "@react-native-firebase/in-app-messaging";

import colors from "./constants/colors";

import messaging from "@react-native-firebase/messaging";
import crashlytics from "@react-native-firebase/crashlytics";
import remoteConfig from "@react-native-firebase/remote-config";

LogBox.ignoreLogs(["Setting a timer", "Constants.installationId"]);

export default function App() {
  const isMounted = useRef(true);

  useEffect(() => {
    crashlytics().log("App Mounted");

    //enabling inappmessaging for notifications
    inAppMessaging().setMessagesDisplaySuppressed(false);

    // getting remote configuration
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
    // checking for new notification
    messaging().onNotificationOpenedApp((msg) => {
      if (msg) console.log(msg);
    });
  });
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <StatusBar
        // barStyle={screen == "Reels" ? "light-content" : "dark-content"}
        // backgroundColor={screen == "Reels" ? colors.black : colors.white}
        />
        {!store.getState().isLoggedIn && <AuthStack />}
        {store.getState().isLoggedIn && <AppTabs />}
      </PersistGate>
    </Provider>
  );
}
