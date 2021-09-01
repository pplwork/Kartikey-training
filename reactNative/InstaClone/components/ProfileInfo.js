import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

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

const ProfileInfo = () => {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .onSnapshot((doc) => {
        const data = doc.data();
        dispatch({
          type: "SET_USER",
          payload: { ...data, Photo: user.Photo, uid: auth().currentUser.uid },
        });
      });
    return () => unsubscribe();
  }, []);
  return (
    <>
      <View style={styles.profile}>
        <View style={styles.profileLeft}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: user.Photo }} style={styles.profileImage} />
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
          <View style={styles.statsContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {parseThis(user.Followers.length)}
            </Text>
            <Text>Followers</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {parseThis(user.Following.length)}
            </Text>
            <Text>Following</Text>
          </View>
        </View>
      </View>
      <View style={styles.bio}>
        <Text>{user.Bio}</Text>
      </View>
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
});
