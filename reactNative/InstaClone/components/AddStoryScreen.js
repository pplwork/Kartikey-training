import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import { Camera } from "expo-camera";
import {
  Octicons,
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  Entypo,
} from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import colors from "../constants/colors";

import crashlytics from "@react-native-firebase/crashlytics";

const flashIcons = {
  [Camera.Constants.FlashMode.off]: "flash-off",
  [Camera.Constants.FlashMode.on]: "flash",
  [Camera.Constants.FlashMode.auto]: "flash-auto",
  [Camera.Constants.FlashMode.torch]: "flashlight",
};

const AddStoryScreen = ({ navigation }) => {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [showText, setShowText] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [postingModalVisible, setPostingModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Posting...");
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      if (isMounted.current) {
        setHasPermission(status === "granted");
      }
    })();
  }, []);

  const showTextHandler = useCallback(() => {
    setShowText(true);
    setTimeout(() => {
      if (isMounted.current) setShowText(false);
    }, 5000);
  }, []);

  const takePic = async () => {
    if (cameraRef) {
      let photo;
      try {
        photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
        });
      } catch (err) {
        crashlytics().recordError(err);
        console.log("AddStoryScreen.js : ", err);
        return;
      }
      let name = photo.uri.match(/(\/|\\)([^\/\\]+\.jpg)/)[2];
      let file = storage().ref(`images/stories/${name}`);
      // setup the modal
      if (isMounted.current) setPostingModalVisible(true);
      try {
        await file.putFile(photo.uri);
      } catch (err) {
        crashlytics().recordError(err);
        console.log("AddStoryScreen.js : ", err);
        if (isMounted.current) setPostingModalVisible(false);
        return;
      }
      let story;
      try {
        story = await firestore()
          .collection("stories")
          .add({
            author: auth().currentUser.uid,
            content: {
              source: file.toString(),
              type: "image",
            },
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
      } catch (err) {
        crashlytics().recordError(err);
        console.log("AddStoryScreen.js : ", err);
        if (isMounted.current) setPostingModalVisible(false);
        return;
      }
      try {
        await firestore()
          .collection("users")
          .doc(auth().currentUser.uid)
          .update({
            Stories: firestore.FieldValue.arrayUnion(story.id),
          });
      } catch (err) {
        crashlytics().recordError(err);
        console.log("AddStoryScreen.js : ", err);
        if (isMounted.current) setPostingModalVisible(false);
        return;
      }
      if (isMounted.current) setPostingModalVisible(false);
    }
  };
  const startRecording = async () => {
    setIsRecording(true);
    let video;
    try {
      video = await cameraRef.current.recordAsync({
        quality: Camera.Constants.VideoQuality["720p"],
        maxDuration: 30,
        maxFileSize: 50000000,
      });
    } catch (err) {
      crashlytics().recordError(err);
      console.log("AddStoryScreen.js : ", err);
      return;
    }
    if (isMounted.current) setIsRecording(false);
    let name = video.uri.match(/(\/|\\)([^\/\\]+\.mp4)/)[2];
    let file = storage().ref(`videos/stories/${name}`);
    if (isMounted.current) setPostingModalVisible(true);
    try {
      await file.putFile(video.uri);
    } catch (err) {
      crashlytics().recordError(err);
      console.log("AddStoryScreen.js : ", err);
      if (isMounted.current) setPostingModalVisible(false);
      return;
    }
    let story;
    try {
      story = await firestore()
        .collection("stories")
        .add({
          author: auth().currentUser.uid,
          content: {
            source: file.toString(),
            type: "video",
          },
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (err) {
      crashlytics().recordError(err);
      console.log("AddStoryScreen.js : ", err);
      if (isMounted.current) setPostingModalVisible(false);
      return;
    }
    try {
      await firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .update({
          Stories: firestore.FieldValue.arrayUnion(story.id),
        });
    } catch (err) {
      crashlytics().recordError(err);
      console.log("AddStoryScreen.js : ", err);
      if (isMounted.current) setPostingModalVisible(false);
      return;
    }
    if (isMounted.current) setPostingModalVisible(false);
  };
  const stopRecording = async () => {
    if (isRecording) {
      cameraRef.current.stopRecording();
    }
  };
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <>
      <StatusBar backgroundColor={colors.black} barStyle="light-content" />
      <View style={styles.container}>
        {isFocused && (
          <Camera
            style={styles.camera}
            type={type}
            flashMode={flash}
            ref={cameraRef}
            ratio="16:9"
          >
            <View style={styles.header}>
              <Octicons name="gear" size={32} color={colors.white} />
              <MaterialCommunityIcons
                name={flashIcons[flash]}
                size={32}
                color={colors.white}
                onPress={() => {
                  setFlash((prev) => {
                    switch (prev) {
                      case Camera.Constants.FlashMode.off:
                        return Camera.Constants.FlashMode.on;
                      case Camera.Constants.FlashMode.on:
                        return Camera.Constants.FlashMode.auto;
                      case Camera.Constants.FlashMode.auto:
                        return Camera.Constants.FlashMode.torch;
                      case Camera.Constants.FlashMode.torch:
                        return Camera.Constants.FlashMode.off;
                    }
                  });
                }}
              />

              <AntDesign
                name="close"
                size={32}
                color={colors.white}
                onPress={() => navigation.navigate("Home")}
              />
            </View>
            <View style={styles.leftControls}>
              <View style={styles.controlGroup}>
                <MaterialCommunityIcons
                  name="format-letter-case-upper"
                  size={32}
                  color={colors.white}
                  onPress={showTextHandler}
                />
                <Text
                  style={{
                    ...styles.controlText,
                    display: showText ? "flex" : "none",
                  }}
                >
                  Create
                </Text>
              </View>
              <View style={styles.controlGroup}>
                <MaterialCommunityIcons
                  name="infinity"
                  size={32}
                  color={colors.white}
                  onPress={showTextHandler}
                />
                <Text
                  style={{
                    ...styles.controlText,
                    display: showText ? "flex" : "none",
                  }}
                >
                  Boomerang
                </Text>
              </View>
              <View style={styles.controlGroup}>
                <Feather
                  name="layout"
                  size={32}
                  color={colors.white}
                  onPress={showTextHandler}
                />
                <Text
                  style={{
                    ...styles.controlText,
                    display: showText ? "flex" : "none",
                  }}
                >
                  Layout
                </Text>
              </View>
              <View style={styles.controlGroup}>
                <Entypo name="chevron-down" size={32} color={colors.white} />
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={takePic}
              onLongPress={startRecording}
              onPressOut={stopRecording}
              delayLongPress={200}
            >
              <View style={styles.innerButton}></View>
            </TouchableOpacity>
          </Camera>
        )}
        <View style={styles.controls}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Image
                source={require("../assets/favicon.png")}
                style={{
                  height: 32,
                  width: 32,
                  borderColor: colors.white,
                  borderWidth: 2,
                  borderRadius: 4,
                }}
              />
            </View>
            <View style={{ flex: 3, justifyContent: "center" }}>
              {/* <FlatList
                data={["post", "story", "reels", "live"]}
                keyExtractor={(item, index) => index.toString()}
                snapToAlignment="center"
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{ marginHorizontal: 10, justifyContent: "center" }}
                    >
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: 16,
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {item}
                      </Text>
                    </View>
                  );
                }}
              /> */}
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="camera-reverse"
                size={32}
                color={colors.white}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
      </View>
      <Modal visible={postingModalVisible} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(24,24,24,0.9)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, marginBottom: 10 }}>
            {modalMessage}
          </Text>
          <Progress.CircleSnail color="#fff"></Progress.CircleSnail>
        </View>
      </Modal>
    </>
  );
};

export default React.memo(AddStoryScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  header: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },

  controls: {
    width: "100%",
    height: 125,
    backgroundColor: colors.black,
    padding: 18,
  },
  leftControls: {
    position: "absolute",
    left: 18,
    top: "40%",
  },
  controlGroup: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  controlText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "bold",
    marginLeft: 20,
  },
  button: {
    position: "absolute",
    backgroundColor: colors.white,
    height: 80,
    width: 80,
    borderRadius: 60,
    alignSelf: "center",
    bottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  innerButton: {
    height: 70,
    width: 70,
    borderRadius: 50,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.black,
  },
});
