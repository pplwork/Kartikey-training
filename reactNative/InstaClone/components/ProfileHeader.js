import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons, FontAwesome, Entypo } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";

import Modal from "react-native-modalbox";
import { useSelector } from "react-redux";

const ProfileHeader = () => {
  const modalRef = useRef(null);
  const { user } = useSelector((state) => state);
  return (
    <>
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
            name="plus-square-o"
            size={24}
            color="black"
            style={{ marginHorizontal: 20 }}
          />
          <FontAwesome
            name="bars"
            size={24}
            color="black"
            onPress={() => modalRef.current.open()}
          />
        </View>
      </View>
      <Modal
        ref={modalRef}
        swipeToClose={true}
        position="bottom"
        backdropPressToClose={true}
        backdropColor="black"
        backdropOpacity={0.2}
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 100,
        }}
      >
        <View style={{ backgroundColor: "red" }}>
          <Text onPress={() => auth().signOut()}>Logout</Text>
        </View>
      </Modal>
    </>
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
