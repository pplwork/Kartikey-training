import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Stopwatch from "./components/Stopwatch";

export default function App() {
  return (
    <>
      <StatusBar translucent />
      <View style={styles.container}>
        <Stopwatch />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
