import React, { createContext, useState } from "react";
import { shuffle } from "lodash";

const SocketContext = createContext();

export const SocketConsumer = ({ children, ...props }) => {
  const phrases = shuffle(props.phrases);
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
  const [remainingPhrases, setRemainingPhrases] = useState(phrases.slice(1));
  const [nextPlayer, setNextPlayer] = useState(props.currentPlayer);
  const [winner, setWinner] = useState(null);
  return (
    <SocketContext.Consumer>
      {socket => {
        socket.on(
          "phrase changed",
          ({ nextPhrase, remainingPhrases, gameId }) => {
            if (gameId === props.gameId) {
              setCurrentPhrase(nextPhrase);
              setRemainingPhrases(remainingPhrases);
            }
          }
        );

        socket.on("winner declared", ({ winner, gameId }) => {
          if (props.gameId === gameId) {
            setWinner(winner);
          }
        });

        const onSetNextPlayer = nextPlayer => {
          socket.emit("change player", {
            gameId: props.gameId,
            nextPlayer
          });
          setNextPlayer(nextPlayer);
          setCurrentPhrase(null);
        };

        const onSetCurrentPhrase = (nextPhrase, remainingPhrases) => {
          socket.emit("change phrase", {
            gameId: props.gameId,
            nextPhrase,
            remainingPhrases
          });
          setCurrentPhrase(nextPhrase);
        };

        return children({
          currentPhrase,
          remainingPhrases,
          nextPlayer,
          winner,
          setCurrentPhrase: onSetCurrentPhrase,
          setNextPlayer: onSetNextPlayer
        });
      }}
    </SocketContext.Consumer>
  );
};

const SocketProvider = ({ socket, children }) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);

export default SocketProvider;
