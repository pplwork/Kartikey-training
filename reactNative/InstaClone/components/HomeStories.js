import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "react-native-snap-carousel";
import * as Progress from "react-native-progress";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import Analytics from "@react-native-firebase/analytics";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import crashlytics from "@react-native-firebase/crashlytics";
import perf from "@react-native-firebase/perf";
import auth from "@react-native-firebase/auth";

import colors from "../constants/colors";
import { useSelector } from "react-redux";
import { TextInput } from "react-native-gesture-handler";
import { Video } from "expo-av";
import AutoHeightImage from "react-native-auto-height-image";

const win = Dimensions.get("window");

const timeFormatter = (createdAt) => {
  const seconds = Math.floor((Date.now() - createdAt.toDate()) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  else return createdAt.toDate().toDateString();
};

const HomeStories = ({ navigation }) => {
  const isMounted = useRef(true);
  const carouselRef = useRef(null);
  const [stories, setStories] = useState([]);
  const [storyVisible, setStoryVisible] = useState(false);
  const { user } = useSelector((state) => state);
  useEffect(() => {
    return () => {
      navigation.setOptions({
        tabBarVisible: true,
      });
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: !storyVisible,
    });
  }, [storyVisible]);
  useEffect(() => {
    (async () => {
      // get story data of all followed users
      let storydata = await Promise.all(
        user.Following.map(async (following) => {
          let userdata,
            Stories = [],
            Username = "",
            Photo = "";
          try {
            userdata = (
              await firestore().collection("users").doc(following).get()
            ).data();
            Photo = await storage().refFromURL(userdata.Photo).getDownloadURL();
            Stories = userdata.Stories;
            Username = userdata.Username;
          } catch (err) {
            crashlytics().recordError(err);
          }
          try {
            Stories = await Promise.all(
              Stories.map(async (story) => {
                let data;
                try {
                  data = (
                    await firestore().collection("stories").doc(story).get()
                  ).data();
                  if (
                    !(
                      Math.round(Date.now() / 1000) - data.createdAt.seconds <=
                      86400
                    )
                  )
                    return undefined;
                } catch (err) {
                  crashlytics().recordError(err);
                }
                let uri = await storage()
                  .refFromURL(data.content.source)
                  .getDownloadURL();
                return {
                  ...data,
                  content: {
                    source: uri,
                    type: data.content.type,
                  },
                };
              })
            );
            Stories = Stories.filter((story) => story != undefined);
          } catch (err) {
            crashlytics().recordError(err);
          }
          return {
            Username,
            Stories,
            Photo,
          };
        })
      );
      // storydata = storydata.filter((e) => e.Stories && e.Stories.length > 0);
      if (isMounted.current) setStories(storydata);
    })();
  }, [user]);
  const StoryImageOpened = useCallback(
    (index) => {
      if (index == 0) {
        navigation.navigate("AddStoryScreen");
        Analytics().logEvent("AddStoryOpened");
      } else {
        setStoryVisible(true);
        Analytics().logEvent("StoryOpened");
      }
    },
    [navigation]
  );
  const storyRenderItem = useCallback(({ item, index }) => {
    const [curIndex, setCurIndex] = useState(0);
    const [progressBar, setProgressBar] = useState([]);
    useEffect(() => {
      setProgressBar(new Array(item.Stories.length).fill(0));
    }, []);
    return (
      <View style={styles.storyModalContainer}>
        <Pressable
          onPress={(e) => {
            let x = e.nativeEvent.locationX;
            // tapped on 20% of left side
            if (x < win.width / 5) {
              // if i am on first item
              if (curIndex == 0) return carouselRef.current.snapToPrev();
              setProgressBar((prev) => {
                let t = prev;
                t[curIndex] = 0;
                t[curIndex - 1] = 0;
                return t;
              });
              setCurIndex((prev) => prev - 1);
            }
            // tapped on more than 20% of left side
            else {
              // if i am on last item
              if (curIndex == item.Stories.length - 1)
                return carouselRef.current.snapToNext();
              setProgressBar((prev) => {
                let t = prev;
                t[curIndex] = 1;
                return t;
              });
              setCurIndex((prev) => prev + 1);
            }
          }}
        >
          <View style={styles.storyContent}>
            <View style={styles.mainContent}>
              {item.Stories[curIndex].content.type == "image" ? (
                <Image
                  source={{ uri: item.Stories[curIndex].content.source }}
                  resizeMode="contain"
                  style={{ width: win.width }}
                />
              ) : (
                <Video
                  resizeMode="contain"
                  shouldPlay={true}
                  isLooping={false}
                  isMuted={false}
                  source={{ uri: item.Stories[curIndex].content.source }}
                />
              )}
            </View>
            <View style={styles.progressBars}>
              {item.Stories.map((story, index) => {
                return (
                  <Progress.Bar
                    unfilledColor="#888888"
                    height={2}
                    progress={progressBar[index]}
                    width={win.width / item.Stories.length - 8}
                    color="#fff"
                    borderWidth={0}
                  />
                );
              })}
            </View>
            <View style={styles.userDetails}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{ uri: item.Photo }}
                  resizeMode="cover"
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 30,
                  }}
                />
                <Text style={{ color: "#fff", marginLeft: 10 }}>
                  {item.Username}
                </Text>
                <Text>{timeFormatter(item.Stories[curIndex].createdAt)}</Text>
              </View>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={28}
                color="#fff"
              />
            </View>
          </View>
        </Pressable>
        <View style={styles.storyCommentField}>
          <TextInput
            multiline
            placeholder="Send message"
            placeholderTextColor="#dfdfdf"
            style={{
              borderWidth: 1,
              borderColor: "#fff",
              color: "#fff",
              flex: 1,
              borderRadius: 1000,
              marginRight: 22,
              paddingHorizontal: 20,
              paddingVertical: 5,
            }}
          />
          <Ionicons name="paper-plane-outline" size={28} color="#fff" />
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item) => item.Username, []);
  const renderItem = useCallback((itemData) => {
    if (itemData.index == 0) {
      return (
        <View style={styles.storyImgLabelContainer}>
          <Pressable onPress={() => StoryImageOpened(itemData.index)}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: itemData.item.Photo }}
                style={{
                  ...styles.storyImage,
                  transform: [{ rotateZ: "0deg" }],
                }}
              />
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 20,
                  position: "absolute",
                  backgroundColor: colors.blue,
                  bottom: 5,
                  right: 0,
                  borderWidth: 2,
                  borderColor: colors.white,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.white,
                  }}
                >
                  +
                </Text>
              </View>
            </View>
          </Pressable>
          <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: 12 }}>
            {itemData.item.Username}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.storyImgLabelContainer}>
        <Pressable onPress={() => StoryImageOpened(itemData.index)}>
          <LinearGradient
            colors={["#DD2A7B", "#F58529"]}
            style={styles.outlineGradient}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: itemData.item.Photo }}
                style={styles.storyImage}
              />
            </View>
          </LinearGradient>
        </Pressable>
        <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: 12 }}>
          {itemData.item.Username}
        </Text>
      </View>
    );
  }, []);
  return (
    <>
      <View style={styles.storyContainer}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal={true}
          data={[{ Username: "Your Story", Photo: user.Photo }, ...stories]}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </View>
      <Modal
        visible={storyVisible}
        style={styles.storyModal}
        onRequestClose={() => setStoryVisible(false)}
        animationType="fade"
        transparent={true}
      >
        <Carousel
          ref={carouselRef}
          data={stories}
          renderItem={storyRenderItem}
          sliderWidth={win.width}
          layout="default"
          itemWidth={win.width}
          sliderHeight={win.height}
          itemHeight={win.height}
        />
      </Modal>
    </>
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
  storyModal: {
    height: win.height,
    width: win.width,
  },
  storyModalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  storyContent: {
    flex: 1,
  },
  storyCommentField: {
    width: "100%",
    height: 85,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 30,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  progressBars: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 16,
  },
  userDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 16,
  },
  mainContent: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
