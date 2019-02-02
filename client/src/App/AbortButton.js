import React from "react";
import AsyncButton from "../common/Button/AsyncButton";

const AbortButton = ({ onClick, isWaiting }) => {
  return (
    <AsyncButton isLoading={isWaiting} onClick={onClick} kind="abort">
      Abort!
    </AsyncButton>
  );
};

export default AbortButton;
