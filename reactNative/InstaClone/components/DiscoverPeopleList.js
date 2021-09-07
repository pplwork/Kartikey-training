import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import DiscoverPeopleCard from "./DiscoverPeopleCard";

import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import crashlytics from "@react-native-firebase/crashlytics";
import auth from "@react-native-firebase/auth";
import { useSelector } from "react-redux";

const getRandom = (arr, n) => {
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

const DiscoverPeopleList = () => {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const { user } = useSelector((state) => state);
  const [discoverPeopleData, setDiscoverPeopleData] = useState([]);
  useEffect(() => {
    (async () => {
      let docs = [];
      let users = [];
      try {
        docs = (await firestore().collection("users").get()).docs;
        users = docs.map((doc) => ({ uid: doc.id, data: doc.data() }));
        users = users.filter(
          (ele) =>
            !user.Following.includes(ele.uid) &&
            ele.uid != auth().currentUser.uid
        );
      } catch (err) {
        crashlytics().recordError(err);
      }

      // get image, mutuals,name
      let people = await Promise.all(
        users.map(async (ele) => {
          let uri = "";
          try {
            uri = await storage().refFromURL(ele.data.Photo).getDownloadURL();
          } catch (err) {
            crashlytics().recordError(err);
          }
          let mutual = [];
          for (const follower of ele.data.Followers) {
            if (user.Following.includes(follower)) mutual.push(follower);
          }
          return {
            name: ele.data.Username,
            image: uri,
            mutual,
            uid: ele.uid,
          };
        })
      );
      people.sort((a, b) => {
        if (a.mutual.length > b.mutual.length) return -1;
        else return 1;
      });
      setDiscoverPeopleData(getRandom(people, Math.min(5, people.length)));
    })();
  }, [user]);

  const keyExtractorIndex = useCallback((item, index) => index.toString(), []);

  const renderItemDiscover = useCallback(
    ({ item }) => <DiscoverPeopleCard {...item} />,
    []
  );
  return (
    <>
      <View
        style={{
          width: "95%",
          marginVertical: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "bold" }}>Discover People</Text>
        <TouchableOpacity>
          <Text style={{ color: "#1890ff", fontWeight: "bold" }}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 20 }}
        horizontal
        data={discoverPeopleData}
        renderItem={renderItemDiscover}
        keyExtractor={keyExtractorIndex}
      />
    </>
  );
};

export default React.memo(DiscoverPeopleList);

const styles = StyleSheet.create({});
