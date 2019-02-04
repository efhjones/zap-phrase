const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
require("dotenv").config();

const Game = require("./socket/game.js");
const Clock = require("./socket/clock.js");

const api = require("./app/api");

const app = express();
const server = http.createServer(app);

app.set("port", process.env.PORT || 5000);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

const io = socketIO(server);

new Game(io);
new Clock(io);

app.set("trust proxy", "loopback");

app.use(bodyParser.json({ type: "application/json" }));

app.use("/api", api);
app.get("/:code", express.static(path.join(__dirname, "client/build")));

server.listen(app.get("port"), () =>
  console.log(`Listening on port ${app.get("port")}`)
);
