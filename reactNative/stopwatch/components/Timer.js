import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

const win = Dimensions.get("window");

const timeParser = (time) => {
  let hours = Math.floor(time / (60 * 60 * 1000));
  let minutes = Math.floor((time - hours * (60 * 60 * 1000)) / (60 * 1000));
  let seconds = Math.floor(
    (time - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / 1000
  );
  let milliseconds = Math.floor(
    (time - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000) / 10
  );
  return `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}:${
    milliseconds < 10 ? "0" + milliseconds : milliseconds
  }`;
};

const Timer = ({ stopWatch }) => {
  return (
    <View style={styles.clock}>
      <Text>{timeParser(stopWatch.elapsed)}</Text>
    </View>
  );
};

export default React.memo(Timer);

const styles = StyleSheet.create({
  clock: {
    backgroundColor: "#fff",
    width: "50%",
    height: win.width * 0.5,
    elevation: 2,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
});
