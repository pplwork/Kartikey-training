import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import colors from "../constants/colors";
import { AntDesign } from "@expo/vector-icons";
import InstaGrid from "./InstaGrid";
import { storage, db } from "../firebase";

const SearchScreen = () => {
  const isMounted = useRef(true);
  const [gridData, setGridData] = useState([]);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    (async () => {
      console.time("getting explore images");
      let docs = await db.collection("explore").get();
      console.timeEnd("getting explore images");
      docs = docs.docs;
      for (const doc of docs) {
        let data = doc.data();
        console.time("gettingEXPLOREimageurl");
        let uri = await storage.refFromURL(data.source).getDownloadURL();
        console.timeEnd("gettingEXPLOREimageurl");
        data.source = uri;
        if (isMounted.current) setGridData((prev) => [...prev, data]);
      }
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
        <TextInput placeholder="Search" style={{ fontSize: 16 }} />
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
