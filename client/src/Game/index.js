import React from "react";
import { once } from "lodash";

import AbortButton from "../common/Button/AbortButton";
import Button from "../common/Button/Button";
import Clock from "./Clock";
import Winner from "../Winner";
import Guess from "./Guess";
import Shh from "./Shh";
import PlayerLineup from "./PlayerLineup";
import { SocketConsumer } from "../SocketContext/SocketContextProvider";

import { getNextPlayer, shouldGuessForOppositeTeam } from "../utils/gameUtils";

import "./styles.css";

const shouldGuess = ({ teams, teamId, currentPlayer, name }) => {
  if (currentPlayer && currentPlayer.name === name) {
    return false;
  } else if (currentPlayer && teamId === currentPlayer.teamId) {
    return true;
  } else {
    return shouldGuessForOppositeTeam(teams);
  }
};

const findNextPhrase = (currentPhrase, remainingPhrases) => {
  const indexOfCurrentPhrase = remainingPhrases.indexOf(currentPhrase);
  const indexOfNextPhrase = indexOfCurrentPhrase + 1;
  return remainingPhrases[indexOfNextPhrase];
};

const getNextPhrase = (currentPhrase, remainingPhrases) => {
  const nextPhrase = findNextPhrase(currentPhrase, remainingPhrases);
  const sliceIndex = remainingPhrases[0] === currentPhrase ? 2 : 1;
  const newRemainingPhrases = remainingPhrases.slice(sliceIndex);
  return {
    currentPhrase: nextPhrase,
    remainingPhrases: newRemainingPhrases
  };
};

const Game = props => {
  const { name, gameId, playerLineup = [], teams, teamId } = props;
  return (
    <SocketConsumer>
      {({
        currentPhrase,
        remainingPhrases,
        setCurrentPhrase,
        setNextPlayer,
        winner,
        isWaiting,
        currentPlayer
      }) => {
        const isCurrentPlayer = currentPlayer && currentPlayer.name === name;
        const shouldPlayerGuess = shouldGuess({
          teams,
          teamId,
          currentPlayer,
          name
        });

        return winner ? (
          <Winner
            team={winner === "team1" ? "1" : "2"}
            startNewGame={props.abortGame}
          />
        ) : (
          <>
            <div className="game-control">
              {props.isActive && (
                <AbortButton onClick={props.abortGame} isLoading={isWaiting} />
              )}
              <Clock socket={props.socket} gameId={gameId} key="clock" />
            </div>
            <PlayerLineup
              playerLineup={playerLineup}
              currentPlayer={currentPlayer}
            />
            <div className="vertical-section" key="game">
              <section className="vertical-section">
                <span className="player-name">
                  {shouldPlayerGuess ? (
                    <Guess />
                  ) : !isCurrentPlayer ? (
                    <Shh />
                  ) : null}
                </span>
              </section>
              {isCurrentPlayer && (
                <>
                  <section className="vertical-section">
                    <span className="phrase">{currentPhrase}</span>
                  </section>

                  <section className="play-buttons">
                    <Button
                      color="stone"
                      onClick={() => {
                        const {
                          currentPhrase: nextCurrentPhrase,
                          remainingPhrases: nextRemainingPhrases
                        } = getNextPhrase(currentPhrase, remainingPhrases);
                        setCurrentPhrase(
                          nextCurrentPhrase,
                          nextRemainingPhrases
                        );
                      }}
                    >
                      Skip
                    </Button>
                    <Button
                      color="green"
                      onClick={once(e => {
                        e.persist();
                        const {
                          currentPhrase: nextCurrentPhrase,
                          remainingPhrases: nextRemainingPhrases
                        } = getNextPhrase(currentPhrase, remainingPhrases);
                        const nextPlayer = getNextPlayer(
                          playerLineup,
                          currentPlayer
                        );
                        setNextPlayer(nextPlayer);
                        setCurrentPhrase(
                          nextCurrentPhrase,
                          nextRemainingPhrases
                        );
                      })}
                    >
                      Next
                    </Button>
                  </section>
                </>
              )}
            </div>
          </>
        );
      }}
    </SocketConsumer>
  );
};

export default Game;
