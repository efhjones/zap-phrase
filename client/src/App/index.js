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
      name: null,
      teams: [],
      currentPlayer: null,
      phrases: [],
      isLoading: false,
      gameId: null,
      isActive: false
    };

    this.socket = socketIOClient(window.location.origin);

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
      if (game.id === this.state.gameId) {
        const nextPlayer = getNextPlayer(playerLineup);
        const nextPlayerTeamId = nextPlayer.teamId;
        this.setState({
          isActive: true,
          currentGame: game.id,
          playerLineup,
          currentPlayer: nextPlayer
        });
        this.socket.emit("start clock", { teamId: nextPlayerTeamId });
      }
    });

    this.socket.on(
      "new game started",
      ({ teams, currentGame, currentPlayer }) => {
        this.setState({
          name: null,
          teams: "new game started",
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
      this.setState({
        teams: "player disconnected"
      });
    });

    this.socket.on("connection detected", teams => {
      this.setState({
        teams: "connection detected"
      });
    });
    this.socket.on("reconnect", () => {
      console.log("someone reconnected");
    });
  }

  componentDidMount() {
    this.socket.emit("new connection");
    const maybeGameId = window.location.pathname.replace("/", "");
    this.getGame(maybeGameId);
  }

  getGame = gameId => {
    if (!gameId) {
      this.setState({
        isLoading: true
      });
      fetch(`/api/game/`)
        .then(res => res.json())
        .then(({ gameCode }) => {
          window.location.pathname = `${gameCode}`;
          this.setState({ isLoading: false });
        })
        .catch(err => {
          console.error(
            "Aww man. I ran into an error and haven't implemented proper error handling yet. Oh well, here it is: ",
            err
          );
        });
    } else {
      fetch(`/api/game/${gameId}`)
        .then(res => res.json())
        .then(result => {
          if (result.game) {
            const { game } = result;
            const phrases = JSON.parse(game.phrases);
            const teams = JSON.parse(game.teams);
            this.setState({
              gameId: game.id,
              phrases,
              teams,
              isActive: game.isActive
            });
          } else {
            window.location.pathname = "/";
          }
        });
    }
  };

  joinGame = name => {
    fetch("/api/game/addPlayer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ gameId: this.state.gameId, name })
    })
      .then(res => res.json())
      .then(({ game }) => {
        const parsedTeams = JSON.parse(game.teams);
        this.setState({
          gameId: game.id,
          name,
          teams: parsedTeams,
          isActive: game.isActive
        });
        this.socket.emit("player added", { teams: parsedTeams });
      });
  };

  startGame = () => {
    fetch("/api/game/startGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ gameId: this.state.gameId })
    })
      .then(res => res.json())
      .then(({ game }) => {
        this.socket.emit("start game", game);
      });
  };

  logState = label => {
    console.log(`${label}: ` + JSON.stringify(this.state));
  };

  render() {
    const {
      teams,
      name,
      currentPlayer,
      playerLineup,
      isLoading,
      isActive
    } = this.state;
    return isLoading ? (
      <div className="container">Loading...</div>
    ) : (
      <main className="container">
        {!isActive ? (
          <JoinGame
            teams={teams}
            joinGame={this.joinGame}
            name={name}
            socket={this.socket}
            startGame={this.startGame}
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
