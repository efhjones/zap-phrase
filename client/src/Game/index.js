import React, { Component } from "react";
import { shuffle, isEmpty, debounce } from "lodash";

import AbortButton from "../common/Button/AbortButton";
import Button from "../common/Button/Button";
import Clock from "./Clock";
import Winner from "../Winner";
import Guess from "./Guess";
import Shh from "./Shh";
import PlayerLineup from "./PlayerLineup";

import { getNextPlayer, shouldGuessForOppositeTeam } from "../utils/gameUtils";

import "./styles.css";

class Game extends Component {
  constructor(props) {
    super(props);
    const shuffledPhrases = shuffle(props.phrases);
    this.state = {
      remainingPhrases: shuffledPhrases,
      currentPhrase: shuffledPhrases[0],
      winner: null
    };

    this.props.socket.on(
      "phrase changed",
      ({ nextPhrase, remainingPhrases, gameId }) => {
        if (gameId === this.props.gameId) {
          this.setState({ currentPhrase: nextPhrase, remainingPhrases });
        }
      }
    );

    this.props.socket.on("winner declared", ({ winner, gameId }) => {
      if (this.props.gameId === gameId) {
        this.setState({ winner });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (isEmpty(prevState.remainingPhrases) && !isEmpty(this.props.phrases)) {
      const shuffledPhrases = shuffle(this.props.phrases);
      this.setState({
        remainingPhrases: shuffledPhrases,
        currentPhrase: shuffledPhrases[0]
      });
    }
  }

  logState = message => {
    console.log(message + JSON.stringify(this.state));
  };

  setNextPlayer = debounce(() => {
    const { playerLineup, currentPlayer } = this.props;
    const nextPlayer = getNextPlayer(playerLineup, currentPlayer);
    this.props.socket.emit("change player", {
      gameId: this.props.gameId,
      nextPlayer
    });
  });

  setNextPhrase = debounce(() => {
    const { remainingPhrases, currentPhrase } = this.state;
    if (remainingPhrases[0] === currentPhrase) {
      remainingPhrases.shift();
    }
    const nextPhrase = remainingPhrases.shift();
    this.props.socket.emit("change phrase", {
      gameId: this.props.gameId,
      nextPhrase,
      remainingPhrases
    });
  });

  shouldGuess = () => {
    const { teams, teamId, currentPlayer, name } = this.props;
    if (currentPlayer && currentPlayer.name === name) {
      return false;
    } else if (currentPlayer && teamId === currentPlayer.teamId) {
      return true;
    } else {
      return shouldGuessForOppositeTeam(teams);
    }
  };

  render() {
    const { state, props } = this;
    const { currentPlayer, name, gameId, playerLineup = [] } = props;
    const isCurrentPlayer = currentPlayer && currentPlayer.name === name;
    const shouldGuess = this.shouldGuess();
    return state.winner ? (
      <Winner
        team={state.winner === "team1" ? "1" : "2"}
        startNewGame={props.abortGame}
      />
    ) : (
      <>
        <div className="game-control">
          {props.isActive && (
            <AbortButton
              onClick={props.abortGame}
              isLoading={state.isWaiting}
            />
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
              {shouldGuess && <Guess />}
              {!isCurrentPlayer && !shouldGuess && <Shh />}
            </span>
          </section>
          {isCurrentPlayer && (
            <>
              <section className="vertical-section">
                <span className="phrase">{state.currentPhrase}</span>
              </section>

              <section className="play-buttons">
                <Button
                  color="stone"
                  onClick={() => {
                    this.setNextPhrase();
                  }}
                >
                  Skip
                </Button>
                <Button
                  color="green"
                  onClick={() => {
                    this.setNextPlayer();
                    this.setNextPhrase();
                  }}
                >
                  Next
                </Button>
              </section>
            </>
          )}
        </div>
      </>
    );
  }
}

export default Game;
