import { useIsFocused } from "@react-navigation/native";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import FeedCard from "./FeedCard";
import colors from "../constants/colors";
import HomeStories from "./HomeStories";

import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import crashlytics from "@react-native-firebase/crashlytics";
import perf from "@react-native-firebase/perf";
import auth from "@react-native-firebase/auth";

const FeedList = ({ scrollHandler, navigation }) => {
  const isMounted = useRef(true);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    // get list of all users that we are following
    (async () => {
      const { Following } = (
        await firestore().collection("users").doc(auth().currentUser.uid).get()
      ).data();
      let data = [];
      let promise_array = [];
      console.log("Following = ", Following);
      for (const uid of Following) {
        let pfpuri = await storage()
          .refFromURL(
            `gs://instaclone-b124e.appspot.com/images/profiles/${uid}.jpg`
          )
          .getDownloadURL();
        promise_array.push(
          firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((doc) => {
              const { Posts } = doc.data();
              console.log("Posts = ", Posts);
              let post_promise_array = [];
              Posts.forEach((uid) => {
                post_promise_array.push(
                  firestore()
                    .collection("posts")
                    .doc(uid)
                    .get()
                    .then((post) => {
                      let stuff = post.data();
                      stuff.author = {
                        uid: stuff.author,
                        Username: doc.data().Username,
                        Photo: pfpuri,
                      };
                      data.push(stuff);
                    })
                );
              });
              return Promise.all(post_promise_array);
            })
        );
      }
      await Promise.all(promise_array);
      data.sort((a, b) => {
        if (a.createdAt.seconds < b.createdAt.seconds) return 1;
        else return -1;
      });
      data = await Promise.all(
        data.map(async (post) => {
          let { content } = post;
          for (let i = 0; i < content.length; ++i)
            content[i].source = await storage()
              .refFromURL(content[i].source)
              .getDownloadURL();
          return {
            ...post,
            content,
          };
        })
      );
      setFeed(data);
    })();
  }, []);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 40,
  });
  const isFocused = useIsFocused();
  const [curItem, setCurItem] = useState(0);
  const setItem = useCallback(({ viewableItems }) => {
    setCurItem((prev) => {
      if (viewableItems[0]) return viewableItems[0].index;
      else return prev;
    });
  }, []);
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const feedItem = useCallback(
    ({ item, index }) => {
      if (index == 0) return <HomeStories navigation={navigation} />;
      return (
        <FeedCard
          isFocused={isFocused}
          index={index}
          curIndex={curItem}
          {...item}
        />
      );
    },
    [curItem, isFocused]
  );
  return (
    <View style={styles.feedContainer}>
      <FlatList
        onViewableItemsChanged={setItem}
        viewabilityConfig={viewabilityConfig.current}
        data={[{}, ...feed]}
        onScroll={scrollHandler}
        renderItem={feedItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default React.memo(FeedList);

const styles = StyleSheet.create({
  feedContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.white,
  },
});
