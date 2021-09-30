import React from "react";
import RootStore from "./stores/RootStore";
import { observer } from "mobx-react-lite";
import WorkoutHistory from "./modules/WorkoutHistory";
import CurrentWorkout from "./modules/CurrentWorkout";

const Router = observer(() => {
  return RootStore.routerStore.screen === "WorkoutHistory" ? (
    <WorkoutHistory />
  ) : (
    <CurrentWorkout />
  );
});
export default Router;
