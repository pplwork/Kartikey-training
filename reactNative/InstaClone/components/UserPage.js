import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Pressable,
  SafeAreaView,
  Modal,
  TextInput,
} from "react-native";

import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import crashlytics from "@react-native-firebase/crashlytics";
import Analytics from "@react-native-firebase/analytics";

import colors from "../constants/colors";

import { createThumbnail } from "react-native-create-thumbnail";

import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { Video } from "expo-av";
import Carousel from "react-native-snap-carousel";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import * as _ from "lodash";

const parseThis = (num) => {
  if (num == undefined) return 0;
  if (num < 9999)
    return Number(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return `${(num / 1000).toFixed(1)}K`;
};

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
    isMounted.current = true;
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
                source={
                  item[curIndex].content.source
                    ? { uri: item[curIndex].content.source }
                    : null
                }
                resizeMode="contain"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Video
                ref={(ref) => (videoRefs.current[curIndex] = ref)}
                resizeMode="contain"
                isLooping={false}
                isMuted={false}
                source={
                  item[curIndex].content.source
                    ? { uri: item[curIndex].content.source }
                    : null
                }
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
                source={user.Photo ? { uri: user.Photo } : null}
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

const UserListCard = ({ id, navigation }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isFollowed, setIsFollowed] = useState(false);
  const [pfp, setPFP] = useState("");
  const isMounted = useRef(true);
  const { user } = useSelector((state) => state);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  useEffect(() => {
    (async () => {
      let data;
      try {
        data = (await firestore().collection("users").doc(id).get()).data();
      } catch (err) {
        crashlytics().recordError(err);
        console.log("ProfileInfo.js : ", err);
        return;
      }
      if (isMounted.current) {
        setName(data.Name);
        setUsername(data.Username);
        if (user.Following.includes(id)) setIsFollowed(true);
        else setIsFollowed(false);
      }
      let uri = "";
      try {
        uri = await storage().refFromURL(data.Photo).getDownloadURL();
      } catch (err) {
        crashlytics().recordError(err);
        console.log("ProfileInfo.js : ", err);
        return;
      }
      if (isMounted.current) setPFP(uri);
    })();
  }, [user.Following]);
  const followHandler = async () => {
    if (isFollowed) {
      try {
        await firestore()
          .collection("users")
          .doc(auth().currentUser.uid)
          .update({
            Following: firestore.FieldValue.arrayRemove(id),
          });
      } catch (err) {
        crashlytics().recordError(err);
        console.log("ProfileInfo.js : ", err);
        return;
      }
      if (isMounted.current) setIsFollowed(false);
    } else {
      try {
        await firestore()
          .collection("users")
          .doc(auth().currentUser.uid)
          .update({
            Following: firestore.FieldValue.arrayUnion(id),
          });
      } catch (err) {
        crashlytics().recordError(err);
        console.log("ProfileInfo.js : ", err);
        return;
      }
      if (isMounted.current) setIsFollowed(true);
    }
  };
  return (
    <Pressable
      style={({ pressed }) => {
        if (!pressed)
          return {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 10,
          };
        else
          return {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 10,
            backgroundColor: "rgba(0,0,0,0.1)",
          };
      }}
      onPress={() => {
        if (auth().currentUser.uid == id)
          navigation.navigate("AppTabs", { screen: "Profile" });
        else navigation.navigate("User", { id });
      }}
    >
      <View style={{ marginRight: 10 }}>
        <Image
          source={
            pfp
              ? {
                  uri: pfp,
                }
              : null
          }
          style={{
            width: 50,
            height: 50,
            borderRadius: 40,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        />
      </View>
      <View style={{ justifyContent: "center", flex: 1 }}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{ fontWeight: "bold" }}
        >
          {username}
        </Text>
        <Text ellipsizeMode="tail" numberOfLines={1}>
          {name}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: isFollowed ? "#fff" : "#1890ff",
          paddingHorizontal: 30,
          paddingVertical: 4,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 2,
          borderWidth: isFollowed ? 1 : 0,
          marginLeft: 10,
        }}
        onPress={followHandler}
      >
        <Text style={{ color: isFollowed ? "#000" : "#fff" }}>
          {isFollowed ? "Unfollow" : "Follow"}
        </Text>
      </TouchableOpacity>
    </Pressable>
  );
};

const ProfileInfo = ({ profileUser, navigation }) => {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const { user, screen } = useSelector((state) => state);
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const [followingModalVisible, setFollowingModalVisible] = useState(false);
  useEffect(() => {
    setFollowersModalVisible(false);
    setFollowingModalVisible(false);
  }, [screen]);
  return (
    <>
      <View style={styles.profile}>
        <View style={styles.profileLeft}>
          <View style={styles.imageContainer}>
            {profileUser && (
              <Image
                source={profileUser.Photo ? { uri: profileUser.Photo } : null}
                style={styles.profileImage}
              />
            )}
          </View>

          <View style={{ marginTop: 6 }}>
            <Text style={{ fontWeight: "bold" }}>
              {profileUser ? profileUser.Name : ""}
            </Text>
          </View>
        </View>
        <View style={styles.profileRight}>
          <View style={styles.statsContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {parseThis(profileUser && profileUser.Posts.length)}
            </Text>
            <Text>Posts</Text>
          </View>
          <Pressable
            style={({ pressed }) => {
              if (!pressed) return styles.statsContainer;
              else
                return [
                  styles.statsContainer,
                  { backgroundColor: "rgba(0,0,0,0.1)" },
                ];
            }}
            onPress={() => setFollowersModalVisible(true)}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {parseThis(profileUser && profileUser.Followers.length)}
            </Text>
            <Text>Followers</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => {
              if (!pressed) return styles.statsContainer;
              else
                return [
                  styles.statsContainer,
                  { backgroundColor: "rgba(0,0,0,0.1)" },
                ];
            }}
            onPress={() => setFollowingModalVisible(true)}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {parseThis(profileUser && profileUser.Following.length)}
            </Text>
            <Text>Following</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.bio}>
        <Text>{profileUser ? profileUser.Bio : ""}</Text>
      </View>
      <Modal
        visible={followersModalVisible}
        transparent={true}
        onRequestClose={() => setFollowersModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(24,24,24,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              maxHeight: 400,
              width: "90%",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <FlatList
              data={user.Followers}
              renderItem={({ item }) => (
                <UserListCard id={item} navigation={navigation} />
              )}
              keyExtractor={(item, index) => item}
              style={{ height: "100%", width: "100%" }}
            />
          </View>
        </View>
      </Modal>
      <Modal
        visible={followingModalVisible}
        transparent={true}
        onRequestClose={() => setFollowingModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(24,24,24,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              maxHeight: 400,
              width: "90%",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <FlatList
              data={user.Following}
              renderItem={({ item }) => (
                <UserListCard id={item} navigation={navigation} />
              )}
              keyExtractor={(item, index) => item}
              style={{ height: "100%", width: "100%" }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const ProfileStories = ({ profileUser, navigation }) => {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [stories, setStories] = useState([]);
  const carouselRef = useRef(null);
  const [storyVisible, setStoryVisible] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    (async () => {
      let str = [];
      try {
        str = await Promise.all(
          profileUser.Stories.map(async (story) => {
            try {
              let data;
              try {
                data = (
                  await firestore().collection("stories").doc(story).get()
                ).data();
              } catch (err) {
                crashlytics().recordError(err);
                console.log("UserPage.js : ", err);
                return;
              }
              let uri = "";
              try {
                uri = await storage()
                  .refFromURL(data.content.source)
                  .getDownloadURL();
              } catch (err) {
                crashlytics().recordError(err);
                console.log("UserPage.js : ", err);
                return;
              }
              let thumbnail = uri;
              if (data.content.type == "video")
                thumbnail = (await createThumbnail({ url: uri })).path;
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
              console.log("UserPage.js : ", err);
              return;
            }
          })
        );
      } catch (err) {
        crashlytics().recordError(err);
        console.log("UserPage.js : ", err);
        return;
      }
      str = str.filter((e) => e != undefined);
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
  }, []);
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = useCallback(({ item, index }) => {
    return (
      <View style={styles.storyImgLabelContainer}>
        <Pressable
          style={styles.storyImgContainer}
          onPress={() => {
            setCarouselIndex(index);
            setStoryVisible(true);
          }}
        >
          <Image
            source={
              item[0].content.thumbnail
                ? { uri: item[0].content.thumbnail }
                : null
            }
            style={styles.storyImage}
          />
        </Pressable>
        <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: 12 }}>
          {item[0].createdAt.toDate().toLocaleDateString()}
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

const ProfileGrid = ({ profileUser, navigation }) => {
  const [gridContent, setGridContent] = useState([]);
  const isMounted = useRef(true);
  const { user } = useSelector((state) => state);
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    (async () => {
      let posts;
      try {
        posts = await Promise.all(
          profileUser.Posts.map(async (post_id) => {
            let data;
            try {
              data = (
                await firestore().collection("posts").doc(post_id).get()
              ).data();
            } catch (err) {
              crashlytics().recordError(err);
              console.log("UserPage.js : ", err);
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
              console.log("UserPage.js : ", err);
              return;
            }
            try {
              if (data.content[0].type == "video")
                thumbnail = (await createThumbnail({ url: thumbnail })).path;
            } catch (err) {
              crashlytics().recordError(err);
              console.log("UserPage.js : ", err);
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
        console.log("UserPage.js : ", err);
        return;
      }
      if (isMounted.current) setGridContent(posts);
    })();
  }, [user.Posts]);

  const imageOpened = useCallback((post_id) => {
    Analytics().logEvent("UserProfileGridImageOpened");
    navigation.navigate("Post", { id: post_id });
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
                    source={item[0] ? { uri: item[0].source } : null}
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
                    source={item[1] ? { uri: item[1].source } : null}
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
                    source={item[2] ? { uri: item[2].source } : null}
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

const UserPage = ({ route, navigation }) => {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  const { id } = route.params;
  const [profileUser, setProfileUser] = useState(null);
  const { user } = useSelector((state) => state);
  const followHandler = () => {
    // if was already following
    if (user.Following.includes(id)) {
      firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .update({
          Following: firestore.FieldValue.arrayRemove(id),
        })
        .catch((err) => {
          crashlytics().recordError(err);
          console.log("UserPage.js : ", err);
        });
      firestore()
        .collection("users")
        .doc(id)
        .update({
          Followers: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
        })
        .catch((err) => {
          crashlytics().recordError(err);
          console.log("UserPage.js : ", err);
        });
    } // we started following
    else {
      firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .update({
          Following: firestore.FieldValue.arrayUnion(id),
        })
        .catch((err) => {
          crashlytics().recordError(err);
          console.log("UserPage.js : ", err);
        });
      firestore()
        .collection("users")
        .doc(id)
        .update({
          Followers: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
        })
        .catch((err) => {
          crashlytics().recordError(err);
          console.log("UserPage.js : ", err);
        });
    }
  };
  useEffect(() => {
    (async () => {
      let data;
      try {
        data = (await firestore().collection("users").doc(id).get()).data();
      } catch (err) {
        crashlytics().recordError(err);
        console.log("UserPage.js : ", err);
      }
      try {
        data.Photo = await storage().refFromURL(data.Photo).getDownloadURL();
      } catch (err) {
        crashlytics().recordError(err);
        console.log("UserPage.js : ", err);
        data.Photo = "";
      }
      if (isMounted.current) setProfileUser(data);
    })();
  }, [id]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ProfileInfo profileUser={profileUser} navigation={navigation} />
        <View
          style={{
            width: "95%",
            marginTop: 24,
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.0975)",
              paddingVertical: 6,
              paddingHorizontal: 6,
              marginRight: 6,
              borderRadius: 4,
              backgroundColor: user.Following.includes(id) ? "#fff" : "#1890ff",
            }}
            onPress={followHandler}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: user.Following.includes(id) ? "#000" : "#fff",
              }}
            >
              {user.Following.includes(id) ? "Unfollow" : "Follow"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.0975)",
              paddingVertical: 6,
              paddingHorizontal: 6,
              borderRadius: 4,
            }}
          >
            <Text>Message</Text>
          </TouchableOpacity>
        </View>
        {profileUser && (
          <ProfileStories profileUser={profileUser} navigation={navigation} />
        )}
        {profileUser && (
          <ProfileGrid navigation={navigation} profileUser={profileUser} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserPage;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  scrollContainer: {
    width: win.width,
    borderColor: "black",
    alignItems: "center",
  },
  profile: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  profileImage: {
    borderRadius: 90,
    height: 90,
    width: 90,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.0975)",
  },
  statsContainer: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  profileRight: {
    flexDirection: "row",
  },
  profileLeft: {},
  bio: {
    width: "95%",
  },
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
