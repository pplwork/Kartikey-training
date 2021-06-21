import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";

class LapButton extends Component {
  constructor(props) {
    super(props);
    this.lap = props.lap;
  }
  render() {
    return (
      <div className="button" id="lapBtn" onClick={this.lap}>
        <FontAwesomeIcon icon={faStopwatch} />
      </div>
    );
  }
}

export default LapButton;
