const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
require("dotenv").config();

const Game = require("./socket/game.js");
const Clock = require("./socket/clock.js");

const api = require("./app/api");

const handlers = require("./socket/handlers.js");

const app = express();
const server = http.createServer(app);

app.set("port", process.env.PORT || 5000);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

const io = socketIO(server);

new Game(io);
new Clock(io);

io.on(handlers.CONNECTION, socket => {
  console.log("User connected");
  socket.on(handlers.DISCONNECT, () => {
    console.log("user disconnected");
  });
});

app.set("trust proxy", "loopback");
app.use(express.json());
app.use("/api", api);

server.listen(app.get("port"), () =>
  console.log(`Listening on port ${app.get("port")}`)
);
