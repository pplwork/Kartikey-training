import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";
// import { makePersistable } from "mobx-persist-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

const padZero = (num: number): string => {
  if (num < 10) return `0${num}`;
  else return `${num}`;
};

export class WorkoutTimerStore {
  startTime = dayjs();
  isRunning = false;
  seconds = 0;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    // makePersistable(this, {
    //   name: "WorkoutTimerStore",
    //   properties: ["startTime", "isRunning", "seconds", "rootStore"],
    //   storage: AsyncStorage,
    // });
  }

  measure() {
    if (!this.isRunning) return;
    this.seconds = dayjs().diff(this.startTime, "second");
    setTimeout(() => this.measure(), 1000);
  }

  startTimer() {
    this.isRunning = true;
    this.startTime = dayjs();
    this.measure();
  }
  endTimer() {
    this.seconds = 0;
    this.isRunning = false;
  }
  get display() {
    const minutes = Math.floor(this.seconds / 60);
    const seconds = this.seconds % 60;
    return `${padZero(minutes)}:${padZero(seconds)}`;
  }
  get percent() {
    return `${Math.min(100, (this.seconds / 180) * 100)}%`;
  }
}
