const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { sortBy } = require("lodash");
// our localhost port
const port = 5000;

const app = express();

// our server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);

let teams = [{ id: 1, players: [] }, { id: 2, players: [] }];
let currentPlayer = null;
let currentGame = null;

io.on("connection", socket => {
  console.log("User connected");

  socket.on("new connection", () => {
    socket.emit("connection detected", teams);
  });

  socket.on("add player", name => {
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
    socket.broadcast.emit("player added", teams);
    socket.emit("player added", teams);
  });

  socket.on("join game", name => {
    socket.emit("game joined", name);
  });

  socket.on("start game", game => {
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
    io.sockets.emit("game started", { game: currentGame, playerLineup });
  });

  socket.on("start clock", () => {
    io.sockets.emit("clock started");
  });

  socket.on("pause clock", () => {
    io.sockets.emit("clock paused");
  });

  socket.on("reset clock", () => {
    io.sockets.emit("clock reset");
  });

  socket.on("set next player", player => {
    currentPlayer = player;
    io.sockets.emit("player changed", currentPlayer);
  });

  socket.on("set next phrase", phrase => {
    io.sockets.emit("phrase changed", phrase);
  });

  socket.on("stop clocks", () => {
    io.sockets.emit("clocks stopped");
  });

  socket.on("declare winner", winner => {
    io.sockets.emit("winner declared", winner);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

const baseApi = "/api";

app.get(`${baseApi}/phrases`, (req, res) => {
  res.send({
    phrases: [
      "A blessing in disguise",
      "A dime a dozen",
      "Better late than never",
      "Beat around the bush"
    ]
    // phrases: []
  });
});
