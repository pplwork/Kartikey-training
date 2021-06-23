import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";

const StartButton = () => {
  const [isRunning, intervalId] = useSelector((state) => [
    state.isRunning,
    state.intervalId,
  ]);
  const dispatch = useDispatch();
  const handleClick = (e) => {
    // was running , we need to pause
    if (isRunning) {
      clearInterval(intervalId);
      dispatch({
        type: "SET_INTERVAL_ID",
        payload: null,
      });
    } else {
      // was not running , need to start
      dispatch({
        type: "SET_INTERVAL_ID",
        payload: setInterval(() => dispatch({ type: "INCREMENT_TIME" }), 10),
      });
    }
  };
  return (
    <div
      className={`button ${isRunning ? "active" : ""}`}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
    </div>
  );
};

export default StartButton;
