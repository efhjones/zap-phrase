import React, { Component } from "react";
import Spinner from "./Spinner";

class AsyncButton extends Component {
  render() {
    const { props } = this;
    return (
      <button
        disabled={props.disabled}
        className={props.className}
        onClick={props.onClick}
      >
        {props.isLoading ? <Spinner color={props.color} /> : props.children}
      </button>
    );
  }
}

export default AsyncButton;
