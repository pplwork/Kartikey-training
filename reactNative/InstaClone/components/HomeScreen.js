import React, { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import HomeHeader from "./HomeHeader";
import FeedList from "./FeedList";

const HomeScreen = () => {
  const [scroll, setScroll] = useState(0);
  const scrollHandler = useCallback((e) => {
    setScroll(e.nativeEvent.contentOffset.y);
  }, []);
  return (
    <>
      <HomeHeader scroll={scroll} />
      <FeedList scrollHandler={scrollHandler} />
    </>
  );
};

export default React.memo(HomeScreen);

const styles = StyleSheet.create({});
