import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";
class ResetButton extends Component {
  constructor(props) {
    super(props);
    this.reset = props.resetWatch;
    this.isRunning = props.isRunning;
  }
  componentDidUpdate() {
    this.isRunning = this.props.isRunning;
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

const mapStateToProps = (state) => {
  return {
    isRunning: state.isRunning,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetWatch: () => {
      dispatch({ type: "RESET_WATCH" });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetButton);
