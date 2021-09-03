import "react-native-gesture-handler";
import "react-native-console-time-polyfill";
import { LogBox } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { store, persistedStore } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { StatusBar } from "react-native";

import AuthStack from "./Auth/AuthStack";
import MainStack from "./Main/MainStack";
import colors from "./constants/colors";

import auth from "@react-native-firebase/auth";
import inAppMessaging from "@react-native-firebase/in-app-messaging";
import messaging from "@react-native-firebase/messaging";
import crashlytics from "@react-native-firebase/crashlytics";
import remoteConfig from "@react-native-firebase/remote-config";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

LogBox.ignoreLogs(["Setting a timer", "Constants.installationId"]);

const ScreenSelector = () => {
  const [initializing, setInitializing] = useState(true);
  const { screen } = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "LAUNCH_RESET" });
  }, []);
  const onAuthStateChanged = (user) => {
    // if user logged in
    if (user) {
      firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          let data = doc.data();
          storage()
            .refFromURL(data.Photo)
            .getDownloadURL()
            .then((url) => {
              data.Photo = url;
              dispatch({
                type: "SET_USER",
                payload: data,
              });
            })
            .catch((err) => {
              dispatch({
                type: "SET_USER",
                payload: data,
              });
              crashlytics().recordError(err);
            });
        })
        .catch(crashlytics().recordError);
    } else dispatch({ type: "SIGNOUT" });
    if (initializing) setInitializing(false);
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  if (initializing) return null;
  return (
    <>
      <StatusBar
        barStyle={screen == "Reels" ? "light-content" : "dark-content"}
        backgroundColor={screen == "Reels" ? colors.black : colors.white}
      />
      {!auth().currentUser && <AuthStack />}
      {auth().currentUser && <MainStack />}
    </>
  );
};

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
        <ScreenSelector />
      </PersistGate>
    </Provider>
  );
}
