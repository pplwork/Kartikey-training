import React from "react";
import { StyleSheet, Text, TextInput, View, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const AddPostFinalize = () => {
  const dispatch = useDispatch();
  const { selected, multiSelected, enableMultiselect, caption } = useSelector(
    (state) => state
  );
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <View
          style={{
            height: 75,
            width: 75,
            marginRight: 10,
          }}
        >
          <Image
            style={{ flex: 1 }}
            source={{ uri: enableMultiselect ? multiSelected[0] : selected }}
          />
        </View>
        <TextInput
          multiline
          numberOfLines={4}
          style={{ flex: 1 }}
          placeholder="Write a caption..."
          value={caption}
          onChangeText={(e) => dispatch({ type: "SET_CAPTION", payload: e })}
        ></TextInput>
      </View>
    </View>
  );
};

export default AddPostFinalize;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
});
