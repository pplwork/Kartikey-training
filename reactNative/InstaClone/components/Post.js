import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FeedCard from "./FeedCard";

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
      let data = (await firestore().collection("posts").doc(id).get()).data();
      let User = (
        await firestore().collection("users").doc(data.author).get()
      ).data();
      let pfpuri = await storage().refFromURL(User.Photo).getDownloadURL();
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
        }
      }
      if (isMounted.current)
        setPost({
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
