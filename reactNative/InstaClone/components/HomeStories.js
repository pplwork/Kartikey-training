import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Analytics from "@react-native-firebase/analytics";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import crashlytics from "@react-native-firebase/crashlytics";

import colors from "../constants/colors";

const win = Dimensions.get("window");

const HomeStories = () => {
  const isMounted = useRef(true);
  const [userIMG, setUserIMG] = useState();
  const [stories, setStories] = useState([]);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    crashlytics().log("Fetching User Photo on home screen");
    firestore()
      .collection("user")
      .where("Username", "==", "benbenabraham")
      .get()
      .then((snapshot) => {
        let doc = snapshot.docs[0].data();
        storage()
          .refFromURL(doc.Photo)
          .getDownloadURL()
          .then((uri) => {
            if (isMounted.current) setUserIMG(uri);
          })
          .catch((err) => crashlytics().recordError(err));
      })
      .catch((err) => {
        crashlytics().recordError(err);
      });
    (async () => {
      let docs,
        str = [];
      crashlytics().log("Fetching stories on home page");
      try {
        docs = await firestore().collection("stories").get();
        str = docs.docs.map((doc) => doc.data());
        str.unshift();
      } catch (err) {
        crashlytics().recordError(err);
      }
      crashlytics().log("Resolving story image urls home screen");
      // start all requests and set states as data keeps coming in
      str
        .forEach((story) => {
          storage()
            .refFromURL(story.photo)
            .getDownloadURL()
            .then((url) => {
              if (isMounted.current)
                setStories((prev) => [
                  ...prev,
                  {
                    ...story,
                    photo: url,
                  },
                ]);
            });
        })
        .catch((err) => {
          crashlytics().recordError(err);
        });
    })().catch((err) => {
      crashlytics().recordError(err);
    });
  }, []);
  const logStoryImageOpened = useCallback(() => {
    Analytics().logEvent("StoryOpened");
  }, []);
  const keyExtractor = useCallback((item) => item.id.toString(), []);
  const renderItem = useCallback((itemData) => {
    return (
      <View style={styles.storyImgLabelContainer}>
        <Pressable onPress={logStoryImageOpened}>
          <LinearGradient
            colors={["#DD2A7B", "#F58529"]}
            style={styles.outlineGradient}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: itemData.item.photo }}
                style={styles.storyImage}
              />
            </View>
          </LinearGradient>
        </Pressable>
        <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: 12 }}>
          {itemData.item.name}
        </Text>
      </View>
    );
  }, []);
  return (
    <View style={styles.storyContainer}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal={true}
        data={[{ id: 1, name: "Your Story", photo: userIMG }, ...stories]}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
};

export default React.memo(HomeStories);

const styles = StyleSheet.create({
  storyContainer: {
    width: win.width,
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
