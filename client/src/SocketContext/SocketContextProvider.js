import React, { createContext, useState, useContext } from "react";
import { shuffle } from "lodash";

const SocketContext = createContext();

export const useSocket = () => {
  const { phrases, currentPlayer, gameId: socketGameId, socket } = useContext(
    SocketContext
  );

  const shuffledPhrases = shuffle(phrases);
  const [currentPhrase, setCurrentPhrase] = useState(shuffledPhrases[0]);
  const [remainingPhrases, setRemainingPhrases] = useState(
    shuffledPhrases.slice(1)
  );
  const [nextPlayer, setNextPlayer] = useState(currentPlayer);
  const [winner, setWinner] = useState(null);

  socket.on("phrase changed", ({ nextPhrase, remainingPhrases, gameId }) => {
    if (gameId === socketGameId) {
      setCurrentPhrase(nextPhrase);
      setRemainingPhrases(remainingPhrases);
    }
  });

  socket.on("winner declared", ({ winner, gameId }) => {
    if (socketGameId === gameId) {
      setWinner(winner);
    }
  });

  const onSetNextPlayer = nextPlayer => {
    socket.emit("change player", {
      gameId: socketGameId,
      nextPlayer
    });
    setNextPlayer(nextPlayer);
    setCurrentPhrase(null);
  };

  const onSetCurrentPhrase = (nextPhrase, remainingPhrases) => {
    socket.emit("change phrase", {
      gameId: socketGameId,
      nextPhrase,
      remainingPhrases
    });
    setCurrentPhrase(nextPhrase);
  };

  return {
    currentPlayer,
    currentPhrase,
    remainingPhrases,
    nextPlayer,
    winner,
    setCurrentPhrase: onSetCurrentPhrase,
    setNextPlayer: onSetNextPlayer
  };
};

const SocketProvider = ({
  socket,
  phrases,
  currentPlayer,
  gameId,
  children
}) => (
  <SocketContext.Provider value={{ socket, phrases, currentPlayer, gameId }}>
    {children}
  </SocketContext.Provider>
);

export default SocketProvider;
