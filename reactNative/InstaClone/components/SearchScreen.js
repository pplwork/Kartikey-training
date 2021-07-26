import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import colors from "../constants/colors";
import { AntDesign } from "@expo/vector-icons";
import InstaGrid from "./InstaGrid";

const gridData = [
  {
    source: require("../assets/images/griddata/0.jpg"),
    type: "image",
  },
  {
    source: require("../assets/images/griddata/1.jpg"),
    type: "image",
  },
  {
    source: require("../assets/images/griddata/2.jpg"),
    type: "image",
  },
  {
    source: require("../assets/images/griddata/3.jpg"),
    type: "image",
  },
  {
    source: require("../assets/images/griddata/4.jpg"),
    type: "image",
  },
  {
    source: require("../assets/images/griddata/5.jpg"),
    type: "image",
  },
  {
    source: require("../assets/images/griddata/6.jpg"),
    type: "image",
  },
  {
    source: require("../assets/images/griddata/7.jpg"),
    type: "image",
  },
  {
    source: require("../assets/images/griddata/8.jpg"),
    type: "image",
  },
  {
    source: require("../assets/images/griddata/9.jpg"),
    type: "image",
  },
  {
    source: require("../assets/images/griddata/10.jpg"),
    type: "image",
  },
  {
    source: require("../assets/images/griddata/11.jpg"),
    type: "image",
  },
  {
    source: require("../assets/images/griddata/12.jpg"),
    type: "image",
  },
];

const SearchScreen = () => {
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

export default SearchScreen;

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
