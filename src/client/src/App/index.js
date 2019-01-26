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
      phrases: [],
      isLoading: false
    };

    this.socket = socketIOClient(this.state.endpoint);

    this.socket.on("loading", () => {
      debugger;
      this.setState({
        isLoading: true
      });
    });

    this.socket.on("loading done", phrases => {
      debugger;
      this.setState({
        isLoading: false,
        phrases
      });
    });

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
      const nextPlayer = getNextPlayer(playerLineup);
      const nextPlayerTeamId = nextPlayer.teamId;
      this.setState({
        hasStartedGame: true,
        currentGame: game,
        playerLineup,
        currentPlayer: nextPlayer
      });
      this.socket.emit("start clock", { teamId: nextPlayerTeamId });
    });

    this.socket.on(
      "new game started",
      ({ teams, currentGame, currentPlayer }) => {
        this.setState({
          name: null,
          teams,
          currentGame,
          currentPlayer
        });
      }
    );

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
      debugger;
      this.setState({
        teams
      });
    });
  }

  componentDidMount() {
    this.socket.emit("new connection");
    if (!this.state.isLoading) {
      this.loadPhrases();
      this.socket.emit("loading");
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
    this.getData("phrases").catch(err => console.error(err));
  };

  joinGame = name => {
    this.socket.emit("join game", name);
    this.socket.emit("add player", name);
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
      playerLineup,
      isLoading
    } = this.state;
    return isLoading ? (
      <div className="container">Loading...</div>
    ) : (
      <main className="container">
        {!currentGame ? (
          <JoinGame
            teams={teams}
            joinGame={this.joinGame}
            name={name}
            socket={this.socket}
          />
        ) : (
          <Game
            phrases={this.state.phrases}
            teams={teams}
            currentPlayer={currentPlayer}
            name={name}
            playerLineup={playerLineup}
            socket={this.socket}
          />
        )}
      </main>
    );
  }
}

export default App;
