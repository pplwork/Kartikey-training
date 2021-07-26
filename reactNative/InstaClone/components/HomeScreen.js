import { useIsFocused } from "@react-navigation/native";
import React, { useState, useCallback, useMemo } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import FeedCard from "./FeedCard";
import colors from "../constants/colors";
import { useFonts } from "expo-font";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import stories from "../data/homestories";
import feed from "../data/homefeed";

const HomeScreen = () => {
  const [loaded] = useFonts({
    InstagramRegular: require("../assets/fonts/regular.otf"),
    InstagramBold: require("../assets/fonts/bold.otf"),
  });
  const isFocused = useIsFocused();
  const [scroll, setScroll] = useState(0);
  const [curItem, setCurItem] = useState(0);
  const feedItem = useCallback(
    ({ item, index }) => {
      if (index == 0)
        return (
          <View style={styles.storyContainer}>
            <FlatList
              horizontal={true}
              data={stories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={(itemData) => {
                return (
                  <View style={styles.storyImgLabelContainer}>
                    <LinearGradient
                      colors={["#DD2A7B", "#F58529"]}
                      style={styles.outlineGradient}
                    >
                      <View style={styles.imageContainer}>
                        <Image
                          source={itemData.item.photo}
                          style={styles.storyImage}
                        />
                      </View>
                    </LinearGradient>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={{ fontSize: 12 }}
                    >
                      {itemData.item.name}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        );
      return (
        <FeedCard
          isFocused={isFocused}
          index={index}
          curIndex={curItem}
          {...item}
        />
      );
    },
    [stories, curItem, isFocused]
  );
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const scrollHandler = useCallback((e) => {
    setScroll(e.nativeEvent.contentOffset.y);
  }, []);
  const setItem = useCallback((e) => setCurItem(e.viewableItems[0].index), []);
  if (!loaded) return null;
  return (
    <>
      <View
        style={{
          ...styles.navbar,
          borderBottomColor: scroll > 10 ? "rgba(0,0,0,0.0975)" : colors.white,
          borderBottomWidth: scroll > 10 ? 0.5 : 0,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome name="plus-square-o" size={24} color="black" />
        </View>
        <View
          style={{
            flex: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.header}>Instagram</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/icons/messenger.png")}
            style={{ height: 24, width: 24 }}
          />
        </View>
      </View>
      <View style={styles.feedContainer}>
        <FlatList
          onViewableItemsChanged={setItem}
          viewabilityConfig={{
            viewAreaCoveragePercentThreshold: 40,
          }}
          data={[{}, ...feed]}
          onScroll={scrollHandler}
          renderItem={feedItem}
          keyExtractor={keyExtractor}
        />
      </View>
    </>
  );
};

export default React.memo(HomeScreen);

const styles = StyleSheet.create({
  feedContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  navbar: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: colors.white,
    flexDirection: "row",
  },
  header: {
    fontFamily: "InstagramRegular",
    fontSize: 28,
  },
  storyContainer: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 0.5,
  },
  storyImgLabelContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    marginHorizontal: 8,
  },
  outlineGradient: {
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    transform: [
      {
        rotateZ: "30deg",
      },
    ],
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    height: 70,
    width: 70,
    borderColor: "transparent",
    borderRadius: 35,
    borderWidth: 2,
  },
  storyImage: {
    borderRadius: 50,
    height: 60,
    width: 60,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.0975)",
    transform: [
      {
        rotateZ: "-30deg",
      },
    ],
  },
});
