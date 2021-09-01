import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import EditPersonal from "./EditProfileStack/EditPersonal";
import EditProfile from "./EditProfileStack/EditProfile";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import colors from "../constants/colors";

import Analytics from "@react-native-firebase/analytics";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import crashlytics from "@react-native-firebase/crashlytics";
import auth from "@react-native-firebase/auth";
import { useSelector } from "react-redux";

const win = Dimensions.get("window");

const EditProfileModal = ({ setVisible }) => {
  const isMounted = useRef(true);
  const { user } = useSelector((state) => state);
  const [newDetails, setNewDetails] = useState(user);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const saveUpdates = useCallback(() => {
    crashlytics().log("Updating User");
    firestore()
      .collection("users")
      .doc(user.uid)
      .update(newDetails)
      .then(() => {
        Analytics().logEvent("ProfileUpdated");
        setVisible(false);
      })
      .catch((err) => {
        crashlytics().recordError(err);
      });
  }, [newDetails, user]);

  useEffect(() => {
    crashlytics().log("Updating User Profile Page data");
    const unsubscribe = firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot(
        (doc) => {
          const data = doc.data();
          if (isMounted.current)
            setNewDetails((prev) => ({
              ...data,
              Photo: user.Photo,
              uid: user.uid,
            }));
        },
        (err) => {
          crashlytics().recordError(err);
        }
      );
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.modalContainer}>
      <Stack.Navigator
        initialRouteName="profile"
        headerMode="float"
        screenOptions={{ animationEnabled: false }}
      >
        <Stack.Screen
          name="profile"
          options={{
            title: "Edit Profile",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  saveUpdates();
                }}
              >
                <AntDesign name="check" size={32} color="#1890ff" />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => setVisible(false)}>
                <EvilIcons name="close" size={32} color="black" />
              </TouchableOpacity>
            ),
            headerRightContainerStyle: {
              paddingHorizontal: 10,
            },
            headerLeftContainerStyle: {
              paddingHorizontal: 10,
            },
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        >
          {(props) => (
            <EditProfile {...props} user={newDetails} setUser={setNewDetails} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="personal"
          options={{
            title: "Personal Information",
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        >
          {(props) => (
            <EditPersonal
              {...props}
              user={newDetails}
              setUser={setNewDetails}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default React.memo(EditProfileModal);

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: colors.white,
  },
});

const Stack = createStackNavigator();
