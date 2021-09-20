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
} from "react-native";

import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import crashlytics from "@react-native-firebase/crashlytics";
import Analytics from "@react-native-firebase/analytics";

import colors from "../constants/colors";

import { createThumbnail } from "react-native-create-thumbnail";

import { Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import { FontAwesome5 } from "@expo/vector-icons";

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

const ProfileInfo = ({ profileUser }) => {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return (
    <>
      <View style={styles.profile}>
        <View style={styles.profileLeft}>
          <View style={styles.imageContainer}>
            {profileUser && (
              <Image
                source={{ uri: profileUser.Photo }}
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
          <View style={styles.statsContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {parseThis(profileUser && profileUser.Followers.length)}
            </Text>
            <Text>Followers</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {parseThis(profileUser && profileUser.Following.length)}
            </Text>
            <Text>Following</Text>
          </View>
        </View>
      </View>
      <View style={styles.bio}>
        <Text>{profileUser ? profileUser.Bio : ""}</Text>
      </View>
    </>
  );
};

const ProfileStories = ({ profileUser }) => {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [stories, setStories] = useState([]);
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
              let uri;
              try {
                uri = await storage()
                  .refFromURL(data.content.source)
                  .getDownloadURL();
              } catch (err) {
                crashlytics().recordError(err);
                console.log("UserPage.js : ", err);
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
        <ProfileInfo profileUser={profileUser} />
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
        {profileUser && <ProfileStories profileUser={profileUser} />}
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
});
