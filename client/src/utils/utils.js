export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

export const getLocalStorage = key => {
  return localStorage.getItem(key);
};

export const clearLocalStorage = () => {
  localStorage.clear();
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
