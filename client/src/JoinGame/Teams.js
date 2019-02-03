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
              {team.players.map((player, i) => {
                return (
                  <li key={`${player.id}${i}`}>
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
