import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  FontAwesome,
  Entypo,
} from "@expo/vector-icons";
import colors from "../constants/colors";
import * as _ from "lodash";

const win = Dimensions.get("window");

import gridContent from "../data/userprofilegrid";
import stories from "../data/userprofilestories";

const rows = _.chunk(gridContent, 3);

const ProfileScreen = () => {
  const keyExtractor = useCallback((item) => item.id.toString(), []);
  const renderItem = useCallback((itemData) => {
    return (
      <View style={styles.storyImgLabelContainer}>
        <View style={styles.storyImgContainer}>
          <Image source={itemData.item.photo} style={styles.storyImage} />
        </View>
        <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: 12 }}>
          {itemData.item.name}
        </Text>
      </View>
    );
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="md-lock-closed-outline" size={20} color="black" />
          <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 5 }}>
            benbenabraham
          </Text>
          <Entypo
            name="chevron-small-down"
            size={24}
            color="black"
            style={{ alignSelf: "flex-end" }}
          />
        </View>
        <View style={styles.headerRight}>
          <FontAwesome
            name="plus-square-o"
            size={24}
            color="black"
            style={{ marginHorizontal: 20 }}
          />
          <FontAwesome name="bars" size={24} color="black" />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profile}>
          <View style={styles.profileLeft}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/images/profiles/pfp.jpg")}
                style={styles.profileImage}
              />
            </View>

            <View style={{ marginTop: 6 }}>
              <Text style={{ fontWeight: "bold" }}>Ben Abraham</Text>
            </View>
          </View>
          <View style={styles.profileRight}>
            <View style={styles.statsContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>1,032</Text>
              <Text>Posts</Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>24.1K</Text>
              <Text>Followers</Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>248</Text>
              <Text>Following</Text>
            </View>
          </View>
        </View>
        <View style={styles.bio}>
          <Text>Australian Indonesian making music for the money</Text>
        </View>
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
              marginRight: 6,
              borderRadius: 4,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.0975)",
              paddingVertical: 5,
              paddingHorizontal: 6,
              borderRadius: 4,
            }}
          >
            <Entypo name="chevron-small-down" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{ width: "95%" }}>
          <Text style={{ fontWeight: "bold" }}>Story Highlights</Text>
        </View>
        <View style={styles.storyContainer}>
          <FlatList
            horizontal={true}
            data={stories}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
        </View>
        <View style={styles.gridContainer}>
          {rows.map((item, index) => {
            return (
              <View style={styles.gridRow} key={index}>
                <View style={styles.gridImageContainer}>
                  <Image source={item[0].source} style={styles.gridImage} />
                  <View style={{ position: "absolute", right: 8, top: 8 }}>
                    {item[0].type == "video" ? (
                      <FontAwesome5 name="play" size={14} color="white" />
                    ) : (
                      false
                    )}
                    {item[0].type == "stack" ? (
                      <Image
                        source={require("../assets/icons/carousel.png")}
                        style={{ height: 20, width: 20 }}
                      />
                    ) : (
                      false
                    )}
                    {item[0].type == "reel" ? (
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
                  style={{ ...styles.gridImageContainer, marginHorizontal: 3 }}
                >
                  <Image source={item[1].source} style={styles.gridImage} />
                  <View style={{ position: "absolute", right: 8, top: 8 }}>
                    {item[1].type == "video" ? (
                      <FontAwesome5 name="play" size={14} color="white" />
                    ) : (
                      false
                    )}
                    {item[1].type == "stack" ? (
                      <Image
                        source={require("../assets/icons/carousel.png")}
                        style={{ height: 20, width: 20 }}
                      />
                    ) : (
                      false
                    )}
                    {item[1].type == "reel" ? (
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
                  <Image source={item[2].source} style={styles.gridImage} />
                  <View style={{ position: "absolute", right: 8, top: 8 }}>
                    {item[1].type == "video" ? (
                      <FontAwesome5 name="play" size={14} color="white" />
                    ) : (
                      false
                    )}
                    {item[1].type == "stack" ? (
                      <Image
                        source={require("../assets/icons/carousel.png")}
                        style={{ height: 20, width: 20 }}
                      />
                    ) : (
                      false
                    )}
                    {item[1].type == "reel" ? (
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
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
});
