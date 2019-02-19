// @flow
import React from "react";

const Teams = ({ teams, name }) => {
  return (
    <div className="teams">
      {teams.map(team => {
        return (
          <div key={team.id} className="team">
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
