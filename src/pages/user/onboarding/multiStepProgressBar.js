import React from "react";
import "react-step-progress-bar/styles.css";
import "./multiStepProgressBar.css";
import { ProgressBar, Step } from "react-step-progress-bar";

const MultiStepProgressBar = (props) => {
  return (
    <ProgressBar
      percent={(props.step + 0) * 50}
      filledBackground="#0275d8"
      height="5px"
      style={{ margin: "auto" }}
    >
      <Step transition="scale">
        {({ accomplished, index }) => (
          <div className={`step ${accomplished ? "completed" : ""}`}>
            {index + 1}
          </div>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished, index }) => (
          <div className={`step ${accomplished ? "completed" : null}`}>
            {index + 1}
          </div>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished, index }) => (
          <div className={`step ${accomplished ? "completed" : null}`}>
            {index + 1}
          </div>
        )}
      </Step>
    </ProgressBar>
  );
};

export default MultiStepProgressBar;
