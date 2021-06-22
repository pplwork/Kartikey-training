import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import timeParser from "../../Helpers/timeParser";
import "./Stopwatch.css";
class StopWatch extends Component {
  constructor(props) {
    super(props);
    this.percentageRef = createRef();
    this.clockRef = createRef();
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
    let radius = this.clockRef.current.getBoundingClientRect().height / 2;
    this.percentageRef.current.setAttribute("r", radius);
    this.percentageRef.current.setAttribute(
      "stroke-dasharray",
      `${(((this.props.elapsed % 60000) / 1000) * Math.PI * radius) / 30},${
        2 * Math.PI * radius
      }`
    );
  }

  render() {
    return (
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
          {timeParser(this.props.elapsed, { retType: "string" })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    elapsed: state.elapsed,
  };
};

export default connect(mapStateToProps)(StopWatch);
