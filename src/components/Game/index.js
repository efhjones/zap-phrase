import _ from "lodash";
import React, { Component } from "react";

// baby workflow;
//  start with list of players on different teams
//  pick a phrase
//  pick a next person
//  send only that person the phrase?
//  When that person hits next, choose the next person and next phrase

class Game extends Component {
  state = {
    players: ["Emily", "Rob", "JC", "Fernando", "Claudiu"],
    phrases: [
      "A blessing in disguise",
      "A dime a dozen",
      "Better late than never",
      "Beat around the bush"
    ],
    remainingPhrases: null,
    currentPlayer: null,
    currentPhrase: null
  };

  componentDidMount() {
    this.setInitialValues();
  }

  componentDidUpdate(prevProps, prevState) {
    if (_.isEmpty(this.state.remainingPhrases)) {
      this.setState({
        remainingPhrases: _.shuffle(this.state.phrases)
      });
    }
  }

  setInitialValues = () => {
    const shuffledPhrases = _.shuffle(this.state.phrases);
    this.setState(
      {
        remainingPhrases: shuffledPhrases,
        currentPlayer: this.state.players[0],
        currentPhrase: shuffledPhrases[0]
      },
      this.logState
    );
  };

  getNextItem = (items, currentItem) => {
    const currentIndex = _.findIndex(items, item => item === currentItem);
    const nextIndex = 1 + currentIndex === items.length ? 0 : 1 + currentIndex;
    return items[nextIndex];
  };

  logState = () => {
    console.log(this.state);
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
      <div>
        <div className="player">Current Player: {currentPlayer}</div>
        <div className="player">Current phrase: {currentPhrase}</div>
        <button
          onClick={() => {
            this.setNextPlayer();
            this.setNextPhrase();
          }}
        >
          Next
        </button>
      </div>
    );
  }
}

export default Game;
