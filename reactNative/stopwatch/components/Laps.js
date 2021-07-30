import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Lap from "./Lap";

const Laps = ({ laps }) => {
  return (
    <View style={styles.lapsContainer}>
      <ScrollView
        style={{
          width: "100%",
          height: "100%",
        }}
        showsVerticalScrollIndicator={false}
      >
        {laps.map((lap, index) => {
          return (
            <Lap
              index={index}
              splitTime={lap.splitTime}
              lapTime={lap.lapTime}
              key={index}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default React.memo(Laps);

const styles = StyleSheet.create({
  lapsContainer: {
    width: "80%",
    alignItems: "center",
    flex: 1,
  },
});
