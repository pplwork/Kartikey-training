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
import { storage, db } from "../firebase";

const win = Dimensions.get("window");

const ReelsScreen = () => {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [reelData, setReelData] = useState([]);
  const [height, setHeight] = useState(win.height);
  const [curItem, setCurItem] = useState(0);
  useEffect(() => {
    (async () => {
      let docs = await db.collection("reels").get();
      docs = docs.docs;
      for (const doc of docs) {
        let data = doc.data();
        data.uri = await storage.refFromURL(data.reel).getDownloadURL();
        data.userURI = await storage
          .refFromURL(data.userImage)
          .getDownloadURL();
        data.songOwnerURI = await storage
          .refFromURL(data.songOwnerImage)
          .getDownloadURL();
        if (isMounted.current) setReelData((prev) => [...prev, data]);
      }
    })();
  }, []);
  const heightHandler = useCallback((event) => {
    setHeight(event.nativeEvent.layout.height);
  }, []);
  const curItemHandler = useCallback(
    (e) => {
      setCurItem(Math.ceil(e.nativeEvent.contentOffset.y / height));
    },
    [height]
  );
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = useCallback(
    ({ item, index }) => {
      return <Reel {...item} height={height} index={index} curItem={curItem} />;
    },
    [height, curItem]
  );
  return (
    <SafeAreaView style={styles.container} onLayout={heightHandler}>
      <FlatList
        onScroll={curItemHandler}
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
        <SimpleLineIcons name="camera" size={24} color={colors.white} />
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
