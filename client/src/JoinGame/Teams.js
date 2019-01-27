// @flow
import React from "react";

const Teams = ({ teams, name }) => {
  return (
    <div>
      {teams.map(team => {
        return (
          <div key={team.id}>
            <h2>Team {team.id}</h2>
            <ul>
              {team.players.map(player => {
                return (
                  <li key={player.id}>
                    {player.name} {player.name === name && "-- that's you!"}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Teams;
