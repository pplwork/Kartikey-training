import { observer } from "mobx-react-lite";
import React from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import { RouteComponentProps } from "react-router";
import RootStore from "../stores/RootStore";
import HistoryCard from "../ui/HistoryCard";
import { CurrentExercise } from "../stores/WorkoutStore";
import Fab from "../ui/Fab";

interface Props extends RouteComponentProps {}

const WorkoutHistory: React.FC<Props> = observer(({ history }) => {
  const rows: Array<
    Array<{
      date: string;
      exercises: CurrentExercise[];
    }>
  > = [];
  Object.entries(RootStore.workoutStore.history).forEach(
    ([date, exercises], i) => {
      if (i % 3 === 0) {
        rows.push([
          {
            date,
            exercises,
          },
        ]);
      } else {
        rows[rows.length - 1].push({
          date,
          exercises,
        });
      }
    }
  );

  return (
    <View style={styles.container}>
      <FlatList
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.map(({ date, exercises }) => (
              <View key={date} style={styles.cardContainer}>
                <HistoryCard
                  onPress={() => {
                    const parts = date.split("-");
                    history.push(
                      `/workout/${parts[0]}/${parts[1]}/${parts[2]}`
                    );
                  }}
                  header={date}
                  currentExercises={exercises}
                />
              </View>
            ))}
            {item.length < 3 ? <View style={styles.cardContainer} /> : null}
            {item.length < 2 ? <View style={styles.cardContainer} /> : null}
          </View>
        )}
        data={rows}
        keyExtractor={(item) => item.reduce((pv, cv) => pv + " " + cv.date, "")}
      />
      <Fab
        onPress={() => {
          if (!RootStore.workoutStore.hasCurrentWorkout) {
            const {
              currentBarbelRow,
              currentBenchPress,
              currentDeadLift,
              currentSquat,
              currentOverheadPress,
            } = RootStore.workoutStore;
            const emptySets = ["", "", "", "", ""];

            if (RootStore.workoutStore.lastWorkoutType === "b") {
              RootStore.workoutStore.currentExercises.push(
                {
                  exercise: "Squat",
                  numSets: 5,
                  reps: 5,
                  sets: [...emptySets],
                  weight: currentSquat,
                },
                {
                  exercise: "Bench Press",
                  numSets: 5,
                  reps: 5,
                  sets: [...emptySets],
                  weight: currentBenchPress,
                },
                {
                  exercise: "Deadlift",
                  numSets: 1,
                  reps: 5,
                  sets: ["", "x", "x", "x", "x"],
                  weight: currentDeadLift,
                }
              );

              RootStore.workoutStore.currentSquat += 5;
              RootStore.workoutStore.currentBenchPress += 5;
              RootStore.workoutStore.currentDeadLift += 5;
            } else {
              RootStore.workoutStore.currentExercises.push(
                {
                  exercise: "Squat",
                  numSets: 5,
                  reps: 5,
                  sets: [...emptySets],
                  weight: currentSquat,
                },
                {
                  exercise: "Overhead Press",
                  numSets: 5,
                  reps: 5,
                  sets: [...emptySets],
                  weight: currentOverheadPress,
                },
                {
                  exercise: "Barbell Row",
                  numSets: 5,
                  reps: 5,
                  sets: [...emptySets],
                  weight: currentBarbelRow,
                }
              );

              RootStore.workoutStore.currentSquat += 5;
              RootStore.workoutStore.currentOverheadPress += 5;
              RootStore.workoutStore.currentBarbelRow += 5;
            }

            RootStore.workoutStore.lastWorkoutType =
              RootStore.workoutStore.lastWorkoutType === "a" ? "b" : "a";
          }

          history.push("/current-workout");
        }}
      />
    </View>
  );
});

export default WorkoutHistory;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  cardContainer: {
    flex: 1,
    padding: 10,
  },
  container: {
    flex: 1,
  },
});
