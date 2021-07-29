import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Stop = ({ stopWatch, setStopWatch }) => {
  const stopHandler = () => {
    clearInterval(stopWatch.intervalID);
    setStopWatch((prev) => ({
      ...prev,
      resetNextRun: true,
      intervalID: null,
      isRunning: false,
    }));
  };

  return (
    <View>
      <Ionicons
        name="md-stop"
        size={24}
        color="#385e8f"
        onPress={stopHandler}
      />
    </View>
  );
};

export default Stop;

const styles = StyleSheet.create({});
