import React from "react";
import AsyncButton from "../common/Button/AsyncButton";

const AbortButton = ({ onClick, isWaiting }) => {
  return (
    <AsyncButton isLoading={isWaiting} onClick={onClick} color="coral">
      Abort!
    </AsyncButton>
  );
};

export default AbortButton;
