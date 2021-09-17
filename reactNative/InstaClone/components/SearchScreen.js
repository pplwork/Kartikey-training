import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  Text,
  Pressable,
} from "react-native";
import colors from "../constants/colors";
import { AntDesign } from "@expo/vector-icons";
import InstaGrid from "./InstaGrid";
import Analytics from "@react-native-firebase/analytics";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import crashlytics from "@react-native-firebase/crashlytics";
import perf from "@react-native-firebase/perf";
import auth from "@react-native-firebase/auth";
import { createThumbnail } from "react-native-create-thumbnail";
import { useSelector } from "react-redux";
import _debounce from "lodash/debounce";

const win = Dimensions.get("window");
const SearchScreen = ({ navigation }) => {
  const isMounted = useRef(true);
  const [gridData, setGridData] = useState(Array(12).fill("notLoaded"));
  const { user } = useSelector((state) => state);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [offset, setOffset] = useState(null);
  const [searchUsers, setSearchUsers] = useState([]);
  const isFetching = useRef(false);
  const fetchPosts = async () => {
    // if was already fetching, dont fetch again
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;
    let docs = [];
    try {
      // check if first fetch or next fetch
      if (offset) {
        // get 12 posts from the last offset
        docs = (
          await firestore()
            .collection("posts")
            .orderBy("createdAt", "desc")
            .startAfter(offset)
            .limit(12)
            .get()
        ).docs;
      } else {
        docs = (
          await firestore()
            .collection("posts")
            .orderBy("createdAt", "desc")
            .limit(12)
            .get()
        ).docs;
      }
      // save the value of last posts createdAt in offset for fetching next time
      if (isMounted.current && docs) {
        if (docs.length) setOffset(docs.slice(-1)[0].data().createdAt);
      }
    } catch (err) {
      crashlytics().recordError(err);
      console.log("SearchScreen.js : ", err);
      isFetching.current = false;
      return;
    }
    let data = [];
    // resolve all the post sources and populate gridData
    try {
      data = await Promise.all(
        docs.map(async (doc) => {
          let { content } = doc.data();
          let uri = "";
          try {
            uri = await storage()
              .refFromURL(content[0].source)
              .getDownloadURL();
          } catch (err) {
            crashlytics().recordError(err);
            console.log("SearchScreen.js : ", err);
          }
          let thumbnail = "";
          if (content[0].type == "image") thumbnail = uri;
          else {
            try {
              thumbnail = (await createThumbnail({ url: uri })).path;
            } catch (err) {
              crashlytics().recordError(err);
              console.log("SearchScreen.js : ", err);
            }
          }
          return {
            id: doc.id,
            source: uri,
            thumbnail: thumbnail,
            type: content[0].type,
          };
        })
      );
    } catch (err) {
      crashlytics().recordError(err);
      console.log("SearchScreen.js : ", err);
      isFetching.current = false;
      return;
    }
    if (isMounted.current) {
      if (gridData.includes("notLoaded")) setGridData(data);
      else setGridData((prev) => [...prev, ...data]);
    }
    isFetching.current = false;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const findUsers = async (text) => {
    text = text.toLowerCase().trim();
    if (text == "") {
      setSearchUsers([]);
      return;
    }
    let docs1 = [],
      docs2 = [];
    try {
      docs1 = (
        await firestore()
          .collection("users")
          .where("Username", ">=", text)
          .where("Username", "<=", text + "\uf8ff")
          .orderBy("Username", "asc")
          .get()
      ).docs;
    } catch (err) {
      crashlytics().recordError(err);
      console.log("SearchScreen.js : ", err);
    }
    try {
      docs2 = (
        await firestore()
          .collection("users")
          .where("Name", ">=", text)
          .where("Name", "<=", text + "\uf8ff")
          .orderBy("Name", "asc")
          .get()
      ).docs;
    } catch (err) {
      crashlytics().recordError(err);
      console.log("SearchScreen.js  : ", err);
    }
    let docs3 = docs1.concat(docs2);
    docs3 = [...new Set(docs3)];
    try {
      docs3 = await Promise.all(
        docs3.map(async (doc) => {
          let data = doc.data();
          let pfp = "";
          try {
            pfp = await storage().refFromURL(data.Photo).getDownloadURL();
          } catch (err) {
            crashlytics().recordError(err);
            console.log("SearchScreen.js : ", err);
          }
          return {
            uid: doc.id,
            Photo: pfp,
            Username: data.Username,
            Name: data.Name,
          };
        })
      );
    } catch (err) {
      crashlytics().recordError(err);
      console.log("SearchScreen.js : ", err);
    }
    setSearchUsers(docs3);
  };

  const debounceSearch = useCallback(_debounce(findUsers, 500), []);
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 4,
          }}
        >
          <AntDesign
            name="search1"
            size={16}
            color="black"
            style={{ marginRight: 12 }}
          />
          <TextInput
            placeholder="Search"
            style={{ fontSize: 16 }}
            onChangeText={debounceSearch}
          />
        </View>
        <View style={styles.searchResults}>
          <FlatList
            data={searchUsers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              console.log("item", item);
              return (
                <Pressable
                  style={({ pressed }) => {
                    if (!pressed) return styles.searchCard;
                    else
                      return [
                        styles.searchCard,
                        { backgroundColor: "#d5d5d5" },
                      ];
                  }}
                  onPress={() => {
                    navigation
                      .dangerouslyGetParent()
                      .navigate("User", { id: item.uid });
                  }}
                >
                  <Image
                    source={{ uri: item.Photo }}
                    style={styles.searchCardImage}
                  />
                  <View style={styles.searchCardText}>
                    <Text style={styles.searchCardUsername}>
                      {item.Username}
                    </Text>
                    <Text style={styles.searchCardName}>{item.Name}</Text>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
      </View>
      <InstaGrid
        data={gridData}
        navigation={navigation.dangerouslyGetParent()}
        fetchPosts={fetchPosts}
      />
    </View>
  );
};

export default React.memo(SearchScreen);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 12,
    backgroundColor: colors.white,
    flex: 1,
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "column",
    width: "90%",
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
    marginBottom: 12,
    zIndex: 100,
  },
  searchResults: {
    width: "100%",
    backgroundColor: "#e5e5e5",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchCardImage: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginRight: 15,
  },
  searchCardText: {},
  searchCardUsername: {
    fontWeight: "bold",
  },
  searchCardName: {
    color: "rgba(0,0,0,0.4)",
  },
});
