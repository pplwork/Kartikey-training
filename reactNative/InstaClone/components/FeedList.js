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

const FeedList = ({ scrollHandler, navigation }) => {
  const isMounted = useRef(true);
  const [feed, setFeed] = useState([]);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    (async () => {
      let home_feed,
        data = [];
      const trace = await perf().startTrace("HomeFeedList Initial Load");
      crashlytics().log("Fetching homefeed data");
      try {
        home_feed = await firestore().collection("homeFeed").get();
        data = home_feed.docs.map((doc) => doc.data());
      } catch (err) {
        crashlytics().recordError(err);
      }
      crashlytics().log("Resolving FeedCard Asset Urls");
      data
        .forEach((item) => {
          let logoContentPromises = [
            storage().refFromURL(item.logo).getDownloadURL(),
          ];
          item.content.forEach((obj) => {
            logoContentPromises.push(
              storage().refFromURL(obj.source).getDownloadURL()
            );
          });
          Promise.all(logoContentPromises).then((URIArray) => {
            for (let i = 1; i < URIArray.length; ++i)
              item.content[i - 1].source = URIArray[i];
            if (isMounted.current)
              setFeed((prev) => [
                ...prev,
                {
                  ...item,
                  logo: URIArray[0],
                  content: item.content,
                },
              ]);
          });
        })
        .catch((err) => {
          crashlytics().recordError(err);
        });
      await trace.stop();
    })().catch((err) => crashlytics().recordError(err));
  }, []);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 40,
  });
  const isFocused = useIsFocused();
  const [curItem, setCurItem] = useState(0);
  const setItem = useCallback((e) => setCurItem(e.viewableItems[0].index), []);
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
