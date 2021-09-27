import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import crashlytics from "@react-native-firebase/crashlytics";

import colors from "../constants/colors";
import { useDispatch, useSelector } from "react-redux";

const parseThis = (num) => {
  if (num == undefined) return 0;
  if (num < 9999)
    return Number(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return `${(num / 1000).toFixed(1)}K`;
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

const ProfileInfo = ({ navigation }) => {
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
            <Image
              source={user.Photo ? { uri: user.Photo } : null}
              style={styles.profileImage}
            />
          </View>

          <View style={{ marginTop: 6 }}>
            <Text style={{ fontWeight: "bold" }}>{user.Name}</Text>
          </View>
        </View>
        <View style={styles.profileRight}>
          <View style={styles.statsContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {parseThis(user.Posts.length)}
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
              {parseThis(user.Followers.length)}
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
              {parseThis(user.Following.length)}
            </Text>
            <Text>Following</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.bio}>
        <Text>{user.Bio}</Text>
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

export default React.memo(ProfileInfo);

const styles = StyleSheet.create({
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
    alignItems: "center",
    padding: 10,
    borderRadius: 2,
  },
  profileRight: {
    flexDirection: "row",
  },
  profileLeft: {},
  bio: {
    width: "95%",
  },
});
