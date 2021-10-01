import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface props {
  onXPress(): void;
  currentTime: string;
  percent: string;
}

const WorkoutTimer: React.FC<props> = ({ onXPress, currentTime, percent }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.line, { width: percent }]}></View>
      <Text style={styles.timeText}>{currentTime}</Text>
      <TouchableOpacity onPress={onXPress}>
        <Text style={styles.x}>x</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutTimer;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 50,
    width: "100%",
    backgroundColor: "#486550",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  x: {
    color: "#B2A1A1",
    fontSize: 30,
  },
  timeText: {
    color: "#fff",
    fontSize: 18,
  },
  line: {
    height: 3,
    backgroundColor: "#655252",
    alignSelf: "flex-start",
    position: "absolute",
    left: 0,
  },
});
