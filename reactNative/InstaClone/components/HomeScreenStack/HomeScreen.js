import { useIsFocused } from "@react-navigation/native";
import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { StyleSheet } from "react-native";
import HomeHeader from "../HomeHeader";
import FeedList from "../FeedList";

const HomeScreen = ({ navigation, tabNavigator }) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    tabNavigator.setOptions({
      tabBarVisible: true,
    });
  }, [isFocused]);
  const [scroll, setScroll] = useState(0);
  const scrollHandler = useCallback((e) => {
    setScroll(e.nativeEvent.contentOffset.y);
  }, []);
  return (
    <>
      <HomeHeader scroll={scroll} />
      <FeedList navigation={navigation} scrollHandler={scrollHandler} />
    </>
  );
};

export default React.memo(HomeScreen);

const styles = StyleSheet.create({});
