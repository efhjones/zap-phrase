// @flow
import React from "react";

const Winner = ({ winner, startNewGame }) => (
  <div>
    {winner} wins!!!!!!!!!!
    <button onClick={startNewGame}>New Game</button>
  </div>
);

export default Winner;
