import React from "react";
import { useSelector } from "react-redux";
import timeParser from "../../Helpers/timeParser";

import "./Laps.css";

const Laps = () => {
  const laps = useSelector((state) => state.laps);
  return (
    <div className="lapContainer">
      {laps.map((ele, index) => {
        let ST = timeParser(ele.splitTime, { retType: "string" });
        let LT = timeParser(ele.lapTime, { retType: "string" });
        return (
          <div className="lap" key={index}>
            <div className="lapLeft">Lap {index}</div>
            <div className="lapRight">
              <div>
                <div>Split Time</div>
                <div className="lapValue">{ST}</div>
              </div>
              <div>
                <div>Lap Time</div>
                <div className="lapValue">{LT}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Laps;
