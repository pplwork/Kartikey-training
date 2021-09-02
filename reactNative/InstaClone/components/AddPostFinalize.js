import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const AddPostFinalize = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", padding: 10 }}>
        <View
          style={{ backgroundColor: "#000", height: 100, width: 100 }}
        ></View>
        <TextInput
          style={{ flex: 1, borderWidth: 1 }}
          placeholder="Enter caption"
        ></TextInput>
      </View>
    </View>
  );
};

export default AddPostFinalize;

const styles = StyleSheet.create({});
