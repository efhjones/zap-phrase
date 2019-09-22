// @flow
import React from "react";

import "./Teams.css";

const Player = ({ name, isMe }) => (
  <li className={`team-member ${isMe ? "is-me" : ""}`}>{name}</li>
);

const Team = ({ team, name }) => {
  return (
    <div key={team.id} className="team" id={`team-${team.id}`}>
      <div className="team-header" id={`team-header-${team.id}`}>
        <h2>Team {team.id}</h2>
      </div>
      <ul className="team-members">
        {team.players.map(player => {
          return (
            <Player
              key={player.socketId}
              name={player.name}
              isMe={player.name === name}
            />
          );
        })}
      </ul>
    </div>
  );
};

const Teams = ({ teams, name }) => {
  return (
    <div className="teams">
      {teams.map(team => {
        return <Team key={team.id} team={team} name={name} />;
      })}
    </div>
  );
};

export default Teams;
