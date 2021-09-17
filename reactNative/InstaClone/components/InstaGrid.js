import React, { useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Text,
  Pressable,
} from "react-native";
var { width } = Dimensions.get("window");
import * as _ from "lodash";

const InstaGrid = ({ data, navigation, fetchPosts }) => {
  let currentRow = 0;
  const groupEveryNthRow = 3;
  const rowsArray = _.chunk(data, 3);
  let side = "right";

  const renderGroupedItem = (row) => {
    const smallImage1 = row[0];
    const smallImage2 = row[1];
    const largeImage = row[2];
    if (side === "right") {
      side = "left";
      return (
        <View style={styles.rowContainer} key={currentRow}>
          <View style={styles.colContainer2}>
            <View style={{ ...styles.imageContainer, marginBottom: 3 }}>
              {smallImage1 == "notLoaded" ? (
                <View
                  style={{
                    ...styles.imageThumbnail,
                    backgroundColor: "rgb(220,220,220)",
                  }}
                ></View>
              ) : (
                <Pressable
                  onPress={() =>
                    navigation.navigate("Post", { id: smallImage1.id })
                  }
                >
                  <Image
                    style={styles.imageThumbnail}
                    source={{ uri: smallImage1 && smallImage1.thumbnail }}
                  />
                </Pressable>
              )}
            </View>
            <View style={styles.imageContainer}>
              {smallImage1 == "notLoaded" ? (
                <View
                  style={{
                    ...styles.imageThumbnail,
                    backgroundColor: "rgb(220,220,220)",
                  }}
                ></View>
              ) : (
                <Pressable
                  onPress={() =>
                    navigation.navigate("Post", { id: smallImage2.id })
                  }
                >
                  <Image
                    style={styles.imageThumbnail}
                    source={{ uri: smallImage2 && smallImage2.thumbnail }}
                  />
                </Pressable>
              )}
            </View>
          </View>
          <View style={{ ...styles.imageContainer, marginLeft: 3 }}>
            {smallImage1 == "notLoaded" ? (
              <View
                style={{
                  ...styles.imageThumbnailLarge,
                  backgroundColor: "rgb(220,220,220)",
                }}
              ></View>
            ) : (
              <Pressable
                onPress={() =>
                  navigation.navigate("Post", { id: largeImage.id })
                }
              >
                <Image
                  style={styles.imageThumbnailLarge}
                  source={{ uri: largeImage && largeImage.thumbnail }}
                />
              </Pressable>
            )}
          </View>
        </View>
      );
    } else {
      side = "right";
      return (
        <View style={styles.rowContainer} key={currentRow}>
          <View style={{ ...styles.imageContainer, marginRight: 3 }}>
            {smallImage1 == "notLoaded" ? (
              <View
                style={{
                  ...styles.imageThumbnailLarge,
                  backgroundColor: "rgb(220,220,220)",
                }}
              ></View>
            ) : (
              <Pressable
                onPress={() =>
                  navigation.navigate("Post", { id: largeImage.id })
                }
              >
                <Image
                  style={styles.imageThumbnailLarge}
                  source={{ uri: largeImage && largeImage.thumbnail }}
                />
              </Pressable>
            )}
          </View>
          <View style={styles.colContainer2}>
            <View style={{ ...styles.imageContainer, marginBottom: 3 }}>
              {smallImage1 == "notLoaded" ? (
                <View
                  style={{
                    ...styles.imageThumbnail,
                    backgroundColor: "rgb(220,220,220)",
                  }}
                ></View>
              ) : (
                <Pressable
                  onPress={() =>
                    navigation.navigate("Post", { id: smallImage1.id })
                  }
                >
                  <Image
                    style={styles.imageThumbnail}
                    source={{ uri: smallImage1 && smallImage1.thumbnail }}
                  />
                </Pressable>
              )}
            </View>
            <View style={styles.imageContainer}>
              {smallImage1 == "notLoaded" ? (
                <View
                  style={{
                    ...styles.imageThumbnail,
                    backgroundColor: "rgb(220,220,220)",
                  }}
                ></View>
              ) : (
                <Pressable
                  onPress={() =>
                    navigation.navigate("Post", { id: smallImage2.id })
                  }
                >
                  <Image
                    style={styles.imageThumbnail}
                    source={{ uri: smallImage2 && smallImage2.thumbnail }}
                  />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      );
    }
  };

  const renderCell = (row) => {
    if (currentRow % groupEveryNthRow === 0) {
      currentRow++;
      return renderGroupedItem(row);
    }
    currentRow++;
    return (
      <View style={styles.rowContainer} key={currentRow}>
        <View style={styles.imageContainer}>
          {row[0] == "notLoaded" ? (
            <View
              style={{
                ...styles.imageThumbnail,
                backgroundColor: "rgb(220,220,220)",
              }}
            ></View>
          ) : (
            <Pressable
              onPress={() => navigation.navigate("Post", { id: row[0].id })}
            >
              <Image
                style={styles.imageThumbnail}
                source={{ uri: row[0] && row[0].thumbnail }}
              />
            </Pressable>
          )}
        </View>
        <View style={{ ...styles.imageContainer, marginHorizontal: 3 }}>
          {row[1] == "notLoaded" ? (
            <View
              style={{
                ...styles.imageThumbnail,
                backgroundColor: "rgb(220,220,220)",
              }}
            ></View>
          ) : (
            <Pressable
              onPress={() => navigation.navigate("Post", { id: row[1].id })}
            >
              <Image
                style={styles.imageThumbnail}
                source={{ uri: row[1] && row[1].thumbnail }}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.imageContainer}>
          {row[2] == "notLoaded" ? (
            <View
              style={{
                ...styles.imageThumbnail,
                backgroundColor: "rgb(220,220,220)",
              }}
            ></View>
          ) : (
            <Pressable
              onPress={() => navigation.navigate("Post", { id: row[2].id })}
            >
              <Image
                style={styles.imageThumbnail}
                source={{ uri: row[2] && row[2].thumbnail }}
              />
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <ScrollView
      style={{ width: "100%", zIndex: 0 }}
      onMomentumScrollEnd={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          fetchPosts();
        }
      }}
      scrollEventThrottle={1000}
    >
      <View style={styles.mainContainer}>
        {rowsArray.map((row) => {
          return renderCell(row);
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
  },
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 3,
  },
  imageContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
  imageThumbnail: {
    width: width / 3 - 2,
    height: width / 3 - 2,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    alignItems: "flex-start",
  },
  imageThumbnailLarge: {
    width: width * (2 / 3) - 1,
    height: width * (2 / 3) - 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    alignItems: "flex-start",
  },
  colContainer2: {
    flexDirection: "column",
  },
});

export default React.memo(InstaGrid);
