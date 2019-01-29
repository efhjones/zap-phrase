const app = require("express")();
const games = require("./games");

app.use("/", games);

module.exports = app;
