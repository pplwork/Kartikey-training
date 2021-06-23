import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";

const ResetButton = () => {
  const isRunning = useSelector((state) => state.isRunning);
  const dispatch = useDispatch();
  const handleClick = () => {
    if (!isRunning) dispatch({ type: "RESET_WATCH" });
  };
  return (
    <div className="button" onClick={handleClick}>
      <FontAwesomeIcon icon={faRedo} />
    </div>
  );
};

export default ResetButton;
