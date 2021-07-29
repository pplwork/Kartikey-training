import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Lap = ({ stopWatch, setStopWatch }) => {
  const lapHandler = () => {
    if (stopWatch.isRunning) {
      setStopWatch((prev) => ({
        ...prev,
        laps: [
          ...prev.laps,
          {
            splitTime: prev.elapsed,
            lapTime:
              prev.laps.length > 0
                ? prev.elapsed - prev.laps.slice(-1)[0].splitTime
                : prev.elapsed,
          },
        ],
      }));
    }
  };
  return (
    <View>
      <Ionicons
        name="md-stopwatch"
        size={24}
        color="#385e8f"
        onPress={lapHandler}
      />
    </View>
  );
};

export default Lap;

const styles = StyleSheet.create({});
