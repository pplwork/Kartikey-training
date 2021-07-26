import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import colors from "../constants/colors";
import { AntDesign } from "@expo/vector-icons";
import InstaGrid from "./InstaGrid";
import gridData from "../data/searchgrid";

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
