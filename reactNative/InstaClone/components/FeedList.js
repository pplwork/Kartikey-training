import { useIsFocused } from "@react-navigation/native";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import FeedCard from "./FeedCard";
import colors from "../constants/colors";
import HomeStories from "./HomeStories";
import { storage, db } from "../firebase";

const FeedList = ({ scrollHandler }) => {
  const isMounted = useRef(true);
  const [feed, setFeed] = useState([]);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    (async () => {
      console.time("gettingFeed");
      let home_feed = await db.collection("homeFeed").get();
      console.timeEnd("gettingFeed");
      home_feed = home_feed.docs;
      for (const doc of home_feed) {
        let data = doc.data();
        console.time("gettingLogo");
        data.logo = await storage.refFromURL(data.logo).getDownloadURL();
        console.timeEnd("gettingLogo");
        for (let i = 0; i < data.content.length; ++i) {
          console.time("gettingContentSource");
          data.content[i].source = await storage
            .refFromURL(data.content[i].source)
            .getDownloadURL();
          console.timeEnd("gettingContentSource");
        }
        if (isMounted.current) setFeed((prev) => [...prev, data]);
      }
    })();
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
      if (index == 0) return <HomeStories />;
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
