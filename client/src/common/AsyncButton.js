import React from "react";
import Spinner from "./Spinner";

const AsyncButton = props => {
  return (
    <button
      disabled={props.disabled}
      className={props.className}
      onClick={props.onClick}
    >
      {props.isLoading ? <Spinner color={props.color} /> : props.children}
    </button>
  );
};

export default AsyncButton;
