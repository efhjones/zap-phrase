const { sortBy } = require("lodash");

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const createGameId = () => {
  const rand = getRandomInt(100000, 999999);
  return `${rand}`
    .split("")
    .map(num => {
      return String.fromCharCode(Number(num) + 65);
    })
    .join("");
};

const addPlayerToTeam = ({ teams, name, socketId }) => {
  const teamWithFewerPlayers = sortBy(teams, team => {
    return team.players.length;
  })[0];

  const assignedTeam = teamWithFewerPlayers;
  const player = {
    teamId: assignedTeam.id,
    name,
    socketId
  };
  const newTeam = {
    ...assignedTeam,
    players: [...assignedTeam.players, player]
  };
  const newTeams = teams.map(team => {
    if (team.id === assignedTeam.id) {
      return newTeam;
    }
    return team;
  });
  const value = {
    teams: newTeams,
    player
  };
  return value;
};

const removePlayerfromTeam = ({ teams, playerName }) => {
  return teams.reduce((teamsWithoutPlayer, team) => {
    const newPlayers = team.players.filter(player => {
      return player.name !== playerName;
    });
    return teamsWithoutPlayer.concat({
      ...team,
      players: newPlayers
    });
  }, []);
};

module.exports = {
  createGameId,
  addPlayerToTeam,
  removePlayerfromTeam
};
