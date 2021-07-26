import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Image,
} from "react-native";
import FeedCard from "./FeedCard";
import colors from "../constants/colors";
import { useFonts } from "expo-font";
import {
  MaterialIcons,
  AntDesign,
  Foundation,
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
const stories = [
  {
    id: 1,
    photo: require("../assets/images/profiles/pfp.jpg"),
    name: "Your Story",
  },
  {
    id: 2,
    photo: require("../assets/images/profiles/alessia.jpg"),
    name: "alessiasmusic",
  },
  {
    id: 3,
    photo: require("../assets/images/profiles/9gag.jpg"),
    name: "9gag",
  },
  {
    id: 4,
    photo: require("../assets/images/profiles/conan.jpg"),
    name: "conangray",
  },
  {
    id: 5,
    photo: require("../assets/images/profiles/rock.jpg"),
    name: "therock",
  },
  {
    id: 6,
    photo: require("../assets/images/profiles/sanholo.jpg"),
    name: "sanholobeats",
  },
  {
    id: 7,
    photo: require("../assets/images/profiles/novo.jpg"),
    name: "novoamor",
  },
  {
    id: 8,
    photo: require("../assets/images/profiles/netflix.jpg"),
    name: "netflix",
  },
  {
    id: 9,
    photo: require("../assets/images/profiles/tanmay.jpg"),
    name: "tanmaybhat",
  },
  {
    id: 10,
    photo: require("../assets/images/profiles/sara.jpg"),
    name: "sarakaysmusic",
  },
];

const feed = [
  {
    logo: require("../assets/images/profiles/9gag.jpg"),
    title: "9gag",
    content: [
      {
        source: require("../assets/images/posts/9gag/0/0.jpg"),
        type: "image",
      },
      {
        source: require("../assets/images/posts/9gag/0/1.jpg"),
        type: "image",
      },
      {
        source: require("../assets/images/posts/9gag/0/2.jpg"),
        type: "image",
      },
      {
        source: require("../assets/images/posts/9gag/0/3.jpg"),
        type: "image",
      },
      {
        source: require("../assets/images/posts/9gag/0/4.jpg"),
        type: "image",
      },
      {
        source: require("../assets/images/posts/9gag/0/5.jpg"),
        type: "image",
      },
      {
        source: require("../assets/images/posts/9gag/0/6.jpg"),
        type: "image",
      },
      {
        source: require("../assets/images/posts/9gag/0/7.jpg"),
        type: "image",
      },
    ],
    comments: [
      { user: "Tom Holland", comment: "All fun and games until i join in 😏" },
    ],
    caption: "Daily Olympics in Tokyo",
    likes: 122468,
  },
  {
    logo: require("../assets/images/profiles/rock.jpg"),
    title: "therock",
    content: [
      {
        source: require("../assets/images/posts/therock/0/0.jpg"),
        type: "image",
      },
    ],
    comments: [{ user: "sevenbucksprod", comment: "Audience first💯👊🏼" }],
    caption: "Captains of Industry 🥃",
    likes: 915943,
  },
  {
    logo: require("../assets/images/profiles/novo.jpg"),
    title: "novoamor",
    content: [
      {
        source: require("../assets/images/posts/novoamor/0/0.jpg"),
        type: "image",
      },
    ],
    comments: [{ user: "evilashr", comment: "ena que kkj nao tenho dinheiro" }],
    caption: "Brazil 2022. On sale now.",
    likes: 14304,
  },
  {
    logo: require("../assets/images/profiles/conan.jpg"),
    title: "conangray",
    content: [
      {
        source: require("../assets/videos/posts/conan/0/0.mp4"),
        type: "video",
      },
    ],
    comments: [{ user: "kindalukacouffaine", comment: "PERFECT<3" }],
    caption: "Conan X Bershka is here 🌹",
    likes: 122468,
  },
  {
    logo: require("../assets/images/profiles/sanholo.jpg"),
    title: "sanholobeats",
    content: [
      {
        source: require("../assets/images/posts/sanholobeats/0/0.jpg"),
        type: "image",
      },
      {
        source: require("../assets/videos/posts/sanholobeats/0/0.mp4"),
        type: "video",
      },
      {
        source: require("../assets/videos/posts/sanholobeats/0/1.mp4"),
        type: "video",
      },
      {
        source: require("../assets/images/posts/sanholobeats/0/1.jpg"),
        type: "image",
      },
    ],
    comments: [{ user: "chetporter", comment: "insane" }],
    caption: "yooo ❤️ i just uploaded all the stems from the album!",
    likes: 13824,
  },
];

const HomeScreen = () => {
  const [loaded] = useFonts({
    InstagramRegular: require("../assets/fonts/regular.otf"),
    InstagramBold: require("../assets/fonts/bold.otf"),
  });
  const [scroll, setScroll] = useState(0);

  if (!loaded) return null;
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View
        style={{
          ...styles.navbar,
          borderBottomColor: scroll > 10 ? "rgba(0,0,0,0.0975)" : colors.white,
          borderBottomWidth: scroll > 10 ? 0.5 : 0,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome name="plus-square-o" size={24} color="black" />
        </View>
        <View
          style={{
            flex: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.header}>Instagram</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/icons/messenger.png")}
            style={{ height: 24, width: 24 }}
          />
        </View>
      </View>
      <View style={styles.feedContainer}>
        <FlatList
          data={[{}, ...feed]}
          onScroll={(e) => {
            setScroll(e.nativeEvent.contentOffset.y);
          }}
          renderItem={({ item, index }) => {
            if (index == 0)
              return (
                <View style={styles.storyContainer}>
                  <FlatList
                    horizontal={true}
                    data={stories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={(itemData) => {
                      return (
                        <View style={styles.storyImgLabelContainer}>
                          <LinearGradient
                            colors={["#DD2A7B", "#F58529"]}
                            style={styles.outlineGradient}
                          >
                            <View style={styles.imageContainer}>
                              <Image
                                source={itemData.item.photo}
                                style={styles.storyImage}
                              />
                            </View>
                          </LinearGradient>
                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={{ fontSize: 12 }}
                          >
                            {itemData.item.name}
                          </Text>
                        </View>
                      );
                    }}
                  />
                </View>
              );
            return <FeedCard {...item} />;
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  feedContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  navbar: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: colors.white,
    flexDirection: "row",
  },
  header: {
    fontFamily: "InstagramRegular",
    fontSize: 28,
  },
  storyContainer: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 0.5,
  },
  storyImgLabelContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    marginHorizontal: 8,
  },
  outlineGradient: {
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    transform: [
      {
        rotateZ: "30deg",
      },
    ],
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    height: 70,
    width: 70,
    borderColor: "transparent",
    borderRadius: 35,
    borderWidth: 2,
  },
  storyImage: {
    borderRadius: 50,
    height: 60,
    width: 60,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.0975)",
    transform: [
      {
        rotateZ: "-30deg",
      },
    ],
  },
});
