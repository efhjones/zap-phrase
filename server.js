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

// This is what the socket.io syntax is like, we will work this later
io.on("connection", socket => {
  console.log("User connected");

  socket.on("set next player", player => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log("Player changed to:  ", player);
    io.sockets.emit("player changed", player);
  });

  socket.on("set next phrase", phrase => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log("Phrase changed to:  ", phrase);
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
  res.send({ players: ["Emily", "Rob", "JC", "Fernando", "Claudiu"] });
});

app.get(`${baseApi}/phrases`, (req, res) => {
  res.send({
    phrases: [
      "A blessing in disguise",
      "A dime a dozen",
      "Better late than never",
      "Beat around the bush"
    ]
  });
});
