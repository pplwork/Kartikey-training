import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";

class StopButton extends Component {
  handleClick = () => {
    this.props.stopWatch();
  };
  render() {
    return (
      <div className="button" id="stopBtn" onClick={this.handleClick}>
        <FontAwesomeIcon icon={faStop} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    stopWatch: () => {
      dispatch({ type: "STOP_WATCH" });
    },
  };
};

export default connect(null, mapDispatchToProps)(StopButton);
