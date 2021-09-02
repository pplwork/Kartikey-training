import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import HomeHeader from "./HomeHeader";
import FeedList from "./FeedList";

const HomeScreen = ({ navigation }) => {
  const [scroll, setScroll] = useState(0);
  const scrollHandler = useCallback((e) => {
    setScroll(e.nativeEvent.contentOffset.y);
  }, []);
  return (
    <>
      <HomeHeader scroll={scroll} navigation={navigation} />
      <FeedList navigation={navigation} scrollHandler={scrollHandler} />
    </>
  );
};

export default React.memo(HomeScreen);

const styles = StyleSheet.create({});
