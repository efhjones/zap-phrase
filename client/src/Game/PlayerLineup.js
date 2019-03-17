// @flow
import React from "react";

import "./PlayerLineup.css";

const Player = ({ name, isCurrentPlayer }) => (
  <p className={`player-in-lineup ${isCurrentPlayer ? "isCurrentPlayer" : ""}`}>
    {name}
  </p>
);

const PlayerLineup = ({ playerLineup, currentPlayer }) => {
  const playerNames = playerLineup.map(player => player.name);
  const indexOfPlayer = playerNames.indexOf(
    currentPlayer ? currentPlayer.name : ""
  );
  const initialOffset = 30;
  const playerOffset = initialOffset - indexOfPlayer * 35;
  const offset = playerOffset - 20;
  return (
    <div className="player-lineup">
      <div className="player-spinner" style={{ top: `${offset}px` }}>
        {playerLineup.map((player, i) => (
          <Player
            name={player.name}
            isCurrentPlayer={
              currentPlayer && currentPlayer.name === player.name
            }
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerLineup;
