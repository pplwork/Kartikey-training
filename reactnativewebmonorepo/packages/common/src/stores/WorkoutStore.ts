import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { makePersistable } from "mobx-persist-store";

interface WorkoutHistory {
  [key: string]: CurrentExercise[];
}

export interface CurrentExercise {
  weight: number;
  reps: number;
  numSets: number;
  exercise: string;
  sets: Array<string>;
}

export class WorkoutStore {
  currentSquat: number = 45;
  currentBenchPress: number = 45;
  currentOverheadPress: number = 45;
  currentDeadLift: number = 45;
  currentBarbelRow: number = 65;
  currentExercises: CurrentExercise[] = [];

  lastWorkoutType: "a" | "b" = "a";

  history: WorkoutHistory = {};
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    // makePersistable(this, {
    //   name: "WorkoutStore",
    //   properties: [
    //     "currentSquat",
    //     "currentBenchPress",
    //     "currentOverheadPress",
    //     "currentDeadLift",
    //     "currentBarbelRow",
    //     "currentExercises",
    //     "lastWorkoutType",
    //     "history",
    //     "rootStore",
    //   ],
    //   storage: AsyncStorage,
    // });
  }
  get hasCurrentWorkout() {
    return !!this.currentExercises.length;
  }
}
