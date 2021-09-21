import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import crashlytics from "@react-native-firebase/crashlytics";

const timeFormatter = (createdAt) => {
  const seconds = Math.floor((Date.now() - createdAt.toDate()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  else return createdAt.toDate().toDateString();
};

const CommentItem = ({ item, index, navigation }) => {
  const isMounted = useRef(true);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  useEffect(() => {
    if (item.likes && item.likes.includes(auth().currentUser.uid))
      setLiked(true);
    if (item.likes) setLikes(item.likes);
  }, [item]);

  const likeComment = async () => {
    // if was not liked
    if (!liked) {
      try {
        await firestore()
          .collection("comments")
          .doc(item.id)
          .update({
            likes: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
          });
        if (isMounted.current) {
          setLiked(true);
          setLikes((prev) => [...prev, auth().currentUser.uid]);
        }
      } catch (err) {
        crashlytics().recordError(err);
        console.log("CommentPage.JS : ", err);
      }
    } else {
      try {
        await firestore()
          .collection("comments")
          .doc(item.id)
          .update({
            likes: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
          });
        if (isMounted.current) {
          setLiked(false);
          setLikes((prev) => prev.filter((id) => id != auth().currentUser.uid));
        }
      } catch (err) {
        crashlytics().recordError(err);
        console.log("CommentPage.JS : ", err);
      }
    }
  };
  return (
    <>
      <View style={styles.comment}>
        <View style={styles.imageContainer}>
          <Image
            source={item.author.Photo ? { uri: item.author.Photo } : null}
            style={styles.userPic}
          />
        </View>
        <View style={styles.right}>
          <View style={styles.rightTop}>
            <View style={styles.rightText}>
              <Text style={styles.commentText}>
                <Text
                  style={[{ fontWeight: "bold" }, styles.commentText]}
                  onPress={() => {
                    navigation.navigate("User", { id: item.author.uid });
                  }}
                >
                  {item.author.Username}
                </Text>{" "}
                {item.content}
              </Text>
            </View>
            {index != 0 && (
              <Pressable
                onPress={likeComment}
                hitSlop={10}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <AntDesign
                  name={liked ? "heart" : "hearto"}
                  size={12}
                  color={liked ? "red" : "rgba(0,0,0,0.4)"}
                  style={styles.heartIcon}
                />
              </Pressable>
            )}
          </View>
          <View style={styles.rightInfo}>
            <Text style={styles.infoText}>{timeFormatter(item.createdAt)}</Text>
            {index != 0 && !!likes.length && (
              <Text style={styles.infoText}>
                {`${likes.length} ${likes.length > 1 ? "likes" : "like"}`}
              </Text>
            )}
            {index != 0 && <Text style={styles.infoText}>Reply</Text>}
          </View>
        </View>
      </View>
      {index == 0 && <View style={styles.divider}></View>}
    </>
  );
};

const CommentPage = ({ navigation, route }) => {
  const { author, caption, createdAt, id } = route.params;
  const { user } = useSelector((state) => state);
  const [comments, setComments] = useState(route.params.comments);
  const isMounted = useRef(true);
  const commentRef = useRef(null);
  const [post, setPost] = useState("");

  useEffect(() => {
    return () => (isMounted.current = false);
  }, []);

  const addComment = async () => {
    let cmnt;
    try {
      cmnt = await firestore().collection("comments").add({
        author: auth().currentUser.uid,
        content: post,
        createdAt: firestore.FieldValue.serverTimestamp(),
        likes: [],
        replies: [],
        post: id,
      });
    } catch (err) {
      crashlytics().recordError(err);
      console.log("CommentPage.js : ", err);
      return;
    }
    let CMNT;
    try {
      CMNT = (await cmnt.get()).data();
      CMNT.author = {
        uid: auth().currentUser.uid,
        Username: user.Username,
        Photo: user.Photo,
      };
      CMNT.id = cmnt.id;
    } catch (err) {
      crashlytics().recordError(err);
      console.log("CommentPage.js : ", err);
      return;
    }
    try {
      await firestore()
        .collection("posts")
        .doc(id)
        .update({
          comments: firestore.FieldValue.arrayUnion(cmnt.id),
        });
    } catch (err) {
      crashlytics().recordError(err);
      console.log("CommentPage.js : ", err);
      return;
    }
    if (isMounted.current) setComments((prev) => [...prev, CMNT]);
    commentRef.current.clear();
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{ width: "100%" }}
        data={[{ author, content: caption, createdAt }, ...comments]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(props) => (
          <CommentItem {...props} navigation={navigation} />
        )}
      />

      <View style={styles.inputRow}>
        <Image
          source={user.Photo ? { uri: user.Photo } : null}
          style={styles.userPic}
        />
        <TextInput
          ref={commentRef}
          multiline
          placeholder={`Comment as ${user.Username}...`}
          style={styles.inputField}
          value={post}
          onChangeText={(e) => setPost(e)}
        />
        <Text style={styles.postButton} onPress={addComment}>
          Post
        </Text>
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
    backgroundColor: "#fff",
    overflow: "hidden",
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  inputField: {
    flex: 1,
    paddingHorizontal: 15,
    minHeight: 40,
    maxHeight: 120,
  },
  postButton: {
    color: "#1890ff",
    marginBottom: 10,
  },
  comment: {
    width: "100%",
    paddingHorizontal: 15,
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "flex-start",
  },
  imageContainer: { justifyContent: "center", alignItems: "center" },
  right: {
    flex: 1,
    marginLeft: 15,
  },
  rightTop: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  rightText: { flex: 1 },
  heartIcon: { marginHorizontal: 16, marginTop: 8 },
  commentText: { fontSize: 14 },
  rightInfo: { flexDirection: "row" },
  infoText: { fontSize: 10, color: "rgba(0,0,0,0.4)", marginRight: 10 },
  divider: { height: 0.2, width: "100%", backgroundColor: "rgba(0,0,0,0.4)" },
});
