import React from "react";
import StopButton from "../Buttons/StopButton";
import StartButton from "../Buttons/StartButton";
import LapButton from "../Buttons/LapButton";
import ResetButton from "../Buttons/ResetButton";

import "./Controls.css";

const Controls = () => {
  return (
    <div className="controlsContainer">
      <StartButton />
      <StopButton />
      <LapButton />
      <ResetButton />
    </div>
  );
};

export default Controls;
