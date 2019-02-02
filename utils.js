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

const addPlayerToTeam = ({ teams, name }) => {
  const teamWithFewerPlayers = sortBy(teams, team => {
    return team.players.length;
  })[0];

  const assignedTeam = teamWithFewerPlayers;
  const player = {
    teamId: assignedTeam.id,
    name
  };
  const newTeam = {
    ...assignedTeam,
    players: [...assignedTeam.players, player]
  };
  return teams.map(team => {
    if (team.id === assignedTeam.id) {
      return newTeam;
    }
    return team;
  });
};

module.exports = {
  createGameId,
  addPlayerToTeam
};
