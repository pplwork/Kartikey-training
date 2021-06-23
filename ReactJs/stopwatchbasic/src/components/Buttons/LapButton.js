import React from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";

const LapButton = () => {
  const dispatch = useDispatch();
  return (
    <div className="button" onClick={() => dispatch({ type: "LAP" })}>
      <FontAwesomeIcon icon={faStopwatch} />
    </div>
  );
};

export default LapButton;
