import _ from "lodash";
import React, { Component } from "react";

import Clock from "./Clock";

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
    this.state = {
      phrases: props.phrases,
      remainingPhrases: null,
      currentPhrase: null,
      endpoint: "http://localhost:5000",
      winner: null
    };

    this.props.socket.on("phrase changed", phrase => {
      this.setState({ currentPhrase: phrase });
    });

    this.props.socket.on("winner declared", winner => {
      this.setState({ winner });
    });
  }

  componentDidMount() {
    this.loadPhrases();
  }

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
            this.props.socket.emit("set next phrase", this.state.currentPhrase);
          }
        );
      })
      .catch(err => console.log(err));
  };

  logState = message => {
    console.log(message + JSON.stringify(this.state));
  };

  setNextPlayer = () => {
    const { playerLineup, currentPlayer } = this.props;
    const nextPlayer = getNextPlayer(playerLineup, currentPlayer);
    this.props.socket.emit("set next player", nextPlayer);
  };

  setNextPhrase = () => {
    const { remainingPhrases, currentPhrase } = this.state;
    if (remainingPhrases[0] === currentPhrase) {
      remainingPhrases.shift();
    }
    const nextPhrase = remainingPhrases.shift();
    this.props.socket.emit("set next phrase", nextPhrase);
  };

  render() {
    const { currentPlayer, name } = this.props;

    return this.state.winner ? (
      <div>{this.state.winner} wins!!!!!</div>
    ) : (
      <div className="vertical-section">
        <Clock socket={this.props.socket} />
        <section className="vertical-section">
          <span className="player-heading">Current Player:</span>
          <span className="player-name">{currentPlayer.name}</span>
        </section>
        {currentPlayer.name === name && (
          <div>
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
        )}
      </div>
    );
  }
}

export default Game;
