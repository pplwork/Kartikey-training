import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Reset = ({ stopWatch, setStopWatch }) => {
  const resetWatch = () => {
    if (!stopWatch.isRunning) {
      setStopWatch((prev) => ({
        ...prev,
        elapsed: 0,
        laps: [],
        resetNextRun: false,
        intervalID: null,
      }));
    }
  };
  return (
    <View>
      <Ionicons name="refresh" size={24} color="#385e8f" onPress={resetWatch} />
    </View>
  );
};

export default Reset;

const styles = StyleSheet.create({});
