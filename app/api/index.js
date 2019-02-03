const app = require("express")();
const phrases = require("./phrases");
const game = require("./game");

app.use("/game", game);
app.use("/phrases", phrases);

module.exports = app;
