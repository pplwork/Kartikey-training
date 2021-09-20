import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
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
  FontAwesome5,
} from "@expo/vector-icons";
import colors from "../constants/colors";
import reelIcon from "../assets/icons/instagram-reel.png";

import crashlytics from "@react-native-firebase/crashlytics";

import * as Progress from "react-native-progress";

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
  const [isRecording, setIsRecording] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Posting...");
  const [videoPath, setVideoPath] = useState("");
  const [caption, setCaption] = useState("");
  const [captionModalVisible, setCaptionModalVisible] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      if (isMounted.current) {
        setHasPermission(status === "granted");
      }
    })();
  }, []);

  const getCaption = async () => {
    return "";
  };

  const startRecording = async () => {
    setIsRecording(true);
    let video;
    try {
      video = await cameraRef.current.recordAsync({
        quality: Camera.Constants.VideoQuality["720p"],
        maxDuration: 15,
        maxFileSize: 50000000,
      });
    } catch (err) {
      crashlytics().recordError(err);
      console.log("AddReelScreen.js : ", err);
      return;
    }
    if (isMounted.current) setIsRecording(false);
    if (isMounted.current) setVideoPath(video.uri);
    if (isMounted.current) setCaptionModalVisible(true);
  };

  const postReel = async () => {
    setCaptionModalVisible(false);
    let name = videoPath.match(/(\/|\\)([^\/\\]+\.mp4)/)[2];
    let file = storage().ref(`videos/reels/${name}`);
    if (isMounted.current) setModalVisible(true);
    try {
      await file.putFile(videoPath);
    } catch (err) {
      crashlytics().recordError(err);
      console.log("AddReelScreen.js : ", err);
      if (isMounted.current) setModalVisible(false);
      return;
    }
    let reel;
    try {
      reel = await firestore()
        .collection("reels")
        .add({
          author: auth().currentUser.uid,
          caption: caption,
          comments: [],
          likes: [],
          content: {
            source: file.toString(),
          },
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (err) {
      crashlytics().recordError(err);
      console.log("AddReelScreen.js : ", err);
      if (isMounted.current) setModalVisible(false);
      return;
    }
    try {
      await firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .update({
          Reels: firestore.FieldValue.arrayUnion(reel.id),
        });
    } catch (err) {
      crashlytics().recordError(err);
      console.log("AddReelScreen.js : ", err);
      if (isMounted.current) setModalVisible(false);
      return;
    }
    if (isMounted.current) setModalVisible(false);
  };

  const stopRecording = async () => {
    if (isRecording) {
      cameraRef.current.stopRecording();
    }
  };
  const handleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
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
                onPress={() => navigation.navigate("Reels")}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRecording}>
              <View style={styles.innerButton}>
                {!isRecording && (
                  <Image source={reelIcon} style={{ height: 40, width: 40 }} />
                )}
                {isRecording && (
                  <FontAwesome5 name="stop" size={36} color="#cd486b" />
                )}
              </View>
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
      <Modal visible={modalVisible} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(24,24,24,0.9)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, color: "#fff", marginBottom: 10 }}>
            {modalMessage}
          </Text>
          <Progress.CircleSnail color="#fff" />
        </View>
      </Modal>
      <Modal
        visible={captionModalVisible}
        transparent={true}
        onRequestClose={() => {
          setCaption("");
          setVideoPath("");
          setCaptionModalVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(24,24,24,0.9)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text
              style={{ alignSelf: "center", fontSize: 18, marginBottom: 10 }}
            >
              Enter Caption
            </Text>
            <TextInput
              style={{ maxHeight: 100, width: 200, marginBottom: 10 }}
              placeholder="Your caption..."
              multiline
              numberOfLines={5}
            />
            <Button title="Post" onPress={postReel} />
          </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
});
