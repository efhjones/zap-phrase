// @flow
import React from "react";

import "./PlayerLineup.css";

const Player = ({ name, isCurrentPlayer }) => (
  <p className={`player-in-lineup ${isCurrentPlayer ? "isCurrentPlayer" : ""}`}>
    {name}
  </p>
);

const PlayerLineup = ({ playerLineup, currentPlayer }) => (
  <div>
    {playerLineup.map((player, i) => (
      <Player
        name={player.name}
        isCurrentPlayer={currentPlayer && currentPlayer.name === player.name}
      />
    ))}
  </div>
);

export default PlayerLineup;
