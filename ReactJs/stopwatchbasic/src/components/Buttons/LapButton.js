import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";

class LapButton extends Component {
  render() {
    return (
      <div className="button" id="lapBtn" onClick={this.props.lap}>
        <FontAwesomeIcon icon={faStopwatch} />
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    lap: () => {
      dispatch({ type: "LAP" });
    },
  };
};
export default connect(null, mapDispatchToProps)(LapButton);
