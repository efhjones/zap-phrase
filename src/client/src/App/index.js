import React, { Component } from "react";
import _ from "lodash";
import socketIOClient from "socket.io-client";

import Game from "../Game";
import JoinGame from "../JoinGame";

import "./styles.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "http://localhost:5000",
      name: null,
      players: [],
      currentPlayer: null,
      currentGame: null,
      phrases: []
    };

    this.socket = socketIOClient(this.state.endpoint);

    this.socket.on("player changed", player => {
      debugger;
      this.setState({
        currentPlayer: player.name
      });
    });
    this.socket.on("phrase changed", phrase => {
      this.setState({ currentPhrase: phrase });
    });

    this.socket.on("player added", players => {
      this.setState({ players }, this.logState("players"));
    });

    this.socket.on("game started", game => {
      this.setState({
        hasStartedGame: true,
        currentGame: game,
        currentPlayer: this.state.players[0].name
      });
    });
  }

  joinGame = name => {
    console.log("adding player: ", name);
    this.socket.emit("add player", name);
    this.setState({ name });
  };

  startGame = () => {
    this.socket.emit("start game", "game1");
  };

  logState = label => {
    console.log(`${label}: ` + JSON.stringify(this.state));
  };

  render() {
    const { players, currentGame, name, currentPlayer } = this.state;
    debugger;
    return (
      <main className="container">
        {_.isEmpty(players) || !currentGame ? (
          <JoinGame
            socket={this.socket}
            startGame={this.startGame}
            players={players}
            joinGame={this.joinGame}
            name={name}
          />
        ) : (
          <Game
            players={players}
            socket={this.socket}
            currentPlayer={currentPlayer}
          />
        )}
      </main>
    );
  }
}

export default App;
