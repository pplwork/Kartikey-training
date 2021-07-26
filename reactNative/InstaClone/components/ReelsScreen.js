import React, { useState, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
} from "react-native";
import { Video } from "expo-av";
import colors from "../constants/colors";
import { FlatList } from "react-native-gesture-handler";
import {
  SimpleLineIcons,
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const reels = [
  require("../assets/videos/posts/conan/0/0.mp4"),
  require("../assets/videos/posts/sanholobeats/0/0.mp4"),
  require("../assets/videos/posts/sanholobeats/0/1.mp4"),
  require("../assets/videos/griddata/3.mp4"),
];

const win = Dimensions.get("window");

const ReelsScreen = () => {
  const [height, setHeight] = useState(win.height);
  const videoRefs = useRef({});
  return (
    <SafeAreaView
      style={styles.container}
      onLayout={(event) => {
        setHeight(event.nativeEvent.layout.height);
      }}
    >
      <FlatList
        snapToInterval={height}
        pagingEnabled={true}
        snapToAlignment="center"
        decelerationRate={0}
        data={reels}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <>
              <TouchableWithoutFeedback
                onPress={() => {
                  videoRefs.current[item]
                    .getStatusAsync((e) => {
                      return e;
                    })
                    .then((e) => {
                      videoRefs.current[item].setIsMutedAsync(!e.isMuted);
                    });
                }}
              >
                <Video
                  ref={(ref) => (videoRefs.current[item] = ref)}
                  source={item}
                  style={{
                    height: height,
                    width: win.width,
                  }}
                  volume={1}
                  resizeMode="cover"
                  shouldPlay={true}
                  isLooping={true}
                  isMuted={true}
                />
              </TouchableWithoutFeedback>
              <View style={styles.controls}>
                <AntDesign
                  name="hearto"
                  size={26}
                  color={colors.white}
                  style={{ marginBottom: 4 }}
                />
                <Text style={{ color: colors.white, marginBottom: 24 }}>
                  57.1k
                </Text>
                <Image
                  source={require("../assets/icons/comment-white.png")}
                  style={{ height: 24, width: 24, marginBottom: 4 }}
                />
                <Text style={{ color: colors.white, marginBottom: 24 }}>
                  1.2k
                </Text>
                <Ionicons
                  name="paper-plane-outline"
                  size={26}
                  color={colors.white}
                  style={{ marginBottom: 24 }}
                />
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={26}
                  color={colors.white}
                  style={{ marginBottom: 24 }}
                />
                <Image
                  source={require("../assets/images/profiles/conan.jpg")}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: colors.white,
                  }}
                />
              </View>
              <View style={styles.content}>
                <View style={styles.user}>
                  <Image
                    style={{
                      borderRadius: 100,
                      height: 32,
                      width: 32,
                      marginRight: 8,
                    }}
                    source={require("../assets/images/profiles/conan.jpg")}
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: colors.white,
                      marginRight: 8,
                    }}
                  >
                    conangray
                  </Text>
                  <MaterialIcons
                    name="verified"
                    size={24}
                    color={colors.white}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{ color: colors.white, fontWeight: "bold" }}>
                    • Follow
                  </Text>
                </View>
                <View style={styles.caption}>
                  <Text
                    style={{ color: colors.white }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    The reel caption goes here
                  </Text>
                </View>
                <View style={styles.audio}>
                  <MaterialCommunityIcons
                    name="waveform"
                    size={20}
                    color={colors.white}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{ color: colors.white }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    conangray • Original Audio
                  </Text>
                </View>
              </View>
            </>
          );
        }}
      />
      <View style={styles.header}>
        <Text style={{ color: colors.white, fontSize: 24, fontWeight: "bold" }}>
          Reels
        </Text>
        <SimpleLineIcons name="camera" size={24} color={colors.white} />
      </View>
    </SafeAreaView>
  );
};

export default ReelsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  header: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    top: 16,
  },
  controls: {
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    right: 12,
    bottom: 24,
  },
  content: {
    position: "absolute",
    bottom: 24,
    left: 16,
    width: "80%",
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  caption: {
    marginBottom: 10,
  },
  audio: {
    flexDirection: "row",
    alignItems: "center",
  },
});
