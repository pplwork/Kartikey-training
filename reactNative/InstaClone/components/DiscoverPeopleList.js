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

const DiscoverPeopleList = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [discoverPeopleData, setDiscoverPeopleData] = useState([]);
  useEffect(() => {
    (async () => {
      let docs,
        data = [];
      crashlytics().log("Fetching Discover People Data");
      try {
        docs = await firestore().collection("discoverPeople").get();
        data = docs.docs.map((doc) => doc.data());
      } catch (err) {
        crashlytics().recordError(err);
      }
      crashlytics().log("Resolving Discover People Image URLS");
      data.forEach((doc) => {
        storage()
          .refFromURL(doc.image)
          .getDownloadURL()
          .then((uri) => {
            if (isMounted.current)
              setDiscoverPeopleData((prev) => [
                ...prev,
                {
                  ...doc,
                  image: uri,
                },
              ]);
          })
          .catch((err) => crashlytics().recordError(err));
      });
    })();
  }, []);

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
