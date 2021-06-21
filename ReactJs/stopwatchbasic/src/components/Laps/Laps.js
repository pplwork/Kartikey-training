import React from "react";
import "./Laps.css";
const Laps = ({ timer }) => {
  const timeParser = (milli) => {
    const hours = Math.floor(milli / (60 * 60 * 1000));
    const minutes = Math.floor(
      (milli - hours * (60 * 60 * 1000)) / (60 * 1000)
    );
    const seconds = Math.floor(
      (milli - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / 1000
    );
    const milliseconds = Math.floor(
      (milli - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000) /
        10
    );
    return {
      hours,
      minutes,
      seconds,
      milliseconds,
    };
  };
  return (
    <div className="lapContainer">
      {timer.laps.map((ele, index) => {
        let ST = timeParser(ele.splitTime);
        let LT = timeParser(ele.lapTime);
        let Shours = ST.hours,
          Sminutes = ST.minutes,
          Sseconds = ST.seconds,
          Smilliseconds = ST.milliseconds;
        let Lhours = LT.hours,
          Lminutes = LT.minutes,
          Lseconds = LT.seconds,
          Lmilliseconds = LT.milliseconds;
        return (
          <div className="lap" key={index}>
            <div className="lapLeft">Lap {index}</div>
            <div className="lapRight">
              <div>
                <div>Split Time</div>
                <div className="lapValue">
                  {Shours >= 10 ? `${Shours}:` : `0${Shours}:`}
                  {Sminutes >= 10 ? `${Sminutes}:` : `0${Sminutes}:`}
                  {Sseconds >= 10 ? `${Sseconds}:` : `0${Sseconds}:`}
                  {Smilliseconds >= 10
                    ? `${Smilliseconds}`
                    : `0${Smilliseconds}`}
                </div>
              </div>
              <div>
                <div>Lap Time</div>
                <div className="lapValue">
                  {Lhours >= 10 ? `${Lhours}:` : `0${Lhours}:`}
                  {Lminutes >= 10 ? `${Lminutes}:` : `0${Lminutes}:`}
                  {Lseconds >= 10 ? `${Lseconds}:` : `0${Lseconds}:`}
                  {Lmilliseconds >= 10
                    ? `${Lmilliseconds}`
                    : `0${Lmilliseconds}`}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Laps;
