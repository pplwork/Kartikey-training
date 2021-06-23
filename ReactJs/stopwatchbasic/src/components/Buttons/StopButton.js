import React from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";

const StopButton = () => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch({ type: "STOP_WATCH" });
  };
  return (
    <div className="button" onClick={handleClick}>
      <FontAwesomeIcon icon={faStop} />
    </div>
  );
};

export default StopButton;
