import React from "react";
import "./counter.css";

const Counter = () => {
  const [counter, setCounter] = React.useState(0);
  const [inputVal, setInputVal] = React.useState(1);
  return (
    <div>
      <h1 data-testid="header">My Counter</h1>
      <h2
        data-testid="counter"
        className={counter >= 100 ? "green" : counter <= -100 ? "red" : ""}
      >
        {counter}
      </h2>
      <button
        data-testid="sub-btn"
        onClick={() => {
          setCounter((prev) => prev - Number(inputVal));
        }}
      >
        -
      </button>
      <input
        className="counter"
        data-testid="input"
        type="number"
        value={inputVal}
        onChange={(e) => {
          setInputVal(e.target.value);
        }}
      />
      <button
        data-testid="add-btn"
        onClick={() => {
          setCounter((prev) => prev + Number(inputVal));
        }}
      >
        +
      </button>
    </div>
  );
};

export default Counter;
