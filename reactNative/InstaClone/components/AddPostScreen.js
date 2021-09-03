import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
  Pressable,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";
import CameraRoll from "@react-native-community/cameraroll";
import { useDispatch, useSelector } from "react-redux";
const win = Dimensions.get("window");
const AddPostScreen = () => {
  const [photos, setPhotos] = useState([]);
  const lastCursor = useRef(undefined);
  const { selected, multiSelected, enableMultiselect } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "SET_SELECTED", payload: "" });
    dispatch({ type: "SET_ENABLEMUTLISELECT", payload: false });
    dispatch({ type: "SET_MULTISELECTED", payload: [] });
    dispatch({ type: "SET_CAPTION", payload: "" });
  }, []);
  const askPermission = async () => {
    if (Platform.OS === "android") {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Permission Explanation",
          message: "InstaClone would like to access your photos!",
        }
      );
      if (result !== "granted") {
        console.log("Access to pictures was denied");
        return;
      } else {
        loadPhotos();
      }
    } else {
      loadPhotos();
    }
  };

  const loadPhotos = () => {
    console.log(lastCursor.current);
    CameraRoll.getPhotos({
      first: 50,
      assetType: "All",
      after: lastCursor.current,
    })
      .then((r) => {
        // uncomment after library has been fixed
        // setPhotos((prev) => [...prev, ...r.edges]);
        setPhotos(r.edges);
        if (selected == null) {
          dispatch({
            type: "SET_SELECTED",
            payload: photos.length
              ? photos[0].node.image.uri
              : r.edges[0].node.image.uri,
          });
        }
        lastCursor.current = r.page_info.end_cursor;
      })
      .catch((err) => console.log);
  };
  useEffect(() => {
    askPermission();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ width: "100%", height: win.height / 2 }}>
        {selected &&
        selected.match(/.*\.(jpg|jpeg|jfif|png|mp4)/)[1] == "mp4" ? (
          <Video
            isLooping
            shouldPlay
            source={{ uri: selected }}
            style={{ flex: 1 }}
            resizeMode="contain"
            isMuted
          />
        ) : (
          <Image
            source={{ uri: selected }}
            style={{ flex: 1, resizeMode: "contain" }}
          />
        )}
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Pressable
          style={{
            padding: 5,
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: enableMultiselect ? "#000" : "#fff",
          }}
          onPress={() =>
            dispatch({
              type: "SET_ENABLEMULTISELECT",
              payload: !enableMultiselect,
            })
          }
        >
          <Text style={{ color: enableMultiselect ? "#fff" : "#000" }}>
            Multiselect
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={photos}
        numColumns={4}
        onEndReachedThreshold={0.5}
        onEndReached={loadPhotos}
        keyExtractor={(item, index) => index.toString()}
        style={{ flex: 1, overflow: "scroll" }}
        renderItem={({ item }) => (
          <Pressable
            style={{
              width: win.width / 4,
              height: win.width / 4,
              borderWidth: 1,
              borderColor: "#fff",
              opacity: selected == item.node.image.uri ? 0.6 : 1,
            }}
            onPress={() => {
              dispatch({ type: "SET_SELECTED", payload: item.node.image.uri });
            }}
          >
            <Image
              source={{ uri: item.node.image.uri }}
              style={{ height: "100%", width: "100%", position: "relative" }}
            />
            {enableMultiselect && (
              <Pressable
                onPress={() => {
                  dispatch({
                    type: "SET_SELECTED",
                    payload: item.node.image.uri,
                  });
                  if (multiSelected.includes(item.node.image.uri))
                    dispatch({
                      type: "SET_MULTISELECTED",
                      payload: multiSelected.filter(
                        (val) => val != item.node.image.uri
                      ),
                    });
                  else
                    dispatch({
                      type: "SET_MULTISELECTED",
                      payload: [...multiSelected, item.node.image.uri],
                    });
                }}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  height: 20,
                  width: 20,
                  borderRadius: 20,
                  borderWidth: 2,
                  zIndex: 200,
                  borderColor: "#fff",
                  backgroundColor: multiSelected.includes(item.node.image.uri)
                    ? "#1890ff"
                    : "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff" }}>
                  {multiSelected.includes(item.node.image.uri) &&
                    multiSelected.findIndex(
                      (val) => val == item.node.image.uri
                    ) + 1}
                </Text>
              </Pressable>
            )}
          </Pressable>
        )}
      />
    </View>
  );
};

export default React.memo(AddPostScreen);

const styles = StyleSheet.create({});
