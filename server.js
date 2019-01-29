const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
require("dotenv").config();

const Game = require("./socket/game.js");
const Clock = require("./socket/clock.js");
const Entry = require("./socket/entry.js");

const api = require("./app/api");
const router = require("./app/router");

const handlers = require("./socket/handlers.js");

const app = express();
const server = http.createServer(app);

app.set("port", process.env.PORT || 5000);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

const io = socketIO(server);

new Entry(io);
new Game(io);
new Clock(io);

io.on(handlers.CONNECTION, socket => {
  console.log("User connected");
  socket.on(handlers.DISCONNECT, () => {
    console.log("user disconnected");
  });
});

app.set("trust proxy", "loopback");

app.use("/api", api);

app.use("/", router);

server.listen(app.get("port"), () =>
  console.log(`Listening on port ${app.get("port")}`)
);

// when a new user connects
// check if there is a code in the url
// if there is, take code
// make request from DB
// if no new game, create it
// else return game
// return game to socket

// make a code for their game
