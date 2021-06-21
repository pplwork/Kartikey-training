import React, { Component } from "react";
import "./App.css";
import StopWatch from "./components/Stopwatch/Stopwatch";
import Controls from "./components/Controls/Controls";
import Laps from "./components/Laps/Laps";
class App extends Component {
  constructor() {
    super();
    this.state = {
      laps: [],
      isRunning: false,
      elapsed: 0,
    };
    this.resetNextRun = false;
  }
  run = () => {
    this.setState((prev) => {
      return {
        ...prev,
        isRunning: true,
        elapsed: prev.elapsed + 10,
      };
    });
  };
  startWatch = () => {
    if (this.resetNextRun) this.resetWatch();
    this.resetNextRun = false;
    this.intervalId = setInterval(this.run, 10);
  };
  pauseWatch = () => {
    clearInterval(this.intervalId);
    this.setState((prev) => {
      return {
        ...prev,
        isRunning: false,
      };
    });
  };
  stopWatch = () => {
    clearInterval(this.intervalId);
    this.setState((prev) => {
      return {
        ...prev,
        isRunning: false,
      };
    });
    this.resetNextRun = true;
  };
  resetWatch = () => {
    this.setState({
      laps: [],
      isRunning: false,
      elapsed: 0,
    });
  };
  lapWatch = () => {
    if (this.state.isRunning)
      this.setState((prev) => {
        return {
          ...prev,
          laps: [
            ...prev.laps,
            {
              splitTime: prev.elapsed,
              lapTime:
                prev.laps.length > 0
                  ? prev.elapsed - prev.laps.slice(-1)[0].splitTime
                  : prev.elapsed,
            },
          ],
        };
      });
  };
  render() {
    return (
      <div className="container">
        <StopWatch timer={this.state} />
        <Controls
          timer={this.state}
          start={this.startWatch}
          pause={this.pauseWatch}
          stop={this.stopWatch}
          reset={this.resetWatch}
          lap={this.lapWatch}
        />
        <Laps timer={this.state} />
      </div>
    );
  }
}

export default App;
