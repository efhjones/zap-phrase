import { findIndex } from "lodash";

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
