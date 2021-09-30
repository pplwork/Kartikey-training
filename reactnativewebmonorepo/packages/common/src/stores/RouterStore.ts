import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";

export class RouterStore {
  screen: "WorkoutHistory" | "CurrentWorkout" = "WorkoutHistory";
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
}
