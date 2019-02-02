import { includes, flowRight, partial, flatten } from "lodash";

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

export const getLocalStorage = key => {
  return localStorage.getItem(key);
};

const parseGame = game => {
  const teams = game.teams || "[]";
  const phrases = game.phrases || "{}";
  return {
    id: game.id,
    teams: JSON.parse(teams),
    phrases: JSON.parse(phrases)
  };
};

export const prepareGameForState = game => {
  const parsedGame = parseGame(game);
  return {
    id: parsedGame.id,
    isActive: Boolean(game.isActive),
    teams: parsedGame.teams,
    phrases: parsedGame.phrases
  };
};

export const getAllPlayersInGame = game => {
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
  return flowRight(
    isExistingPlayerInNames,
    getNamesOfAllPlayers,
    getAllPlayersInGame
  )(game);
};
