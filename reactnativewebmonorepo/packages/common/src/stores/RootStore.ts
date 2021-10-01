// import { makePersistable } from "mobx-persist-store";
import { WorkoutStore } from "./WorkoutStore";
import { WorkoutTimerStore } from "./WorkoutTimerStore";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export class RootStore {
  workoutStore = new WorkoutStore(this);
  workoutTimerStore = new WorkoutTimerStore(this);
  constructor() {
    // makePersistable(this, {
    //   name: "RootStore",
    //   properties: ["workoutStore", "workoutTimerStore"],
    //   storage: AsyncStorage,
    // });
  }
}

export default new RootStore();
