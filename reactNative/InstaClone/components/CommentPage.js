import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  FlatList,
} from "react-native";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import crashlytics from "@react-native-firebase/crashlytics";

const CommentItem = ({ item, index }) => {
  if (index == 0) return <View style={styles.mainPost}></View>;
  else return <View style={styles.comment}></View>;
};

const CommentPage = ({ navigation, route }) => {
  const { author, caption, comments } = route.params;
  const { user } = useSelector((state) => state);
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={CommentItem}
      />

      <View style={styles.inputRow}>
        <Image source={{ uri: user.Photo }} style={styles.userPic} />
        <TextInput placeholder={`Comment as ${user.Username}...`} />
        <Text style={styles.postButton}>Post</Text>
      </View>
    </SafeAreaView>
  );
};

export default CommentPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  userPic: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  postButton: {
    color: "#1890ff",
  },
  mainPost: {},
  comment: {},
});
