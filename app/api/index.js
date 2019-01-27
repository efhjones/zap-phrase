const app = require("express")();
const path = require("path");
const phrases = require("./phrases");

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use("/phrases", phrases);

module.exports = app;
