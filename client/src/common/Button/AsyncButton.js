import React from "react";
import Spinner from "../Spinner";
import Button from "./Button";

const AsyncButton = props => {
  return (
    <Button
      color={props.color}
      size={props.size}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.isLoading ? (
        <Spinner color="rgba(3, 206, 164, 1)" />
      ) : (
        props.children
      )}
    </Button>
  );
};

export default AsyncButton;
