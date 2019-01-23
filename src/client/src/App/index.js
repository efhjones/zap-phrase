import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import Game from "../Game";
import JoinGame from "../JoinGame";

import { getNextPlayer } from "../utils/gameUtils";

import "./styles.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "http://localhost:5000",
      name: null,
      teams: [],
      currentPlayer: null,
      currentGame: null,
      phrases: []
    };

    this.socket = socketIOClient(this.state.endpoint);

    this.socket.on("phrase changed", phrase => {
      this.setState({ currentPhrase: phrase });
    });

    this.socket.on("player added", teams => {
      this.setState({ teams });
    });

    this.socket.on("game joined", name => {
      this.setState({ name });
    });

    this.socket.on("game started", ({ game, playerLineup }) => {
      this.setState({
        hasStartedGame: true,
        currentGame: game,
        playerLineup,
        currentPlayer: getNextPlayer(playerLineup)
      });
    });

    this.socket.on("player changed", player => {
      this.setState({
        currentPlayer: player
      });
    });

    this.socket.on("player disconnected", ({ teams }) => {
      this.setState(currentState => {
        return { teams };
      });
    });

    this.socket.on("connection detected", teams => {
      this.setState({
        teams
      });
    });
  }

  componentDidMount() {
    this.socket.emit("new connection");
  }

  joinGame = name => {
    this.socket.emit("join game", name);
    this.socket.emit("add player", name);
  };

  startGame = () => {
    this.socket.emit("start game", "game1");
  };

  logState = label => {
    console.log(`${label}: ` + JSON.stringify(this.state));
  };

  render() {
    const {
      teams,
      currentGame,
      name,
      currentPlayer,
      playerLineup
    } = this.state;
    return (
      <main className="container">
        {!currentGame ? (
          <JoinGame
            socket={this.socket}
            startGame={this.startGame}
            teams={teams}
            joinGame={this.joinGame}
            name={name}
          />
        ) : (
          <Game
            teams={teams}
            socket={this.socket}
            currentPlayer={currentPlayer}
            name={name}
            playerLineup={playerLineup}
          />
        )}
      </main>
    );
  }
}

export default App;
