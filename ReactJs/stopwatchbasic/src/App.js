import React, { Component } from "react";
import StopWatch from "./components/Stopwatch/Stopwatch";
import Controls from "./components/Controls/Controls";
import Laps from "./components/Laps/Laps";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="container">
        <StopWatch />
        <Controls />
        <Laps />
      </div>
    );
  }
}

export default App;
