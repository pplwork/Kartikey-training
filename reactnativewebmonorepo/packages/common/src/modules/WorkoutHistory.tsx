import { observer } from "mobx-react-lite";
import React from "react";
import { View, Text, Button } from "react-native";
import RootStore from "../stores/RootStore";
const WorkoutHistory = observer(() => {
  return (
    <View>
      <Text>Workout History Page</Text>
      <Button
        title="Create Workout"
        onPress={() => {
          RootStore.workoutStore.currentExercises.push(
            {
              exercise: "Squat",
              numSets: 5,
              reps: 5,
              sets: ["5", "5", "5", "5", "5"],
              weight: 260,
            },
            {
              exercise: "Bench Press",
              numSets: 5,
              reps: 5,
              sets: ["5", "5", "5", "5", "5"],
              weight: 200,
            },
            {
              exercise: "Deadlift",
              numSets: 1,
              reps: 5,
              sets: ["5", "x", "x", "x", "x"],
              weight: 360,
            }
          );
          RootStore.routerStore.screen = "CurrentWorkout";
        }}
      />
    </View>
  );
});

export default WorkoutHistory;
