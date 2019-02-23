import React, { Component } from "react";
import { shuffle, isEmpty } from "lodash";

import AbortButton from "../common/Button/AbortButton";
import Button from "../common/Button/Button";
import Clock from "./Clock";
import Winner from "./Winner";

import { getNextPlayer } from "../utils/gameUtils";

import "./styles.css";
// baby workflow;
//  start with list of players on different teams
//  pick a phrase
//  pick a next person
//  send only that person the phrase?
//  When that person hits next, choose the next person and next phrase

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

  setNextPlayer = () => {
    const { playerLineup, currentPlayer } = this.props;
    const nextPlayer = getNextPlayer(playerLineup, currentPlayer);
    this.props.socket.emit("change player", {
      gameId: this.props.gameId,
      nextPlayer
    });
  };

  setNextPhrase = () => {
    const { remainingPhrases, currentPhrase } = this.state;
    if (remainingPhrases[0] === currentPhrase) {
      remainingPhrases.shift();
    }
    const nextPhrase = remainingPhrases.shift();
    this.setState({
      nextPhrase,
      remainingPhrases
    });
    this.props.socket.emit("change phrase", {
      gameId: this.props.gameId,
      nextPhrase,
      remainingPhrases
    });
  };

  render() {
    const { state, props } = this;
    const { currentPlayer, name, gameId } = props;
    return state.winner ? (
      <Winner winner={state.winner} startNewGame={props.abortGame} />
    ) : (
      [
        <div className="game-control">
          {props.isActive && (
            <AbortButton
              onClick={props.abortGame}
              isLoading={state.isWaiting}
            />
          )}
          <Clock socket={props.socket} gameId={gameId} key="clock" />
        </div>,
        <div className="vertical-section" key="game">
          <section className="vertical-section">
            <span className="player-heading">Current Player:</span>
            <span className="player-name">
              {currentPlayer && currentPlayer.name}
            </span>
          </section>
          {currentPlayer && currentPlayer.name === name && (
            <div>
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
            </div>
          )}
        </div>
      ]
    );
  }
}

export default Game;
