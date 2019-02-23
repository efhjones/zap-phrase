import React from "react";
import Spinner from "../Spinner";
import Button from "./Button";

const AsyncButton = props => {
  return (
    <Button kind={props.kind} disabled={props.disabled} onClick={props.onClick}>
      {props.isLoading ? <Spinner color={props.color} /> : props.children}
    </Button>
  );
};

AsyncButton.defaultProps = {
  color: "rgba(3, 206, 164, 1)"
};

export default AsyncButton;
