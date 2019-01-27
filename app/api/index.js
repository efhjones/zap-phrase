const app = require("express")();
const phrases = require("./phrases");

app.use("/phrases", phrases);

module.exports = app;
