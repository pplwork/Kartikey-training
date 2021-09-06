import React from "react";
import { StyleSheet, Text, View } from "react-native";
import "./FeedCard";

const Post = ({ route, navigation }) => {
  const { Post } = route.params;
  return (
    <View style={styles.container}>
      <FeedCard {...route.params} index={0} curIndex={0} isFocused={true} />
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
