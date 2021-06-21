import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";
class ResetButton extends Component {
  constructor(props) {
    super(props);
    this.reset = props.reset;
    this.isRunning = props.timer.isRunning;
  }
  componentDidUpdate() {
    this.isRunning = this.props.timer.isRunning;
  }
  handleClick = () => {
    if (!this.isRunning) this.reset();
  };
  render() {
    return (
      <div className="button" id="resetBtn" onClick={this.handleClick}>
        <FontAwesomeIcon icon={faRedo} />
      </div>
    );
  }
}

export default ResetButton;
