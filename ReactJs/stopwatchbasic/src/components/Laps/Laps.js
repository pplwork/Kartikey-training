import React from "react";
import { connect } from "react-redux";
import timeParser from "../../Helpers/timeParser";

import "./Laps.css";
const Laps = ({ laps }) => {
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

const mapStateToProps = (state) => {
  return {
    laps: state.laps,
  };
};

export default connect(mapStateToProps)(Laps);
