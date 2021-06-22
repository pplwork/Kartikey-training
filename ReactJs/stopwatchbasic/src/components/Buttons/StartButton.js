import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";

class StartButton extends Component {
  handleClick = (e) => {
    // was running , we need to pause
    if (this.props.isRunning) {
      clearInterval(this.props.intervalId);
      this.props.setIntervalId(null);
    } else {
      // was not running , need to start
      this.props.setIntervalId(setInterval(this.props.incrementTime, 10));
    }
  };
  render() {
    return (
      <div
        className={`button ${this.props.isRunning ? "active" : ""}`}
        onClick={this.handleClick}
      >
        <FontAwesomeIcon icon={this.props.isRunning ? faPause : faPlay} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isRunning: state.isRunning,
    intervalId: state.intervalId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    incrementTime: () => {
      dispatch({ type: "INCREMENT_TIME" });
    },
    setIntervalId: (id) => {
      dispatch({ type: "SET_INTERVAL_ID", payload: id });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartButton);
