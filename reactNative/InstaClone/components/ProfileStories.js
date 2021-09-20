import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Modal,
  Dimensions,
  Pressable,
  TextInput,
} from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";
import Carousel from "react-native-snap-carousel";

import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import colors from "../constants/colors";

import crashlytics from "@react-native-firebase/crashlytics";
import { useSelector } from "react-redux";
import * as Progress from "react-native-progress";

import { Video } from "expo-av";

import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

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

const StoryRenderItem = ({ item, index, carouselRef, carouselIndex }) => {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => (isMounted.current = false);
  }, []);
  const videoRefs = useRef({});
  const [curIndex, setCurIndex] = useState(0);
  const [progressBar, setProgressBar] = useState([]);
  const { user } = useSelector((state) => state);
  useEffect(() => {
    setProgressBar(new Array(item.length).fill(0));
  }, []);
  useEffect(() => {
    // if current item is not visible
    if (index != carouselIndex) {
      for (const key in videoRefs.current) {
        videoRefs.current[key] ? videoRefs.current[key].pauseAsync() : null;
      }
    } else {
      videoRefs.current[curIndex]
        ? videoRefs.current[curIndex].playAsync()
        : null;
    }
  }, [carouselIndex, curIndex]);
  return (
    <View style={styles.storyModalContainer}>
      <Pressable
        style={{ flex: 1 }}
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
            if (curIndex == item.length - 1)
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
            {item[curIndex].content.type == "image" ? (
              <Image
                source={{ uri: item[curIndex].content.source }}
                resizeMode="contain"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Video
                ref={(ref) => (videoRefs.current[curIndex] = ref)}
                resizeMode="contain"
                isLooping={false}
                isMuted={false}
                source={{ uri: item[curIndex].content.source }}
                style={{ height: "100%", width: "100%" }}
              />
            )}
          </View>
          <View style={styles.progressBars}>
            {item.map((story, index) => {
              return (
                <Progress.Bar
                  key={index}
                  unfilledColor="#888888"
                  height={2}
                  progress={progressBar[index]}
                  width={win.width / item.length - 8}
                  color="#fff"
                  borderWidth={0}
                />
              );
            })}
          </View>
          <View style={styles.userDetails}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: user.Photo }}
                resizeMode="cover"
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 30,
                }}
              />
              <Text style={{ color: "#fff", marginLeft: 10 }}>
                {user.Username}
              </Text>
              <Text style={{ color: "#fff", fontSize: 12, marginLeft: 10 }}>
                {timeFormatter(item[curIndex].createdAt)}
              </Text>
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
};

const ProfileStories = ({ navigation }) => {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);
  const carouselRef = useRef(null);
  const { user } = useSelector((state) => state);
  const [stories, setStories] = useState([]);
  const [storyVisible, setStoryVisible] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
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
              let thumbnail;
              if (data.content.type == "video")
                thumbnail = (await createThumbnail({ url: uri })).path;
              else thumbnail = uri;
              return {
                ...data,
                content: {
                  source: uri,
                  type: data.content.type,
                  thumbnail,
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

      let grouped = [];
      while (str.length) {
        grouped.push(
          str.filter((story) => {
            return (
              story.createdAt.toDate().toLocaleDateString() ==
              str[0].createdAt.toDate().toLocaleDateString()
            );
          })
        );
        str = str.filter(
          (story) =>
            story.createdAt.toDate().toLocaleDateString() !=
            str[0].createdAt.toDate().toLocaleDateString()
        );
      }
      if (isMounted.current) setStories(grouped);
    })();
  }, [user]);
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = useCallback(({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          setCarouselIndex(index);
          setStoryVisible(true);
        }}
      >
        <View style={styles.storyImgLabelContainer}>
          <View style={styles.storyImgContainer}>
            <Image
              source={{ uri: item[0].content.thumbnail }}
              style={styles.storyImage}
            />
          </View>
          <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: 12 }}>
            {item[0].createdAt.toDate().toLocaleDateString()}
          </Text>
        </View>
      </Pressable>
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
      <Modal
        visible={storyVisible}
        style={styles.storyModal}
        onRequestClose={() => setStoryVisible(false)}
        animationType="fade"
        transparent={true}
        onShow={() => {
          carouselRef.current.snapToItem(carouselIndex);
        }}
      >
        <Carousel
          ref={(ref) => (carouselRef.current = ref)}
          data={stories}
          renderItem={(props) => (
            <StoryRenderItem
              {...props}
              carouselRef={carouselRef}
              carouselIndex={carouselIndex}
            />
          )}
          onSnapToItem={(index) => setCarouselIndex(index)}
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
  storyModal: {
    height: win.height,
    width: win.width,
    borderWidth: 2,
    borderColor: "red",
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
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    position: "absolute",
    top: 16,
    left: 0,
  },
  userDetails: {
    width: "100%",
    paddingHorizontal: 10,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    top: 40,
    position: "absolute",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
