import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Play = ({ stopWatch, setStopWatch }) => {
  const run = () => {
    setStopWatch((prev) => ({
      ...prev,
      isRunning: true,
      elapsed: prev.elapsed + 10,
    }));
  };

  const watchHandler = () => {
    // if watch is running
    if (stopWatch.isRunning) {
      clearInterval(stopWatch.intervalID);
      setStopWatch((prev) => ({
        ...prev,
        isRunning: false,
        intervalID: null,
      }));
    }
    // if was paused or stopped
    else {
      setStopWatch((prev) => ({
        ...prev,
        intervalID: setInterval(run, 10),
        elapsed: prev.resetNextRun ? 0 : prev.elapsed,
        resetNextRun: false,
        laps: prev.resetNextRun ? [] : prev.laps,
      }));
    }
  };
  return (
    <View>
      {stopWatch.isRunning ? (
        <Ionicons
          name="md-pause"
          size={24}
          color="#385e8f"
          onPress={watchHandler}
        />
      ) : (
        <Ionicons
          name="md-play"
          size={24}
          color="#385e8f"
          onPress={watchHandler}
        />
      )}
    </View>
  );
};

export default Play;

const styles = StyleSheet.create({});
