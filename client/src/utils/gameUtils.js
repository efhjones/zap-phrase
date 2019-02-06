import { findIndex, flatten, flowRight, includes } from "lodash";

export const hasSufficientNumbersToPlay = teams =>
  teams.reduce((sum, team) => {
    return sum + team.players.length;
  }, 0) >= 2;

export const getNextPlayer = (lineup, currentPlayer) => {
  if (!currentPlayer) {
    return lineup[0];
  } else {
    const currentPlayerIndex = findIndex(lineup, currentPlayer);
    const nextIndex = currentPlayerIndex + 1;
    return nextIndex === lineup.length
      ? lineup[0]
      : lineup[currentPlayerIndex + 1];
  }
};

const getAllPlayersInTeams = teams => {
  return flatten(teams.map(team => team.players));
};

const getAllPlayerNames = players => {
  return players.map(player => player.name);
};

const getAllNamesInTeams = flowRight(
  getAllPlayerNames,
  getAllPlayersInTeams
);

export const isNameAvailable = (teams, name = "") => {
  const allPlayerNames = getAllNamesInTeams(teams);
  return !includes(allPlayerNames, name);
};
