import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";

class StopButton extends Component {
  constructor(props) {
    super(props);
    this.stop = props.stop;
  }
  handleClick = () => {
    this.stop();
  };
  render() {
    return (
      <>
        <div className="button" id="stopBtn" onClick={this.handleClick}>
          <FontAwesomeIcon icon={faStop} />
        </div>
      </>
    );
  }
}

export default StopButton;
