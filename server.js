const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
require("dotenv").config();
const { sortBy } = require("lodash");

const api = require("./app/api");
const handlers = require("./socket/handlers.js");

const app = express();

// our server instance
const server = http.createServer(app);

app.set("port", process.env.PORT || 5000);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

// This creates our socket using the instance of the server
const io = socketIO(server);

let teams = [{ id: 1, players: [] }, { id: 2, players: [] }];
let currentPlayer = null;
let currentGame = null;

io.on(handlers.CONNECTION, socket => {
  console.log("User connected");

  socket.emit(handlers.CONNECTION_DETECTED, teams);

  socket.on(handlers.ADD_PLAYER, name => {
    const teamWithFewerPlayers = sortBy(teams, team => {
      return team.players.length;
    })[0];
    const assignedTeam = teamWithFewerPlayers;
    const player = {
      id: socket.id,
      teamId: assignedTeam.id,
      name
    };
    const newTeam = {
      ...assignedTeam,
      players: [...assignedTeam.players, player]
    };
    teams = teams.map(team => {
      if (team.id === assignedTeam.id) {
        return newTeam;
      }
      return team;
    });
    socket.broadcast.emit(handlers.PLAYER_ADDED, teams);
    socket.emit(handlers.PLAYER_ADDED, teams);
  });

  socket.on(handlers.JOIN_GAME, name => {
    socket.emit(handlers.GAME_JOINED, name);
  });

  socket.on(handlers.START_GAME, game => {
    currentGame = { id: socket.id };
    const [team1, team2] = teams;
    const team1Players = team1.players.slice();
    const team2Players = team2.players.slice();
    const allPlayers = team1Players.concat(team2Players);
    const playerLineup = allPlayers.reduce((lineup, _, i, allItems) => {
      //odds
      if (i % 2 === 1) {
        const playerToAdd = team2Players.shift();
        return lineup.concat(playerToAdd);
      }
      //evens
      else {
        const playerToAdd = team1Players.shift();
        return lineup.concat(playerToAdd);
      }
    }, []);
    io.sockets.emit(handlers.GAME_STARTED, { game: currentGame, playerLineup });
  });

  socket.on(handlers.START_CLOCK, () => {
    socket.emit(handlers.CLOCK_STARTED);
  });

  socket.on(handlers.PAUSE_CLOCK, () => {
    io.sockets.emit(handlers.CLOCK_PAUSED);
  });

  socket.on(handlers.RESUME_CLOCK, () => {
    io.sockets.emit(handlers.CLOCK_STARTED);
  });

  socket.on(handlers.RESET_CLOCK, () => {
    io.sockets.emit(handlers.CLOCK_RESET);
  });

  socket.on(handlers.CHANGE_PLAYER, player => {
    currentPlayer = player;
    io.sockets.emit(handlers.PLAYER_CHANGED, currentPlayer);
  });

  socket.on(handlers.CHANGE_PHRASE, phrase => {
    io.sockets.emit(handlers.PHRASE_CHANGED, phrase);
  });

  socket.on(handlers.STOP_CLOCK, () => {
    io.sockets.emit(handlers.CLOCK_STOPPED);
  });

  socket.on(handlers.DECLARE_WINNER, winner => {
    io.sockets.emit(handlers.WINNER_DECLARED, winner);
  });

  socket.on(handlers.START_NEW_GAME, () => {
    teams = [{ id: 1, players: [] }, { id: 2, players: [] }];
    currentGame = null;
    currentPlayer = null;
    io.sockets.emit(handlers.NEW_GAME_STARTED, {
      teams,
      currentGame,
      currentPlayer
    });
  });

  socket.on(handlers.DISCONNECT, () => {
    console.log("user disconnected");
  });
});

app.use("/api/", api);

server.listen(app.get("port"), () =>
  console.log(`Listening on port ${app.get("port")}`)
);
