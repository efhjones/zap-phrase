// @flow
import React from "react";
import Button from "../common/Button/Button";
import "./styles.css";

const Winner = ({ team, startNewGame }) => (
  <div className="winner-container">
    <h1 className={`${team === "1" ? "orange" : "blue"}-text winner-heading`}>
      Team {team} wins!
    </h1>
    <img
      src="https://thumbs.gfycat.com/GrouchyUnderstatedElk-size_restricted.gif"
      alt=""
    />
    <Button color="blue" onClick={startNewGame}>
      New Game
    </Button>
  </div>
);

export default Winner;
