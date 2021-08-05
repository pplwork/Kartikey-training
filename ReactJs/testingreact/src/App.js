import React from "react";
import Counter from "./components/Counter/Counter";
import User from "./components/Users/User";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Counter />
      <User />
    </div>
  );
};

export default App;
