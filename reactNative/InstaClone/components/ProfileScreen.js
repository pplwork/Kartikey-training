import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Ionicons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import colors from "../constants/colors";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="md-lock-closed-outline" size={20} color="black" />
          <Text
            style={{ fontSize: 22, fontWeight: "bold", marginHorizontal: 10 }}
          >
            benbenabraham
          </Text>
          <FontAwesome5 name="caret-down" size={20} color="black" />
        </View>
        <View style={styles.headerRight}>
          <FontAwesome
            name="plus-square-o"
            size={24}
            color="black"
            style={{ marginHorizontal: 20 }}
          />
          <FontAwesome name="bars" size={24} color="black" />
        </View>
      </View>
      <ScrollView>
        <View style={styles.profile}>
          <View style={styles.profileLeft}></View>
          <View style={styles.profileRight}></View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.white,
  },
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
  profile: {
    flexDirection: "row",
  },
});
