import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";

interface WorkoutHistory {
  [key: string]: Array<{
    exercise: string;
    value: number;
  }>;
}

interface CurrentExercise {
  weight: number;
  reps: number;
  numSets: number;
  exercise: string;
  sets: Array<string>;
}

export class WorkoutStore {
  currentSquat: number;
  currentBenchPress: number;
  currentOverheadPress: number;
  currentDeadLift: number;
  currentBarbelRow: number;
  currentExercises: CurrentExercise[] = [];

  lastWorkoutType: "a" | "b";

  history: WorkoutHistory;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
}
