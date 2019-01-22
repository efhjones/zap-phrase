import _ from "lodash";
import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import JoinGame from "../JoinGame";

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
    this.state = {
      players: props.players,
      phrases: props.phrases,
      remainingPhrases: null,
      currentPlayer: props.players[0].name,
      currentPhrase: null,
      endpoint: "http://localhost:5000",
      name: null
    };

    this.socket = socketIOClient(this.state.endpoint);
    this.socket.on("player changed", player => {
      this.setState({
        currentPlayer: player
      });
    });
    this.socket.on("phrase changed", phrase => {
      this.setState({ currentPhrase: phrase });
    });
  }

  componentDidMount() {
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

  loadPhrases = () => {
    this.getData("phrases")
      .then(res => {
        const shuffledPhrases = _.shuffle(res.phrases);
        this.setState(
          {
            phrases: res.phrases,
            remainingPhrases: shuffledPhrases,
            currentPhrase: shuffledPhrases[0]
          },
          () => {
            this.logState("phrases loaded: ");
            this.socket.emit("set next phrase", this.state.currentPhrase);
          }
        );
      })
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
    const currentIndex = _.findIndex(items, item => item.name === currentItem);
    const nextIndex = 1 + currentIndex === items.length ? 0 : 1 + currentIndex;
    return items[nextIndex];
  };

  logState = message => {
    console.log(message + JSON.stringify(this.state));
  };

  setNextPlayer = () => {
    const { players, currentPlayer } = this.props;
    const nextPlayer = this.getNextItem(players, currentPlayer);
    this.socket.emit("set next player", nextPlayer);
  };

  setNextPhrase = () => {
    const { remainingPhrases, currentPhrase } = this.state;
    if (remainingPhrases[0] === currentPhrase) {
      remainingPhrases.shift();
    }
    const nextPhrase = remainingPhrases.shift();
    this.socket.emit("set next phrase", nextPhrase);
  };

  render() {
    const { currentPlayer } = this.props;
    return (
      <div className="vertical-section">
        <section className="vertical-section">
          <span className="player-heading">Current Player:</span>
          <span className="player-name">{currentPlayer}</span>
        </section>
        <section className="vertical-section">
          <span className="phrase">{this.state.currentPhrase}</span>
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
