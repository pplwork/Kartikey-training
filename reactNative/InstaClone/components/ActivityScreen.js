import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import colors from "../constants/colors";
import activities from "../data/activites";

const ActivityItem = ({ user, sub, comment, userPic, postPic, age, index }) => {
  return (
    <View key={index} style={styles.activityItemContainer}>
      <View>
        <Image
          source={userPic}
          style={{
            width: 48,
            height: 48,
            borderRadius: 48,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.0975)",
          }}
        />
      </View>
      <View style={{ flex: 1, marginHorizontal: 16 }}>
        <Text>
          <Text style={{ fontWeight: "bold" }}>{user}</Text> {sub} {comment}{" "}
          <Text style={{ color: "rgba(0,0,0,0.5)" }}>{age}</Text>
        </Text>
      </View>
      <View>
        <Image
          source={postPic}
          style={{
            width: 48,
            height: 48,
            resizeMode: "contain",
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.0975)",
          }}
        />
      </View>
    </View>
  );
};

const ActivityScreen = () => {
  const [scroll, setScroll] = useState(0);
  const scrollHandler = useCallback((e) => {
    setScroll(e.nativeEvent.contentOffset.y);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          ...styles.header,
          borderBottomColor: scroll > 10 ? "rgba(0,0,0,0.0975)" : colors.white,
          borderBottomWidth: scroll > 10 ? 0.5 : 0,
        }}
      >
        <Text style={styles.headerText}>Activity</Text>
      </View>
      <ScrollView
        onScroll={scrollHandler}
        style={styles.activity}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={styles.followRequests}>
          <View>
            <Image
              source={require("../assets/images/profiles/conan.jpg")}
              style={{ width: 48, height: 48, borderRadius: 48 }}
            />
            <View
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                backgroundColor: "red",
                height: 20,
                width: 20,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: colors.white, fontSize: 12 }}>20</Text>
            </View>
          </View>
          <View style={{ marginLeft: 16, flexDirection: "column" }}>
            <Text style={{ fontWeight: "bold" }}>Follow Requests</Text>
            <Text style={{ color: "rgba(0,0,0,0.6)" }}>
              Approve or ignore requests
            </Text>
          </View>
        </View>
        <View style={styles.activitiesHeader}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Activity</Text>
        </View>
        {activities.map((ele, index) => {
          return <ActivityItem key={index} index={index} {...ele} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(ActivityScreen);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  header: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  activity: {
    paddingVertical: 10,
    width: "100%",
    paddingHorizontal: "5%",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  followRequests: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  activitiesHeader: {
    width: "100%",
    marginVertical: 20,
  },
  activityItemContainer: {
    width: "100%",
    flexDirection: "row",
    marginVertical: 12,
  },
});
