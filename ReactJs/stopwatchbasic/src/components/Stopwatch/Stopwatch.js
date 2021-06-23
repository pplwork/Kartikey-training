import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import timeParser from "../../Helpers/timeParser";
import "./Stopwatch.css";

const StopWatch = () => {
  const elapsed = useSelector((state) => state.elapsed);
  const clockRef = useRef(null);
  const percentageRef = useRef(null);
  useEffect(() => {
    let radius = clockRef.current.getBoundingClientRect().height / 2;
    percentageRef.current.setAttribute("r", radius);
    percentageRef.current.setAttribute(
      "stroke-dasharray",
      `${(((elapsed % 60000) / 1000) * Math.PI * radius) / 30},${
        2 * Math.PI * radius
      }`
    );
  });
  return (
    <div className="clockContainer" ref={clockRef}>
      <svg id="clockBorder">
        <circle
          ref={percentageRef}
          id="percentage"
          r="25vw"
          cx="50%"
          cy="50%"
          fill="none"
        ></circle>
      </svg>
      <div className="Timer">{timeParser(elapsed, { retType: "string" })}</div>
    </div>
  );
};

export default StopWatch;
