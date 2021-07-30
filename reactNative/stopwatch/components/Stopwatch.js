import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Timer from "./Timer";
import Controls from "./Controls";
import Laps from "./Laps";

const Stopwatch = () => {
  const [stopWatch, setStopWatch] = useState({
    laps: [],
    isRunning: false,
    elapsed: 0,
    resetNextRun: false,
    intervalID: null,
  });
  return (
    <View style={styles.container}>
      <Timer stopWatch={stopWatch} />
      <Controls stopWatch={stopWatch} setStopWatch={setStopWatch} />
      <Laps laps={stopWatch.laps} />
    </View>
  );
};

export default React.memo(Stopwatch);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9f2f7",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 0,
  },
});
