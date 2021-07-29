import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Play from "./Buttons/Play";
import Stop from "./Buttons/Stop";
import Lap from "./Buttons/Lap";
import Reset from "./Buttons/Reset";

const Controls = ({ stopWatch, setStopWatch }) => {
  return (
    <View style={styles.controlsContainer}>
      <Play stopWatch={stopWatch} setStopWatch={setStopWatch} />
      <Stop stopWatch={stopWatch} setStopWatch={setStopWatch} />
      <Lap stopWatch={stopWatch} setStopWatch={setStopWatch} />
      <Reset stopWatch={stopWatch} setStopWatch={setStopWatch} />
    </View>
  );
};

export default React.memo(Controls);

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 30,
  },
});
