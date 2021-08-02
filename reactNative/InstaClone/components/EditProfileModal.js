import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  createRef,
} from "react";
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

const win = Dimensions.get("window");

const EditProfileModal = ({ setVisible, username }) => {
  const isMounted = useRef(true);
  const [user, setUser] = useState({});
  const userId = useRef(null);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    (async () => {
      let docs;
      crashlytics().log("Fetching User Profile Data");
      try {
        docs = await firestore()
          .collection("user")
          .where("Username", "==", username)
          .get();
      } catch (err) {
        crashlytics().recordError(err);
      }
      let data = docs.docs[0].data();
      crashlytics().log("Resolving User Profile Image on profile page");
      try {
        data.Photo = await storage().refFromURL(data.Photo).getDownloadURL();
      } catch (err) {
        crashlytics().recordError(err);
      }
      if (isMounted.current) userId.current = docs.docs[0].id;
      if (isMounted.current) setUser(data);
    })().catch((err) => {
      crashlytics().recordError(err);
    });
  }, []);

  const saveUpdates = useCallback(() => {
    crashlytics().log("Updating User");
    firestore()
      .collection("user")
      .doc(userId.current)
      .update(user)
      .then(() => {
        Analytics().logEvent("ProfileUpdated");
        setVisible(false);
      })
      .catch((err) => {
        crashlytics().recordError(err);
      });
  }, [user]);

  useEffect(() => {
    crashlytics().log("Updating User Profile Page data");
    const unsubscribe = firestore()
      .collection("user")
      .where("Username", "==", username)
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.docs[0].data();
          if (isMounted.current)
            setUser((prev) => ({
              ...data,
              Photo: prev.Photo,
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
          {(props) => <EditProfile {...props} user={user} setUser={setUser} />}
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
          {(props) => <EditPersonal {...props} user={user} setUser={setUser} />}
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
