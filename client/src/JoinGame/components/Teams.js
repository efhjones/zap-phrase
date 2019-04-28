// @flow
import React from "react";

const Player = ({ name, isMe }) => (
  <li className={`team-member ${isMe ? "is-me" : ""}`}>{name}</li>
);

const Team = ({ team, name, i }) => {
  return (
    <div key={team.id} className="team" id={`team-${i + 1}`}>
      <div className="team-header" id={`team-header-${i + 1}`}>
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
      {teams.map((team, i) => {
        return <Team key={team.id} team={team} name={name} i={i} />;
      })}
    </div>
  );
};

export default Teams;
