import React, { useState, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ImageStore,
  TextInput,
  SafeAreaView,
} from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
  AntDesign,
  Ionicons,
  EvilIcons,
} from "@expo/vector-icons";
import colors from "../constants/colors";

import { LinearGradient } from "expo-linear-gradient";
import { Video, AVPlaybackStatus } from "expo-av";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const user = {
  id: 1,
  photo: require("../assets/images/profiles/pfp.jpg"),
};

const win = Dimensions.get("window");

const FeedCard = ({ logo, title, content, comments, caption, likes }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const videoRefs = useRef({});
  const [heightScaled, setHeightScaled] = useState(1.77);
  return (
    <SafeAreaView style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.headerImgLabelContainer}>
          <LinearGradient
            colors={["#DD2A7B", "#F58529"]}
            style={styles.outlineGradient}
          >
            <View style={styles.imageContainer}>
              <Image source={logo} style={styles.headerImage} />
            </View>
          </LinearGradient>
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
      </View>
      <View style={styles.carousel}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          snapToInterval={win.width}
          pagingEnabled={true}
          snapToAlignment="center"
          decelerationRate={0}
          horizontal={true}
          data={[...content]}
          renderItem={({ item }) => {
            if (item.type == "image") {
              const { height, width } = Image.resolveAssetSource(item.source);
              return (
                <Image
                  source={item.source}
                  style={{
                    ...styles.carouselContent,
                    aspectRatio: width / height,
                  }}
                />
              );
            } else if (item.type == "video") {
              return (
                <TouchableWithoutFeedback
                  onPress={() => {
                    videoRefs.current[item.source]
                      .getStatusAsync((e) => {
                        return e;
                      })
                      .then((e) => {
                        videoRefs.current[item.source].setIsMutedAsync(
                          !e.isMuted
                        );
                      });
                  }}
                >
                  <Video
                    ref={(ref) => (videoRefs.current[item.source] = ref)}
                    source={item.source}
                    style={{
                      height: heightScaled,
                      width: win.width,
                    }}
                    volume={1}
                    resizeMode="cover"
                    shouldPlay={true}
                    isLooping={true}
                    isMuted={true}
                    onReadyForDisplay={(res) => {
                      const { height, width } = res.naturalSize;
                      setHeightScaled(height * (win.width / width));
                    }}
                  />
                </TouchableWithoutFeedback>
              );
            }
          }}
        />
      </View>
      <View style={styles.control}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign
            name={liked ? "heart" : "hearto"}
            size={22}
            color={liked ? "red" : "black"}
            style={{ marginRight: 16 }}
            onPress={() => setLiked((prev) => !prev)}
          />
          <Image
            source={require("../assets/icons/comment.png")}
            style={{ height: 20, width: 20, marginRight: 16 }}
          />
          <Ionicons name="paper-plane-outline" size={22} color="black" />
        </View>
        <FontAwesome
          name={bookmarked ? "bookmark" : "bookmark-o"}
          size={22}
          color="black"
          onPress={() => setBookmarked((prev) => !prev)}
        />
      </View>
      <View style={styles.likes}>
        <View
          style={{
            borderWidth: 2,
            borderColor: colors.white,
            borderRadius: 200,
            zIndex: 3,
          }}
        >
          <Image
            source={require("../assets/images/profiles/camilla.jpg")}
            style={{
              ...styles.likesPic,
            }}
          />
        </View>
        <View
          style={{
            borderWidth: 2,
            borderColor: colors.white,
            borderRadius: 200,
            zIndex: 2,
            transform: [{ translateX: -10 }],
          }}
        >
          <Image
            source={require("../assets/images/profiles/shawn.jpg")}
            style={{
              ...styles.likesPic,
            }}
          />
        </View>
        <View
          style={{
            transform: [{ translateX: -20 }],
            zIndex: 1,
            borderRadius: 200,
            borderWidth: 2,
            borderColor: colors.white,
          }}
        >
          <Image
            source={require("../assets/images/profiles/lemon.jpg")}
            style={{
              ...styles.likesPic,
            }}
          />
        </View>
        <Text
          numberOfLines={2}
          style={{
            flexWrap: "wrap",
            flexShrink: 1,
            flexGrow: 1,
            transform: [{ translateX: -10 }],
          }}
        >
          Liked by <Text style={{ fontWeight: "bold" }}>elizabetholsen</Text>{" "}
          and{" "}
          <Text style={{ fontWeight: "bold" }}>
            {likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} others
          </Text>
        </Text>
      </View>
      <View style={styles.caption}>
        <Text>
          <Text style={{ fontWeight: "bold" }}>{title + " "}</Text>
          {caption}
        </Text>
      </View>
      <View style={styles.viewAll}>
        <Text style={{ color: "rgba(0,0,0,0.3)" }}>
          View all {comments.length} comments
        </Text>
      </View>
      <View style={styles.comment}>
        <Text style={{ fontWeight: "bold" }}>{comments[0].user + " "}</Text>
        <Text>{comments[0].comment}</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={{ flex: 1 }}>
          <Image source={user.photo} style={styles.inputPhoto} />
        </View>
        <View style={{ flex: 6 }}>
          <TextInput placeholder="Add a comment..." />
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>❤️</Text>
          <Text>🙌</Text>
          <AntDesign name="pluscircleo" size={12} color="rgba(0,0,0,0.3)" />
        </View>
      </View>
      <View style={styles.age}>
        <Text style={{ fontSize: 10, color: "rgba(0,0,0,0.3)" }}>
          2 hours ago
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default FeedCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: win.width,
    alignItems: "center",
    marginBottom: 8,
  },
  header: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomColor: "rgba(0,0,0,0.0975)",
    borderBottomWidth: 0.5,
  },
  headerImgLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerImage: {
    height: 28,
    width: 28,
    borderRadius: 30,
    borderColor: "rgba(0,0,0,0.0975)",
    borderWidth: 0.5,
    transform: [{ rotateZ: "-30deg" }],
  },
  outlineGradient: {
    height: 36,
    width: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 36,
    transform: [
      {
        rotateZ: "30deg",
      },
    ],
    marginRight: 8,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    height: 36,
    width: 36,
    borderColor: "transparent",
    borderRadius: 36,
    borderWidth: 1,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  carousel: {
    width: "100%",
  },
  carouselContent: {
    width: win.width,
  },
  control: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  likes: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 1,
  },
  likesPic: {
    height: 24,
    width: 24,
    borderRadius: 12,
  },
  caption: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 1,
  },
  viewAll: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 1,
  },
  comment: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 1,
  },
  inputContainer: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  inputPhoto: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  age: {
    width: "95%",
  },
});
