import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WorkoutCard from "../ui/WorkoutCard";
import RootStore from "../stores/RootStore";
import { observer } from "mobx-react-lite";
const CurrentWorkout = observer(() => {
  return (
    <View style={styles.container}>
      {RootStore.workoutStore.currentExercises.map((e) => {
        return (
          <WorkoutCard
            onSetPress={(setIndex) => {
              const v = e.sets[setIndex];
              let newValue = "";
              if (v == "") newValue = `${e.reps}`;
              else if (v === "0") {
                newValue = "";
              } else {
                newValue = `${parseInt(v) - 1}`;
              }
              console.log(newValue);
              e.sets[setIndex] = newValue;
            }}
            key={e.exercise}
            exercise={e.exercise}
            repsAndWeight={`${e.numSets}x${e.reps} ${e.weight}`}
            sets={e.sets}
          />
        );
      })}
    </View>
  );
});

export default CurrentWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 10,
  },
});
