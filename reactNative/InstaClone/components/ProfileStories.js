import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";

import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import colors from "../constants/colors";

import crashlytics from "@react-native-firebase/crashlytics";
import { useSelector } from "react-redux";

const ProfileStories = () => {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const { user } = useSelector((state) => state);
  const [stories, setStories] = useState([]);
  useEffect(() => {
    (async () => {
      let str = [];
      try {
        str = await Promise.all(
          user.Stories.map(async (story) => {
            try {
              let data;
              try {
                data = (
                  await firestore().collection("stories").doc(story).get()
                ).data();
              } catch (err) {
                crashlytics().recordError(err);
                console.log("ProfileStories.js : ", err);
                return;
              }
              let uri;
              try {
                uri = await storage()
                  .refFromURL(data.content.source)
                  .getDownloadURL();
              } catch (err) {
                crashlytics().recordError(err);
                console.log("ProfileStories.js : ", err);
                return;
              }
              if (data.content.type == "video")
                uri = (await createThumbnail({ url: uri })).path;
              return {
                ...data,
                content: {
                  source: uri,
                  type: data.content.type,
                },
              };
            } catch (err) {
              crashlytics().recordError(err);
              console.log("ProfileStories.js : ", err);
              return;
            }
          })
        );
      } catch (err) {
        crashlytics().recordError(err);
        console.log("ProfileStories.js : ", err);
        return;
      }
      console.log(str);
      if (isMounted.current) setStories(str);
    })();
  }, []);
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = useCallback(({ item }) => {
    return (
      <View style={styles.storyImgLabelContainer}>
        <View style={styles.storyImgContainer}>
          <Image
            source={{ uri: item.content.source }}
            style={styles.storyImage}
          />
        </View>
        <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: 12 }}>
          {item.createdAt.toDate().toLocaleDateString()}
        </Text>
      </View>
    );
  }, []);
  return (
    <>
      <View style={{ width: "95%" }}>
        <Text style={{ fontWeight: "bold" }}>Story Highlights</Text>
      </View>
      <View style={styles.storyContainer}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal={true}
          data={stories}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </View>
    </>
  );
};

export default React.memo(ProfileStories);

const styles = StyleSheet.create({
  storyContainer: {
    width: "100%",
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 0.5,
  },
  storyImgLabelContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    marginHorizontal: 8,
  },
  storyImgContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    height: 65,
    borderWidth: 1,
    borderRadius: 70,
    borderColor: "rgba(0,0,0,0.0975)",
  },
  storyImage: {
    borderRadius: 50,
    height: 60,
    width: 60,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.0975)",
  },
});
