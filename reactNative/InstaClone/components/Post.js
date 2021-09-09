import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FeedCard from "./FeedCard";

import crashlytics from "@react-native-firebase/crashlytics";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { ScrollView } from "react-native-gesture-handler";

const Post = ({ route, navigation }) => {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => (isMounted.current = false);
  });
  const [Post, setPost] = useState(null);
  const { id } = route.params;
  useEffect(() => {
    (async () => {
      let data;
      try {
        data = (await firestore().collection("posts").doc(id).get()).data();
      } catch (err) {
        crashlytics().recordError(err);
        return;
      }

      let User;
      try {
        User = (
          await firestore().collection("users").doc(data.author).get()
        ).data();
      } catch (err) {
        crashlytics().recordError(err);
        return;
      }

      let pfpuri;
      try {
        pfpuri = await storage().refFromURL(User.Photo).getDownloadURL();
      } catch (err) {
        crashlytics().recordError(err);
        return;
      }
      data.author = {
        uid: data.author,
        Username: User.Username,
        Photo: pfpuri,
      };
      let { content } = data;
      for (let i = 0; i < content.length; ++i) {
        try {
          content[i].source = await storage()
            .refFromURL(content[i].source)
            .getDownloadURL();
        } catch (err) {
          crashlytics().recordError(err);
          return;
        }
      }
      if (isMounted.current)
        setPost({
          id,
          ...data,
          content,
        });
    })();
  }, []);
  return (
    <ScrollView style={styles.container}>
      {Post && <FeedCard {...Post} index={0} curIndex={0} isFocused={true} />}
    </ScrollView>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
