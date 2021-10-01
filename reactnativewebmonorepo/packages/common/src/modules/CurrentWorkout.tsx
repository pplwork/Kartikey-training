import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import WorkoutCard from "../ui/WorkoutCard";
import RootStore from "../stores/RootStore";
import { observer } from "mobx-react-lite";
import WorkoutTimer from "../ui/WorkoutTimer";
import { RouteComponentProps } from "react-router";
import dayjs from "dayjs";
interface Props
  extends RouteComponentProps<{
    year?: string;
    month?: string;
    day?: string;
  }> {}
const CurrentWorkout: React.FC<Props> = observer(
  ({
    history,
    match: {
      params: { day, month, year },
    },
  }) => {
    useEffect(() => {
      return () => {
        RootStore.workoutTimerStore.endTimer();
      };
    }, []);
    const isCurrentWorkout = !year && !month && !day;
    const dateKey = `${year}-${month}-${day}`;
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
        >
          {(isCurrentWorkout
            ? RootStore.workoutStore.currentExercises
            : RootStore.workoutStore.history[dateKey]
          ).map((e) => {
            return (
              <WorkoutCard
                onSetPress={(setIndex) => {
                  RootStore.workoutTimerStore.startTimer();
                  const v = e.sets[setIndex];
                  let newValue = "";
                  if (v == "") newValue = `${e.reps}`;
                  else if (v === "0") {
                    newValue = "";
                  } else {
                    newValue = `${parseInt(v) - 1}`;
                  }
                  e.sets[setIndex] = newValue;
                }}
                key={e.exercise}
                exercise={e.exercise}
                repsAndWeight={`${e.numSets}x${e.reps} ${e.weight}`}
                sets={e.sets}
              />
            );
          })}
          <Button
            title="SAVE"
            onPress={() => {
              RootStore.workoutStore.history[dayjs().format("YYYY-MM-DD")] =
                RootStore.workoutStore.currentExercises;
              RootStore.workoutStore.currentExercises = [];
              history.push("/");
            }}
          />
          {RootStore.workoutTimerStore.isRunning ? (
            <WorkoutTimer
              currentTime={RootStore.workoutTimerStore.display}
              percent={RootStore.workoutTimerStore.percent}
              onXPress={() => {
                RootStore.workoutTimerStore.endTimer();
              }}
            />
          ) : null}
        </ScrollView>
      </View>
    );
  }
);

export default CurrentWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 10,
  },
  scrollContainer: {
    padding: 10,
    marginBottom: 50,
  },
});
