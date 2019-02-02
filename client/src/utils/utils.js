import { includes, flowRight, partial, flatten } from "lodash";

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

export const getLocalStorage = key => {
  return localStorage.getItem(key);
};

export const parseGame = game => {
  const teams = game.teams || "[]";
  const phrases = game.phrases || "{}";
  return {
    id: game.id,
    teams: JSON.parse(teams),
    phrases: JSON.parse(phrases)
  };
};

const getAllPlayersInGame = game => {
  return game.teams.map(team => team.players);
};

const getNamesOfAllPlayers = players => {
  return flatten(players).map(player => player.name);
};

const existsInNames = (name, names) => {
  return includes(names, name);
};

export const isExistingPlayer = (name, game) => {
  const isExistingPlayerInNames = partial(existsInNames, name);
  const result = flowRight(
    isExistingPlayerInNames,
    getNamesOfAllPlayers,
    getAllPlayersInGame
  )(game);
  console.log("result: ", result);
  return result;
};
