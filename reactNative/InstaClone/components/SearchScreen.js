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
const SearchScreen = () => {
  const isMounted = useRef(true);
  const [gridData, setGridData] = useState(Array(12).fill("notLoaded"));
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    (async () => {
      let docs,
        data = [];
      const trace = perf().startTrace("Fetching Explore Images");
      crashlytics().log("Fetching explore screen image url refs");
      try {
        docs = await firestore().collection("explore").get();
        data = docs.docs.map((doc) => doc.data());
      } catch (err) {
        crashlytics().recordError(err);
      }
      let promiseArray = [];
      data.forEach((doc) => {
        promiseArray.push(storage().refFromURL(doc.source).getDownloadURL());
      });
      crashlytics().log("Resolving explore screen image urls");
      Promise.all(promiseArray)
        .then((URIArray) => {
          let gData = data.map((doc, index) => {
            return {
              ...doc,
              source: URIArray[index],
            };
          });
          if (isMounted.current) setGridData(gData);
        })
        .catch((err) => {
          crashlytics().recordError(err);
        });
      await trace.stop();
    })();
  }, []);
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
          onEndEditing={(e) =>
            Analytics().logEvent("SearchingInExploreFeed", {
              query: e.nativeEvent.text,
            })
          }
        />
      </View>
      <InstaGrid data={gridData} />
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
