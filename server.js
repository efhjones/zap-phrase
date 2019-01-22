const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

// our localhost port
const port = 5000;

const app = express();

// our server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);

let players = [];
let currentPlayer = null;
let currentGame = null;

io.on("connection", socket => {
  console.log("User connected");

  socket.broadcast.emit("game joined", players);

  socket.on("add player", name => {
    players = [...players, { socketId: socket.id, name }];
    console.log("player added: ", JSON.stringify(players, null, "\t"));
    socket.broadcast.emit("player added", players);
    socket.emit("player added", players);
  });

  socket.on("start game", game => {
    console.log("game started: ", game);
    currentGame = game;
    io.sockets.emit("game started", currentGame);
  });

  socket.on("set next player", player => {
    currentPlayer = player;
    io.sockets.emit("player changed", currentPlayer);
  });

  socket.on("set next phrase", phrase => {
    io.sockets.emit("phrase changed", phrase);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

const baseApi = "/api";
// create a GET route
app.get(`${baseApi}/players`, (req, res) => {
  res.send({ players });
});

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
