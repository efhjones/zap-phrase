import React from "react";
import AsyncButton from "./AsyncButton";

const AbortButton = ({ onClick, isWaiting }) => {
  return (
    <AsyncButton
      isLoading={isWaiting}
      onClick={onClick}
      color="coral"
      style={{ marginRight: "50px" }}
    >
      Abort!
    </AsyncButton>
  );
};

export default AbortButton;
