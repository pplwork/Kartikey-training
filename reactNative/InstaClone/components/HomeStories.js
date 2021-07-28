import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { storage, db } from "../firebase";
import colors from "../constants/colors";

const HomeStories = () => {
  const isMounted = useRef(true);
  const [stories, setStories] = useState([]);
  const [storyImages, setStoryImages] = useState({});
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    (async () => {
      console.time("gettingStories");
      let docs = await db.collection("stories").get();
      console.timeEnd("gettingStories");
      docs = docs.docs;
      let str = [];
      for (const doc of docs) {
        str.push(doc.data());
      }
      if (isMounted.current) setStories(str);
      for (const doc of docs) {
        console.time("gettingImage");
        let url = await storage.refFromURL(doc.data().photo).getDownloadURL();
        console.timeEnd("gettingImage");
        if (isMounted.current)
          setStoryImages((prev) => ({
            ...prev,
            [doc.data().id]: url,
          }));
      }
    })();
  }, []);
  return (
    <View style={styles.storyContainer}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
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
                    source={{ uri: storyImages[itemData.item.id] }}
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
};

export default React.memo(HomeStories);

const styles = StyleSheet.create({
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
  outlineGradient: {
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 70,
    transform: [
      {
        rotateZ: "30deg",
      },
    ],
  },
});
