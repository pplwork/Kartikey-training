import React, { Component, createRef } from "react";
import "./Stopwatch.css";
class StopWatch extends Component {
  constructor(props) {
    super(props);
    this.timer = { props };
    this.percentageRef = createRef();
    this.clockRef = createRef();
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
  }
  //setting initial dot border ring
  componentDidMount() {
    let radius = this.clockRef.current.getBoundingClientRect().height / 2;
    this.percentageRef.current.setAttribute("r", radius);
    this.percentageRef.current.setAttribute(
      "stroke-dasharray",
      `${0},${2 * Math.PI * radius}`
    );
  }
  //updating ring to match seconds
  componentDidUpdate() {
    // this.timer = this.props.timer;
    let radius = this.clockRef.current.getBoundingClientRect().height / 2;
    this.percentageRef.current.setAttribute("r", radius);
    this.percentageRef.current.setAttribute(
      "stroke-dasharray",
      `${(((this.timer.elapsed % 60000) / 1000) * Math.PI * radius) / 30},${
        2 * Math.PI * radius
      }`
    );
  }

  shouldComponentUpdate(nextProps) {
    this.timer = nextProps.timer;
    this.hours = Math.floor(this.timer.elapsed / (60 * 60 * 1000));
    this.minutes = Math.floor(
      (this.timer.elapsed - this.hours * (60 * 60 * 1000)) / (60 * 1000)
    );
    this.seconds = Math.floor(
      (this.timer.elapsed -
        this.hours * 60 * 60 * 1000 -
        this.minutes * 60 * 1000) /
        1000
    );
    this.milliseconds = Math.floor(
      (this.timer.elapsed -
        this.hours * 60 * 60 * 1000 -
        this.minutes * 60 * 1000 -
        this.seconds * 1000) /
        10
    );
    return true;
  }

  render() {
    return (
      <>
        <div className="clockContainer" ref={this.clockRef}>
          <svg id="clockBorder">
            <circle
              ref={this.percentageRef}
              id="percentage"
              r="25vw"
              cx="50%"
              cy="50%"
              fill="none"
            ></circle>
          </svg>
          <div className="Timer">
            {this.hours >= 10 ? `${this.hours}:` : `0${this.hours}:`}
            {this.minutes >= 10 ? `${this.minutes}:` : `0${this.minutes}:`}
            {this.seconds >= 10 ? `${this.seconds}:` : `0${this.seconds}:`}
            {this.milliseconds >= 10
              ? `${this.milliseconds}`
              : `0${this.milliseconds}`}
          </div>
        </div>
      </>
    );
  }
}

export default StopWatch;
