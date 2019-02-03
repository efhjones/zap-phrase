import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import Game from "../Game";
import JoinGame from "../JoinGame";
import Loading from "../common/Loading";
import AbortButton from "./AbortButton";

import { getNextPlayer } from "../utils/gameUtils";
import {
  getLocalStorage,
  setLocalStorage,
  clearLocalStorage,
  prepareGameForState
} from "../utils/utils.js";

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
      isWaiting: false,
      gameId: null,
      isActive: false
    };

    this.socket = socketIOClient(window.location.origin);

    this.socket.on("loading", ({ gameId, isLoading }) => {
      if (gameId === this.state.gameId) {
        this.setState({
          isLoading
        });
      }
    });

    this.socket.on("player added", game => {
      if (game.gameId === this.state.gameId) {
        this.setState({ teams: game.teams });
      }
    });

    this.socket.on("start game", () => {
      this.setState({ isLoading: true }, this.logState);
    });

    this.socket.on("game stopped", ({ game }) => {
      if (game.id === this.state.gameId) {
        this.setState({
          isActive: game.isActive
        });
      }
    });

    this.socket.on("game joined", name => {
      this.setState({ name });
    });

    this.socket.on("game started", ({ game, playerLineup }) => {
      if (game.gameId === this.state.gameId) {
        const nextPlayer = getNextPlayer(playerLineup);
        const nextPlayerTeamId = nextPlayer.teamId;
        this.setState(
          {
            isActive: true,
            isWaiting: false,
            currentGame: game.id,
            playerLineup,
            currentPlayer: nextPlayer
          },
          this.logState
        );
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

    this.socket.on("reload teams", ({ game }) => {
      this.setState({ teams: game.teams });
    });

    this.socket.on("player changed", player => {
      this.setState({
        currentPlayer: player
      });
    });

    this.socket.on("remove player", ({ gameId, playerName }) => {
      this.removePlayer({ gameId, playerName });
    });

    window.addEventListener("beforeunload", event => {
      const playerName = getLocalStorage("name");
      this.socket.emit("remove player", {
        gameId: this.state.gameId,
        playerName
      });
      clearLocalStorage();
    });
  }

  componentDidMount() {
    this.socket.emit("new connection");
    const maybeGameId = window.location.pathname.replace("/", "");
    this.getGame(maybeGameId);
  }

  removePlayer = ({ gameId, playerName }) => {
    return fetch("api/game/removePlayer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ gameId, playerName })
    })
      .then(res => res.json())
      .then(({ game }) => {
        const preparedGame = prepareGameForState(game);
        this.setState({
          teams: preparedGame.teams
        });
        this.socket.emit("reload teams", { game: preparedGame });
      });
  };

  getGame = gameId => {
    if (!gameId) {
      this.setState({
        isLoading: true
      });
      fetch(`/api/game/`)
        .then(res => res.json())
        .then(({ gameCode }) => {
          window.location.pathname = `${gameCode}`;
          setLocalStorage("name", "");
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
        .then(({ game }) => {
          if (game) {
            const preparedGame = prepareGameForState(game);
            const { id, phrases, teams, isActive } = preparedGame;
            this.setState({
              isLoading: false,
              gameId: id,
              phrases,
              teams,
              isActive
            });
          } else {
            window.location.pathname = "/";
          }
        });
    }
  };

  joinGame = name => {
    this.setState({
      isWaiting: true,
      name
    });
    setLocalStorage("name", name);
    fetch("/api/game/addPlayer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gameId: this.state.gameId,
        name,
        socketId: this.socket.id
      })
    })
      .then(res => res.json())
      .then(({ game }) => {
        const { teams, isActive, id } = prepareGameForState(game);
        this.setState({
          gameId: id,
          name,
          teams,
          isActive,
          isWaiting: false
        });
        this.socket.emit("player added", {
          gameId: game.id,
          teams
        });
      });
  };

  startGame = () => {
    this.setState({
      isLoading: true
    });
    this.socket.emit("loading", {
      isLoading: true,
      gameId: this.state.gameId
    });
    fetch("/api/game/startGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ gameId: this.state.gameId })
    })
      .then(res => res.json())
      .then(({ game }) => {
        const { teams, isActive, id } = prepareGameForState(game);
        this.setState({
          teams,
          isActive,
          isLoading: false
        });
        this.socket.emit("start game", {
          gameId: id,
          teams
        });
        this.socket.emit("loading", {
          isLoading: false,
          gameId: this.state.gameId
        });
      });
  };

  abortGame = () => {
    this.setState({
      isLoading: true
    });
    this.socket.emit("loading", {
      isLoading: true,
      gameId: this.state.gameId
    });
    fetch("/api/game/stopGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ gameId: this.state.gameId })
    })
      .then(res => res.json())
      .then(({ game }) => {
        const preparedGame = prepareGameForState(game);
        this.setState({
          isActive: preparedGame.isActive,
          isLoading: false
        });
        this.socket.emit("loading", {
          isLoading: false,
          gameId: this.state.gameId
        });
        this.socket.emit("stop game", {
          game: preparedGame
        });
      });
  };

  logState = label => {
    console.log(`${label}: ` + JSON.stringify(this.state));
  };

  render() {
    const { state } = this;
    return state.isLoading ? (
      <Loading />
    ) : (
      <main className="container">
        {state.isActive && (
          <AbortButton onClick={this.abortGame} isLoading={state.isWaiting} />
        )}
        {!state.isActive ? (
          <JoinGame
            teams={state.teams}
            joinGame={this.joinGame}
            name={state.name}
            socket={this.socket}
            startGame={this.startGame}
            isWaiting={state.isWaiting}
          />
        ) : (
          <Game
            phrases={this.state.phrases}
            teams={state.teams}
            currentPlayer={state.currentPlayer}
            name={state.name}
            playerLineup={state.playerLineup}
            socket={this.socket}
          />
        )}
      </main>
    );
  }
}

export default App;
