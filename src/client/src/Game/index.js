import _ from "lodash";
import React, { Component } from "react";

import "./styles.css";
// baby workflow;
//  start with list of players on different teams
//  pick a phrase
//  pick a next person
//  send only that person the phrase?
//  When that person hits next, choose the next person and next phrase

class Game extends Component {
  state = {
    players: [],
    arePlayersLoading: false,
    phrases: [],
    remainingPhrases: null,
    currentPlayer: null,
    currentPhrase: null
  };

  componentDidMount() {
    this.loadPlayers();
    this.loadPhrases();
  }

  getData = async dataType => {
    const response = await fetch(`/api/${dataType}`);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  loadPlayers = () => {
    this.getData("players")
      .then(res => {
        const shuffledPlayers = _.shuffle(res.players);
        this.setState(
          { players: shuffledPlayers, currentPlayer: shuffledPlayers[0] },
          () => this.logState("players loaded: ")
        );
      })
      .catch(err => console.log(err));
  };

  loadPhrases = () => {
    this.getData("phrases")
      .then(res =>
        this.setState(
          {
            phrases: res.phrases,
            remainingPhrases: _.shuffle(res.phrases)
          },
          () => this.logState("phrases loaded: ")
        )
      )
      .catch(err => console.log(err));
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      _.isEmpty(prevState.remainingPhrases) &&
      !_.isEmpty(this.state.phrases)
    ) {
      const shuffledPhrases = _.shuffle(this.state.phrases);
      this.setState({
        remainingPhrases: shuffledPhrases,
        currentPhrase: shuffledPhrases[0]
      });
    }
  }

  getNextItem = (items, currentItem) => {
    const currentIndex = _.findIndex(items, item => item === currentItem);
    const nextIndex = 1 + currentIndex === items.length ? 0 : 1 + currentIndex;
    return items[nextIndex];
  };

  logState = message => {
    console.log(message + JSON.stringify(this.state));
  };

  setNextPlayer = () => {
    const { players, currentPlayer } = this.state;
    const nextPlayer = this.getNextItem(players, currentPlayer);
    this.setState({ currentPlayer: nextPlayer });
  };

  setNextPhrase = () => {
    const { remainingPhrases, currentPhrase } = this.state;
    if (remainingPhrases[0] === currentPhrase) {
      remainingPhrases.shift();
    }
    const nextPhrase = remainingPhrases.shift();
    this.setState({
      currentPhrase: nextPhrase
    });
  };

  render() {
    const { currentPlayer, currentPhrase } = this.state;
    return (
      <div className="vertical-section">
        <section className="vertical-section">
          <span className="player-heading">Current Player:</span>
          <span className="player-name">{currentPlayer}</span>
        </section>
        <section className="vertical-section">
          <span className="phrase">{currentPhrase}</span>
        </section>
        <section className="horizontal-section">
          <button
            className="skip button"
            onClick={() => {
              this.setNextPhrase();
            }}
          >
            Skip
          </button>
          <button
            className="next button"
            onClick={() => {
              this.setNextPlayer();
              this.setNextPhrase();
            }}
          >
            Next
          </button>
        </section>
      </div>
    );
  }
}

export default Game;
