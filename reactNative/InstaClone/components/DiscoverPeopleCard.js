import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import crashlytics from "@react-native-firebase/crashlytics";

const win = Dimensions.get("window");

const DiscoverPeopleCard = ({ image, name, mutual, uid }) => {
  const isMounted = useRef(true);
  const [disabled, setDisabled] = useState(false);
  const [firstMutual, setFirstMutual] = useState("");
  useEffect(() => {
    if (mutual.length)
      firestore()
        .collection("users")
        .doc(mutual[0])
        .get()
        .then((doc) => setFirstMutual(doc.data().Username))
        .catch((err) => crashlytics().recordErr(err));
    () => (isMounted.current = false);
  }, []);
  const followUser = async () => {
    if (isMounted.current) setDisabled(true);
    Promise.all([
      firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .update({
          Following: firestore.FieldValue.arrayUnion(uid),
        }),
      firestore()
        .collection("users")
        .doc(uid)
        .update({
          Followers: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
        }),
    ]).catch(() => {
      if (isMounted.current) setDisabled(false);
    });
  };
  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.cardImage} />
      </View>
      <Text
        style={{ fontWeight: "bold" }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {name}
      </Text>
      {mutual.length > 0 ? (
        <>
          <Text style={styles.followText}>Followed by</Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.followText}
          >
            {firstMutual}{" "}
            {mutual.length > 1 ? `+ ${mutual.length - 1} more` : false}
          </Text>
        </>
      ) : null}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={followUser}
        disabled={disabled}
      >
        <Text style={{ color: colors.white, fontWeight: "bold" }}>Follow</Text>
      </TouchableOpacity>
      <View style={styles.cross}>
        <EvilIcons name="close" size={20} color="black" />
      </View>
    </View>
  );
};

export default React.memo(DiscoverPeopleCard);

const styles = StyleSheet.create({
  cardContainer: {
    width: win.width / 2.5,
    padding: 10,
    borderColor: "rgba(0,0,0,0.0975)",
    borderRadius: 5,
    borderWidth: 0.5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cross: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  cardImage: {
    height: 90,
    width: 90,
    borderRadius: 90,
  },
  imageContainer: {
    marginBottom: 10,
  },
  followText: {
    fontSize: 12,
  },
  buttonContainer: {
    alignSelf: "stretch",
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#1890ff",
    paddingVertical: 4,
    borderRadius: 4,
  },
});
