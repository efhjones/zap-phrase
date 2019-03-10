// @flow
import React from "react";
import Button from "../common/Button/Button";
import "./styles.css";

const gifs = [
  "https://thumbs.gfycat.com/GrouchyUnderstatedElk-size_restricted.gif",
  "https://media.giphy.com/media/82UBIE5yLWiI7Sdcnh/giphy.gif",
  "https://media.giphy.com/media/xSM46ernAUN3y/giphy.gif"
];

const getRandomGif = () => {
  const max = gifs.length;
  const min = 0;
  const randomIndex = Math.random() * (max - min) + min;
  return gifs[randomIndex];
};

const Winner = ({ team, startNewGame }) => (
  <div className="winner-container">
    <h1 className={`${team === "1" ? "orange" : "blue"}-text winner-heading`}>
      Team {team} wins!
    </h1>
    <img src={getRandomGif()} alt="" />
    <Button color="blue" onClick={startNewGame}>
      New Game
    </Button>
  </div>
);

export default Winner;
