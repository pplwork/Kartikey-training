import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, TextInput } from "react-native";
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
  const fetchPosts = async () => {
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
      if (isMounted.current && docs)
        setOffset(docs.slice(-1)[0].data().createdAt);
    } catch (err) {
      crashlytics().recordError(err);
      console.log("SearchScreen.js : ", err);
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
      return;
    }
    if (isMounted.current) {
      if (gridData.includes("notLoaded")) setGridData(data);
      else setGridData((prev) => [...prev, ...data]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const findUsers = async (text) => {
    console.log(text);
    let docs1 = [],
      docs2 = [];
    try {
      docs1 = (
        await firestore()
          .collection("users")
          .where("Username", ">=", text.toLowerCase().trim())
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
          .where("Name", ">=", text.toLowerCase().trim())
          .orderBy("Name", "asc")
          .get()
      ).docs;
    } catch (err) {
      crashlytics().recordError(err);
      console.log("SearchScreen.js  : ", err);
    }
    let docs3 = docs1.concat(docs2);
    docs3 = [...new Set(docs3)];
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <AntDesign
          name="search1"
          size={16}
          color="black"
          style={{ marginRight: 12 }}
        />
        <TextInput
          placeholder="Search"
          style={{ fontSize: 16 }}
          onEndEditing={(e) => {
            Analytics().logEvent("SearchingInExploreFeed", {
              query: e.nativeEvent.text,
            });
            findUsers(e.nativeEvent.text);
          }}
        />
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
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.0975)",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 12,
  },
});
