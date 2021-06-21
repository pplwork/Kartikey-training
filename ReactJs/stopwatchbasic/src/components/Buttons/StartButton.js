import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";

class StartButton extends Component {
  constructor(props) {
    super(props);
    this.start = props.start;
    this.pause = props.pause;
    this.timer = props.timer;
    this.state = {
      isRunning: props.timer.isRunning,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.timer.isRunning !== this.props.timer.isRunning) {
      this.setState({
        isRunning: this.props.timer.isRunning,
      });
      document.querySelector("#startBtn").classList.toggle("active");
    }
  }

  handleClick = (e) => {
    this.state.isRunning ? this.pause() : this.start();
  };
  render() {
    return (
      <div className="button" id="startBtn" onClick={this.handleClick}>
        <FontAwesomeIcon icon={this.state.isRunning ? faPause : faPlay} />
      </div>
    );
  }
}

export default StartButton;
