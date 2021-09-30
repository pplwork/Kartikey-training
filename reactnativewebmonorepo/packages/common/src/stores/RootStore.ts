import { makeAutoObservable } from "mobx";
import { RouterStore } from "./RouterStore";
import { WorkoutStore } from "./WorkoutStore";

export class RootStore {
  routerStore = new RouterStore(this);
  workoutStore = new WorkoutStore(this);
}

export default new RootStore();
