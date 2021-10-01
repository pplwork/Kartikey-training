import React from "react";
import WorkoutHistory from "./modules/WorkoutHistory";
import CurrentWorkout from "./modules/CurrentWorkout";
import { Router, Switch, Route } from "./Router/index";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={WorkoutHistory} />
        <Route exact path="/current-workout" component={CurrentWorkout} />
        <Route
          exact
          path="/workout/:year/:month/:day"
          component={CurrentWorkout}
        />
      </Switch>
    </Router>
  );
};
export default Routes;
