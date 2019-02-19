// @flow
import React from "react";

const teamColors = {
  1: "#ff4a00",
  2: "#7678ed"
};

const Teams = ({ teams, name }) => {
  return (
    <div className="teams">
      {teams.map(team => {
        return (
          <div
            key={team.id}
            className="team"
            style={{ color: teamColors[team.id] }}
          >
            <h2>Team {team.id}</h2>
            <ul className="team-members">
              {team.players.map((player, i) => {
                return (
                  <li key={`${player.id}${i}`} className="team-member">
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
