import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
} from "react-native";
import colors from "../constants/colors";
import { SimpleLineIcons } from "@expo/vector-icons";
import Reel from "./Reel";

import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import crashlytics from "@react-native-firebase/crashlytics";
import perf from "@react-native-firebase/perf";
import { useSelector } from "react-redux";

const win = Dimensions.get("window");

const ReelsScreen = ({ navigation }) => {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);
  const [reelData, setReelData] = useState([]);
  const [height, setHeight] = useState(win.height);
  const [curItem, setCurItem] = useState(0);
  const { user } = useSelector((state) => state);
  useEffect(() => {
    (async () => {
      let docs = [],
        data = [];

      const trace = await perf().startTrace("Fetching Reels Data");
      crashlytics().log("Fetching reels data");
      try {
        docs = (await firestore().collection("reels").get()).docs;
      } catch (err) {
        crashlytics().recordError(err);
        console.log("ReelsScreen.js : ", err);
        return;
      }
      try {
        data = await Promise.all(
          docs.map(async (doc) => {
            let dt = doc.data();
            let author;
            try {
              author = await firestore()
                .collection("users")
                .doc(dt.author)
                .get();
              author = author.data();
            } catch (err) {
              crashlytics().recordError(err);
              console.log("ReelsScreen.js : ", err);
              return;
            }
            let pfpURI = "";
            try {
              pfpURI = await storage()
                .refFromURL(author.Photo)
                .getDownloadURL();
            } catch (err) {
              crashlytics().recordError(err);
              console.log("ReelsScreen.js : ", err);
              return;
            }
            let sourceURI = "";
            try {
              sourceURI = await storage()
                .refFromURL(dt.content.source)
                .getDownloadURL();
            } catch (err) {
              crashlytics().recordError(err);
              console.log("ReelsScreen.js : ", err);
              return;
            }

            return {
              id: doc.id,
              ...dt,
              author: {
                uid: dt.author,
                Username: author.Username,
                Photo: pfpURI,
              },
              content: {
                source: sourceURI,
              },
            };
          })
        );
      } catch (err) {
        crashlytics().recordError(err);
        console.log("ReelsScreen.js : ", err);
        return;
      }
      data = data.filter((e) => e != undefined);
      if (isMounted.current) setReelData(data);
      await trace.stop();
    })();
  }, []);
  const heightHandler = useCallback((event) => {
    setHeight(event.nativeEvent.layout.height);
  }, []);
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = useCallback(
    ({ item, index }) => {
      return <Reel {...item} height={height} index={index} curItem={curItem} />;
    },
    [height, curItem]
  );
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 10,
  });
  const setItem = useCallback((e) => setCurItem(e.viewableItems[0].index), []);
  return (
    <SafeAreaView style={styles.container} onLayout={heightHandler}>
      <FlatList
        onViewableItemsChanged={setItem}
        viewabilityConfig={viewabilityConfig.current}
        snapToInterval={height}
        pagingEnabled={true}
        snapToAlignment="center"
        decelerationRate="normal"
        data={reelData}
        disableIntervalMomentum
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <View style={styles.header}>
        <Text style={{ color: colors.white, fontSize: 24, fontWeight: "bold" }}>
          Reels
        </Text>
        <SimpleLineIcons
          name="camera"
          size={24}
          color={colors.white}
          onPress={() =>
            navigation.dangerouslyGetParent().navigate("AddReelScreen")
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default React.memo(ReelsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
  },
  header: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    top: 16,
  },
});
