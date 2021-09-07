import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";

import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import colors from "../constants/colors";

import crashlytics from "@react-native-firebase/crashlytics";
import perf from "@react-native-firebase/perf";
import { useSelector } from "react-redux";

const ProfileStories = () => {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const { user } = useSelector((state) => state.user);
  const [stories, setStories] = useState([]);
  useEffect(() => {
    // (async () => {
    //   Promise.all(
    //     user.Stories.map(async (story) => {
    //       let Stories = [];
    //       try {
    //         Stories = await Promise.all(
    //           Stories.map(async (story) => {
    //             let data;
    //             try {
    //               data = (
    //                 await firestore().collection("stories").doc(story).get()
    //               ).data();
    //             } catch (err) {
    //               crashlytics().recordError(err);
    //             }
    //             let uri = await storage()
    //               .refFromURL(data.content.source)
    //               .getDownloadURL();
    //             return {
    //               ...data,
    //               content: {
    //                 source: uri,
    //                 type: data.content.type,
    //               },
    //             };
    //           })
    //         );
    //       } catch (err) {
    //         crashlytics().recordError(err);
    //       }
    //     })
    //   );
    // })();

    (async () => {
      let docs,
        data = [];
      const trace = await perf().startTrace("Fetching Profile Stories Data");
      crashlytics().log("Fetching Profile stories data");
      try {
        docs = await firestore().collection("profileStories").get();
        data = docs.docs.map((doc) => doc.data());
      } catch (err) {
        crashlytics().recordError(err);
      }
      crashlytics().log("Resolving Profile Story image urls");
      data.forEach((doc) => {
        storage()
          .refFromURL(doc.photo)
          .getDownloadURL()
          .then((uri) => {
            if (isMounted.current)
              setStories((prev) => [
                ...prev,
                {
                  ...doc,
                  photo: uri,
                },
              ]);
          })
          .catch((err) => {
            crashlytics.recordError(err);
          });
      });
      await trace.stop();
    })().catch((err) => crashlytics().recordError(err));
  }, []);
  const keyExtractor = useCallback((item) => item.id.toString(), []);
  const renderItem = useCallback((itemData) => {
    return (
      <View style={styles.storyImgLabelContainer}>
        <View style={styles.storyImgContainer}>
          <Image
            source={{ uri: itemData.item.photo }}
            style={styles.storyImage}
          />
        </View>
        <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: 12 }}>
          {itemData.item.name}
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
