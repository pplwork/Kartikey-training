import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, View, Image, Dimensions, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as _ from "lodash";

import { createThumbnail } from "react-native-create-thumbnail";

import Analytics from "@react-native-firebase/analytics";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import crashlytics from "@react-native-firebase/crashlytics";
import { useSelector } from "react-redux";

const win = Dimensions.get("window");

const ProfileGrid = ({ navigation }) => {
  const [gridContent, setGridContent] = useState([]);
  const isMounted = useRef(true);
  const { user } = useSelector((state) => state);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    (async () => {
      let posts;
      try {
        posts = await Promise.all(
          user.Posts.map(async (post_id) => {
            let data;
            try {
              data = (
                await firestore().collection("posts").doc(post_id).get()
              ).data();
            } catch (err) {
              crashlytics().recordError(err);
              console.log("ProfileGrid.js : ", err);
              return;
            }
            const length = data.content.length;
            let thumbnail;
            try {
              thumbnail = await storage()
                .refFromURL(data.content[0].source)
                .getDownloadURL();
            } catch (err) {
              crashlytics().recordError(err);
              console.log("ProfileGrid.js : ", err);
              return;
            }
            try {
              if (data.content[0].type == "video")
                thumbnail = (await createThumbnail({ url: thumbnail })).path;
            } catch (err) {
              crashlytics().recordError(err);
              console.log("ProfileGrid.js : ", err);
              return;
            }
            const type = length > 1 ? "stack" : data.content[0].type;
            return {
              type,
              source: thumbnail,
              id: post_id,
            };
          })
        );
      } catch (err) {
        crashlytics().recordError(err);
        console.log("ProfileGrid.js : ", err);
        return;
      }
      setGridContent(posts);
    })();
  }, [user.Posts]);

  const imageOpened = useCallback((post_id) => {
    Analytics().logEvent("UserProfileGridImageOpened");
    navigation.dangerouslyGetParent().navigate("Post", { id: post_id });
  }, []);

  const rows = _.chunk(gridContent, 3);

  return (
    <View>
      <View style={styles.gridContainer}>
        {rows.map((item, index) => {
          return (
            <View style={styles.gridRow} key={index}>
              <View style={styles.gridImageContainer}>
                <Pressable
                  onPress={() => {
                    imageOpened(item[0].id);
                  }}
                >
                  <Image
                    source={{ uri: item[0] && item[0].source }}
                    style={styles.gridImage}
                  />
                </Pressable>
                <View style={{ position: "absolute", right: 8, top: 8 }}>
                  {item[0] && item[0].type == "video" ? (
                    <FontAwesome5 name="play" size={14} color="white" />
                  ) : (
                    false
                  )}
                  {item[0] && item[0].type == "stack" ? (
                    <Image
                      source={require("../assets/icons/carousel.png")}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    false
                  )}
                  {item[0] && item[0].type == "reel" ? (
                    <Image
                      source={require("../assets/icons/reel-white.png")}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    false
                  )}
                </View>
              </View>
              <View
                style={{
                  ...styles.gridImageContainer,
                  marginHorizontal: 3,
                }}
              >
                <Pressable
                  onPress={() => {
                    imageOpened(item[1].id);
                  }}
                >
                  <Image
                    source={{ uri: item[1] && item[1].source }}
                    style={styles.gridImage}
                  />
                </Pressable>
                <View style={{ position: "absolute", right: 8, top: 8 }}>
                  {item[1] && item[1].type == "video" ? (
                    <FontAwesome5 name="play" size={14} color="white" />
                  ) : (
                    false
                  )}
                  {item[1] && item[1].type == "stack" ? (
                    <Image
                      source={require("../assets/icons/carousel.png")}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    false
                  )}
                  {item[1] && item[1].type == "reel" ? (
                    <Image
                      source={require("../assets/icons/reel-white.png")}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    false
                  )}
                </View>
              </View>
              <View style={styles.gridImageContainer}>
                <Pressable onPress={() => imageOpened(item[2].id)}>
                  <Image
                    source={{ uri: item[2] && item[2].source }}
                    style={styles.gridImage}
                  />
                </Pressable>
                <View style={{ position: "absolute", right: 8, top: 8 }}>
                  {item[2] && item[2].type == "video" ? (
                    <FontAwesome5 name="play" size={14} color="white" />
                  ) : (
                    false
                  )}
                  {item[2] && item[2].type == "stack" ? (
                    <Image
                      source={require("../assets/icons/carousel.png")}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    false
                  )}
                  {item[2] && item[2].type == "reel" ? (
                    <Image
                      source={require("../assets/icons/reel-white.png")}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    false
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default React.memo(ProfileGrid);

const styles = StyleSheet.create({
  gridContainer: {
    marginTop: 3,
    width: "100%",
    flexDirection: "column",
  },
  gridRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 3,
  },
  gridImageContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
  gridImage: {
    height: win.width / 3 - 2,
    width: win.width / 3 - 2,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
});
