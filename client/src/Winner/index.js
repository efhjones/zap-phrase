// @flow
import React from "react";
import Button from "../common/Button/Button";
import "./styles.css";

const happyGifs = [
  "https://thumbs.gfycat.com/GrouchyUnderstatedElk-size_restricted.gif",
  "https://media.giphy.com/media/82UBIE5yLWiI7Sdcnh/giphy.gif",
  "https://media.giphy.com/media/xSM46ernAUN3y/giphy.gif",
  "https://media.giphy.com/media/13aSSyJaI5NkTm/giphy.gif",
  "https://media.giphy.com/media/1d7F9xyq6j7C1ojbC5/giphy.gif",
  "https://media.giphy.com/media/25Pke1HBWFhjLNrMUe/giphy.gif",
  "https://media.giphy.com/media/xT77XWum9yH7zNkFW0/giphy.gif",
  "https://media.giphy.com/media/9GIgZeDeZOl5Ls7QO9/giphy.gif"
];

const sadGifs = [
  "https://media.giphy.com/media/1BXa2alBjrCXC/giphy.gif",
  "https://media.giphy.com/media/3oEjI80DSa1grNPTDq/giphy.gif",
  "https://media.giphy.com/media/TU76e2JHkPchG/giphy.gif",
  "https://media.giphy.com/media/fuDUlcnXPIGQ3AQaYj/giphy.gif",
  "https://media.giphy.com/media/MuztdWJQ4PR7i/giphy.gif",
  "https://media.giphy.com/media/JEVqknUonZJWU/giphy.gif",
  "https://media.giphy.com/media/CWhRp2LymONRm/giphy.gif",
  "https://media.giphy.com/media/3ohs7Ys9J8XyFVheg0/giphy.gif"
];

const getRandomGif = isOnWinningTeam => {
  const gifs = isOnWinningTeam ? happyGifs : sadGifs;
  const max = gifs.length;
  const min = 0;
  const randomIndex = Math.floor(Math.random() * (max - min) + min);
  return gifs[randomIndex];
};

const Winner = ({ team, isOnWinningTeam, startNewGame }) => (
  <div className="winner-container">
    <h1 className={`${team === "1" ? "orange" : "blue"}-text winner-heading`}>
      {isOnWinningTeam ? "You Won!!" : "You Lost!!"}
    </h1>
    <img src={getRandomGif(isOnWinningTeam)} alt="" />
    <Button color="blue" onClick={startNewGame}>
      New Game
    </Button>
  </div>
);

export default Winner;
