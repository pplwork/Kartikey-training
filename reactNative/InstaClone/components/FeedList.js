import { useIsFocused } from "@react-navigation/native";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import FeedCard from "./FeedCard";
import colors from "../constants/colors";
import HomeStories from "./HomeStories";

import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import crashlytics from "@react-native-firebase/crashlytics";
import { useSelector } from "react-redux";

const FeedList = ({ scrollHandler, navigation }) => {
  const isMounted = useRef(true);
  const [feed, setFeed] = useState([]);
  const { user } = useSelector((state) => state);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    // get list of all users that we are following
    (async () => {
      let { Following } = user;
      let data = [];
      let promise_array = [];
      for (const uid of Following) {
        let pfpuri = "";
        let pfplink = "";
        try {
          pfplink = (
            await firestore().collection("users").doc(uid).get()
          ).data().Photo;
        } catch (err) {
          crashlytics().recordError(err);
          console.log("FeedList.js : ", err);
          return;
        }
        try {
          pfpuri = await storage().refFromURL(pfplink).getDownloadURL();
        } catch (err) {
          crashlytics().recordError(err);
          console.log("FeedList.js : ", err);
          return;
        }
        promise_array.push(
          firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((doc) => {
              const { Posts } = doc.data();
              let post_promise_array = [];
              Posts.forEach((uid) => {
                post_promise_array.push(
                  firestore()
                    .collection("posts")
                    .doc(uid)
                    .get()
                    .then((post) => {
                      let stuff = post.data();
                      stuff.id = uid;
                      stuff.author = {
                        uid: stuff.author,
                        Username: doc.data().Username,
                        Photo: pfpuri,
                      };
                      data.push(stuff);
                    })
                    .catch((err) => {
                      crashlytics().recordError(err);
                      console.log("FeedList.js : ", err);
                    })
                );
              });
              return Promise.all(post_promise_array);
            })
            .catch((err) => {
              crashlytics().recordError(err);
              console.log("FeedList.js : ", err);
            })
        );
      }
      try {
        await Promise.all(promise_array);
      } catch (err) {
        crashlytics().recordError(err);
        console.log("FeedList.js : ", err);
        return;
      }
      data.sort((a, b) => {
        if (a.createdAt.seconds < b.createdAt.seconds) return 1;
        else return -1;
      });
      try {
        data = await Promise.all(
          data.map(async (post) => {
            let { content } = post;
            for (let i = 0; i < content.length; ++i) {
              try {
                content[i].source = await storage()
                  .refFromURL(content[i].source)
                  .getDownloadURL();
              } catch (err) {
                crashlytics().recordError(err);
                console.log("FeedList.js : ", err);
              }
            }
            return {
              ...post,
              content,
            };
          })
        );
      } catch (err) {
        crashlytics().recordError(err);
        console.log("FeedList.js : ", err);
        return;
      }
      if (isMounted.current) setFeed(data);
    })();
  }, [user.Following]);

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
          navigation={navigation.dangerouslyGetParent()}
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
