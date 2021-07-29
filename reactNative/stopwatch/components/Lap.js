import React from "react";
import { StyleSheet, Text, View } from "react-native";

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

const Lap = ({ splitTime, lapTime, index }) => {
  return (
    <View style={styles.lapContainer} key={index}>
      <View style={styles.lapGroup}>
        <Text style={styles.lapText}>Lap {index}</Text>
      </View>
      <View style={styles.lapGroup}>
        <Text style={styles.lapHeader}>Split Time</Text>
        <Text style={styles.lapText}>{timeParser(splitTime)}</Text>
      </View>
      <View style={styles.lapGroup}>
        <Text style={styles.lapHeader}>Lap Time</Text>
        <Text style={styles.lapText}>{timeParser(lapTime)}</Text>
      </View>
    </View>
  );
};

export default React.memo(Lap);

const styles = StyleSheet.create({
  lapContainer: {
    marginVertical: 10,
    width: "100%",
    backgroundColor: "#385e8f",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  lapText: {
    color: "#fff",
  },
  lapHeader: {
    color: "#fff",
    fontSize: 12,
  },
  lapGroup: {
    alignItems: "center",
  },
});
