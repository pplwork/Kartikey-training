import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Ionicons,
  FontAwesome,
  Entypo,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";

import auth from "@react-native-firebase/auth";

const ProfileHeader = ({ navigation }) => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Ionicons name="md-lock-closed-outline" size={20} color="black" />
        <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 5 }}>
          {user.Username}
        </Text>
        <Entypo
          name="chevron-small-down"
          size={24}
          color="black"
          style={{ alignSelf: "flex-end" }}
        />
      </View>
      <View style={styles.headerRight}>
        <FontAwesome
          onPress={() => navigation.navigate("AddPostScreen")}
          name="plus-square-o"
          size={24}
          color="black"
          style={{ marginHorizontal: 20 }}
        />
        <FontAwesome
          name="bars"
          size={24}
          color="black"
          onPress={() => {
            dispatch({
              type: "SET_DRAWER",
              payload: [
                {
                  icon: {
                    library: "Ionicons",
                    name: "settings-outline",
                    size: 24,
                    color: "black",
                  },
                  item: "Settings",
                  action: null,
                },
                {
                  icon: {
                    library: "Entypo",
                    name: "back-in-time",
                    size: 24,
                    color: "black",
                  },
                  item: "Archive",
                  action: null,
                },
                {
                  icon: {
                    library: "MaterialCommunityIcons",
                    name: "progress-clock",
                    size: 24,
                    color: "black",
                  },
                  item: "Your Activity",
                  action: null,
                },
                {
                  icon: {
                    library: "AntDesign",
                    name: "logout",
                    size: 24,
                    color: "black",
                  },
                  item: "Signout",
                  action: () => auth().signOut(),
                },
              ],
            });
            dispatch({ type: "OPEN_DRAWER" });
          }}
        />
      </View>
    </View>
  );
};

export default React.memo(ProfileHeader);

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});
