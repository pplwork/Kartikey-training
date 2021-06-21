import React from "react";
import StopButton from "../Buttons/StopButton";
import StartButton from "../Buttons/StartButton";
import LapButton from "../Buttons/LapButton";
import ResetButton from "../Buttons/ResetButton";

import "./Controls.css";

const Controls = ({ timer, start, pause, stop, lap, reset }) => {
  return (
    <>
      <div className="controlsContainer">
        <StartButton start={start} pause={pause} timer={timer} />
        <StopButton stop={stop} />
        <LapButton lap={lap} />
        <ResetButton reset={reset} timer={timer} />
      </div>
    </>
  );
};

export default Controls;
