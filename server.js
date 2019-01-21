const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

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
